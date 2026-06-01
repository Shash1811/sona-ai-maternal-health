from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, HTTPBearer
from sqlalchemy.orm import Session
from datetime import timedelta, datetime

# Database imports - linked to our unified database.py!
from models.database import get_pg_db as get_db
from models.database import db as mongodb_db

# Assuming these are your actual model and schema names
from models.auth_models import User, UserRole, MedicalProfessionalProfile, MomProfile
from models.auth_schemas import (
    UserCreate, UserResponse, Token, MedProfileResponse, 
    MedicalProfileCreate, MedicalProfileResponse, ProfileResponse, 
    MomProfileResponse, QuestionnaireResponse
)

# Added all the missing get_current_* functions here!
from utils.auth_utils import (
    authenticate_user, 
    create_access_token, 
    get_password_hash,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_current_user,
    get_current_medical_professional,
    get_current_mom
)

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/signup", response_model=UserResponse)
async def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    existing_username = db.query(User).filter(User.username == user_data.username).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )

    if user_data.role == UserRole.MEDICAL_PROFESSIONAL:
        if not user_data.license_number or not user_data.license_document_url:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Medical professionals must submit a license number and license document before signup"
            )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password,
        role=user_data.role,
        is_active=True,
        created_at=datetime.utcnow()
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    if db_user.role == UserRole.MOM:
        db.add(
            MomProfile(
                user_id=db_user.id,
                preferred_language="english",
                timezone="UTC",
                has_completed_onboarding=False,
            )
        )
        db.commit()
    elif db_user.role == UserRole.MEDICAL_PROFESSIONAL:
        db.add(
            MedicalProfessionalProfile(
                user_id=db_user.id,
                first_name=user_data.username,
                last_name="",
                professional_title=user_data.professional_title or "Medical Professional",
                license_number=user_data.license_number,
                specialization=user_data.specialization,
                verification_document_url=user_data.license_document_url,
                is_license_verified=False,
            )
        )
        db.commit()
    
    # Create MongoDB profile for additional data
    await mongodb_db.save_user_profile(
        str(db_user.id),
        {
            "username": db_user.username,
            "email": db_user.email,
            "role": db_user.role.value,
            "preferences": {},
            "onboarding_completed": False
        }
    )
    
    return UserResponse(
        id=db_user.id,
        email=db_user.email,
        username=db_user.username,
        role=db_user.role,
        is_active=db_user.is_active,
        created_at=db_user.created_at
    )

@router.post("/login", response_model=Token)
async def login(user_credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Authenticate user and return access token"""
    user = authenticate_user(db, user_credentials.username, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role.value},
        expires_delta=access_token_expires
    )
    
    # Update last login in MongoDB
    await mongodb_db.save_user_profile(
        str(user.id),
        {
            "last_login": datetime.utcnow(),
            "login_count": 1  # This would need to be incremented properly
        }
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(user)
    }

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """Logout user (client-side token removal)"""
    # Update logout time in MongoDB
    await mongodb_db.save_user_profile(
        str(current_user.id),
        {
            "last_logout": datetime.utcnow()
        }
    )
    
    return {"message": "Successfully logged out"}

@router.post("/medical/profile", response_model=MedProfileResponse)
async def create_medical_profile(
    profile_data: MedicalProfileCreate,
    current_user: User = Depends(get_current_medical_professional),
    db: Session = Depends(get_db)
):
    """Create or update medical professional profile"""
    
    # Check if profile already exists
    existing_profile = db.query(MedicalProfessionalProfile).filter(
        MedicalProfessionalProfile.user_id == current_user.id
    ).first()
    
    if existing_profile:
        # Update existing profile
        for field, value in profile_data.dict(exclude_unset=True).items():
            setattr(existing_profile, field, value)
        db.commit()
        db.refresh(existing_profile)
        profile = existing_profile
    else:
        # Create new profile
        profile = MedicalProfessionalProfile(user_id=current_user.id, **profile_data.dict())
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    return MedProfileResponse(
        success=True,
        message="Medical profile saved successfully",
        data=MedicalProfileResponse.from_orm(profile)
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse.from_orm(current_user)

@router.get("/mom/profile", response_model=ProfileResponse)
async def get_mom_profile(
    current_user: User = Depends(get_current_mom),
    db: Session = Depends(get_db)
):
    """Get mom profile information"""
    profile = db.query(MomProfile).filter(MomProfile.user_id == current_user.id).first()
    
    if not profile:
        return ProfileResponse(
            success=False,
            message="Profile not found",
            data=None
        )
    
    return ProfileResponse(
        success=True,
        message="Profile retrieved successfully",
        data=MomProfileResponse.from_orm(profile)
    )

@router.get("/medical/profile", response_model=MedProfileResponse)
async def get_medical_profile(
    current_user: User = Depends(get_current_medical_professional),
    db: Session = Depends(get_db)
):
    """Get medical professional profile information"""
    profile = db.query(MedicalProfessionalProfile).filter(
        MedicalProfessionalProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        return MedProfileResponse(
            success=False,
            message="Profile not found",
            data=None
        )
    
    return MedProfileResponse(
        success=True,
        message="Profile retrieved successfully",
        data=MedicalProfileResponse.from_orm(profile)
    )

@router.get("/check-onboarding", response_model=QuestionnaireResponse)
async def check_onboarding_status(current_user: User = Depends(get_current_user)):
    """Check if user needs to complete onboarding questionnaire"""
    
    if current_user.role != UserRole.MOM:
        return QuestionnaireResponse(
            success=True,
            message="Onboarding not required for medical professionals",
            requires_onboarding=False
        )
    
    has_completed = await mongodb_db.has_completed_questionnaire(str(current_user.id))
    
    return QuestionnaireResponse(
        success=True,
        message="Onboarding status checked",
        requires_onboarding=not has_completed
    )
