from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from models.auth_models import UserRole

# ==========================================
# Base Authentication Schemas
# ==========================================
class UserBase(BaseModel):
    email: EmailStr
    username: str
    role: UserRole

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    license_number: Optional[str] = None
    license_document_url: Optional[str] = None
    professional_title: Optional[str] = None
    specialization: Optional[str] = None
    
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    role: UserRole
    is_active: bool
    is_verified: bool = False # Added default to prevent crashes if not in DB
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional[UserResponse] = None # Made Optional so login endpoint doesn't crash

class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[UserRole] = None


# ==========================================
# Mom-specific Schemas
# ==========================================
class MomProfileCreate(BaseModel):
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    due_date: Optional[datetime] = None
    baby_birth_date: Optional[datetime] = None
    number_of_children: int = 0
    preferred_language: str = "english"
    timezone: str = "UTC"

class MomProfileResponse(BaseModel):
    id: int
    user_id: int
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    due_date: Optional[datetime] = None
    baby_birth_date: Optional[datetime] = None
    number_of_children: int = 0
    preferred_language: str = "english"
    timezone: str = "UTC"
    has_completed_onboarding: bool = False
    onboarding_completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# ==========================================
# Medical Professional Schemas
# ==========================================
class MedicalProfileCreate(BaseModel):
    first_name: str
    last_name: str
    professional_title: str
    license_number: Optional[str] = None
    specialization: Optional[str] = None
    years_of_experience: Optional[int] = None
    hospital_or_clinic: Optional[str] = None
    practice_address: Optional[str] = None
    phone_number: Optional[str] = None

class MedicalProfileResponse(BaseModel):
    id: int
    user_id: int
    first_name: str
    last_name: str
    professional_title: str
    license_number: Optional[str] = None
    specialization: Optional[str] = None
    years_of_experience: Optional[int] = None
    hospital_or_clinic: Optional[str] = None
    practice_address: Optional[str] = None
    phone_number: Optional[str] = None
    is_license_verified: bool = False
    verification_document_url: Optional[str] = None
    
    class Config:
        from_attributes = True


# ==========================================
# Auth Response Wrappers
# ==========================================
class AuthResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Token] = None
    requires_onboarding: bool = False

class ProfileResponse(BaseModel):
    success: bool
    message: str
    data: Optional[MomProfileResponse] = None

class MedProfileResponse(BaseModel): # FIXED: Renamed to avoid duplicate class name
    success: bool
    message: str
    data: Optional[MedicalProfileResponse] = None

class QuestionnaireResponse(BaseModel): # FIXED: Added back for the router
    success: bool
    message: str
    requires_onboarding: bool
