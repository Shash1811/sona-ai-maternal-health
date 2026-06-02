from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from models.auth_models import User, UserRole, MomProfile, PatientProfile
from models.maternal_schemas import (
    MaternalHealthInfo, MaternalHealthUpdate, QuestionnaireResponse
)
from utils.auth_utils import get_db, get_current_mom
from models.database import db as mongodb_db

router = APIRouter(prefix="/questionnaire", tags=["questionnaire"])


def _run_summarizer_and_save(user_id: int, questionnaire_payload: dict):
    """
    Background task: generate the clinical_baseline_summary from the raw
    questionnaire data and persist it to PatientProfile.
    Runs after the HTTP response has already been sent to the client.
    """
    try:
        from ai.questionnaire_summarizer import generate_clinical_baseline_summary
        from models.database import SessionLocal

        summary = generate_clinical_baseline_summary(questionnaire_payload)

        db: Session = SessionLocal()
        try:
            profile = db.query(PatientProfile).filter(
                PatientProfile.user_id == user_id
            ).first()
            if profile:
                profile.clinical_baseline_summary = summary
                db.commit()
                print(f"[Summarizer] clinical_baseline_summary saved for user_id={user_id}")
        finally:
            db.close()
    except Exception as exc:
        print(f"[Summarizer] Background task failed for user_id={user_id}: {exc}")


@router.post("/maternal-health", response_model=QuestionnaireResponse)
async def save_maternal_health_questionnaire(
    questionnaire_data: MaternalHealthInfo,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_mom),
    db: Session = Depends(get_db)
):
    """
    Save maternal health questionnaire.
    - Persists raw answers to MongoDB (legacy) and MomProfile.questionnaire_data
    - Upserts PatientProfile with structured clinical fields
    - Fires a background task to generate clinical_baseline_summary via LLM
    """
    try:
        questionnaire_payload = questionnaire_data.model_dump(mode="json")
        questionnaire_payload["user_id"] = str(current_user.id)
        questionnaire_payload["completed_at"] = datetime.now(timezone.utc).isoformat()

        # 1. Save to MongoDB (backward compat)
        await mongodb_db.save_maternal_questionnaire(
            str(current_user.id),
            questionnaire_payload
        )

        # 2. Update MomProfile
        mom_profile = db.query(MomProfile).filter(
            MomProfile.user_id == current_user.id
        ).first()

        if mom_profile:
            mom_profile.has_completed_onboarding = True
            mom_profile.onboarding_completed_at = datetime.now(timezone.utc)
            mom_profile.number_of_children = questionnaire_data.number_of_children
            mom_profile.due_date = questionnaire_data.due_date
            mom_profile.baby_birth_date = questionnaire_data.baby_birth_date
            mom_profile.questionnaire_data = questionnaire_payload

        # 3. Upsert PatientProfile with structured questionnaire fields
        patient_profile = db.query(PatientProfile).filter(
            PatientProfile.user_id == current_user.id
        ).first()

        # Derive gestation/postpartum from questionnaire
        gestation_week = questionnaire_data.current_weeks_pregnant
        days_postpartum = None
        if questionnaire_data.weeks_postpartum is not None:
            days_postpartum = questionnaire_data.weeks_postpartum * 7

        now = datetime.now(timezone.utc)

        if not patient_profile:
            patient_profile = PatientProfile(
                user_id=current_user.id,
                first_name=current_user.username.split()[0] if current_user.username else current_user.email.split("@")[0],
                gestation_week=gestation_week,
                days_postpartum=days_postpartum,
                medical_history=questionnaire_data.pre_existing_conditions or [],
                allergies=(questionnaire_data.allergies or []) + (questionnaire_data.food_allergies or []),
                current_medications=[m for m in questionnaire_data.medications if m] if questionnaire_data.medications else [],
                stress_level=questionnaire_data.stress_level,
                sleep_hours=questionnaire_data.sleep_hours_per_night,
                primary_health_goals=questionnaire_data.primary_health_goals or [],
                feeding_method=questionnaire_data.feeding_method.value if questionnaire_data.feeding_method else None,
                has_anxiety=questionnaire_data.has_anxiety,
                has_depression=questionnaire_data.has_depression or questionnaire_data.has_postpartum_depression,
                onboarding_questionnaire=questionnaire_payload,
                onboarding_completed_at=now,
                additional_notes=", ".join(questionnaire_data.main_concerns) if questionnaire_data.main_concerns else None,
            )
            db.add(patient_profile)
        else:
            # Update existing profile
            patient_profile.gestation_week = gestation_week
            patient_profile.days_postpartum = days_postpartum
            patient_profile.medical_history = questionnaire_data.pre_existing_conditions or []
            patient_profile.allergies = (questionnaire_data.allergies or []) + (questionnaire_data.food_allergies or [])
            patient_profile.current_medications = [m for m in questionnaire_data.medications if m] if questionnaire_data.medications else []
            patient_profile.stress_level = questionnaire_data.stress_level
            patient_profile.sleep_hours = questionnaire_data.sleep_hours_per_night
            patient_profile.primary_health_goals = questionnaire_data.primary_health_goals or []
            patient_profile.feeding_method = questionnaire_data.feeding_method.value if questionnaire_data.feeding_method else None
            patient_profile.has_anxiety = questionnaire_data.has_anxiety
            patient_profile.has_depression = questionnaire_data.has_depression or questionnaire_data.has_postpartum_depression
            patient_profile.onboarding_questionnaire = questionnaire_payload
            patient_profile.onboarding_completed_at = now
            patient_profile.additional_notes = ", ".join(questionnaire_data.main_concerns) if questionnaire_data.main_concerns else None

        db.commit()

        # 4. Fire background task to generate clinical_baseline_summary
        background_tasks.add_task(
            _run_summarizer_and_save,
            current_user.id,
            questionnaire_payload,
        )

        return QuestionnaireResponse(
            success=True,
            message="Questionnaire saved. Clinical summary is being generated in the background.",
            data=MaternalHealthInfo(**questionnaire_payload),
            requires_onboarding=False
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save questionnaire: {str(e)}"
        )


@router.get("/maternal-health", response_model=QuestionnaireResponse)
async def get_maternal_health_questionnaire(
    current_user: User = Depends(get_current_mom)
):
    """Get maternal health questionnaire data"""
    
    try:
        questionnaire_data = await mongodb_db.get_maternal_questionnaire(str(current_user.id))
        
        if not questionnaire_data:
            return QuestionnaireResponse(
                success=False,
                message="No questionnaire data found",
                requires_onboarding=True
            )
        
        # Convert MongoDB document to Pydantic model
        maternal_info = MaternalHealthInfo(**questionnaire_data)
        
        return QuestionnaireResponse(
            success=True,
            message="Questionnaire retrieved successfully",
            data=maternal_info,
            requires_onboarding=False
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve questionnaire: {str(e)}"
        )

@router.put("/maternal-health", response_model=QuestionnaireResponse)
async def update_maternal_health_info(
    update_data: MaternalHealthUpdate,
    current_user: User = Depends(get_current_mom)
):
    """Update specific fields in maternal health information"""
    
    try:
        # Check if questionnaire exists
        existing_data = await mongodb_db.get_maternal_questionnaire(str(current_user.id))
        if not existing_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No questionnaire data found. Please complete the full questionnaire first."
            )
        
        # Update only provided fields
        await mongodb_db.update_maternal_health_info(
            str(current_user.id),
            update_data.model_dump(exclude_unset=True)
        )
        
        # Get updated data
        updated_data = await mongodb_db.get_maternal_questionnaire(str(current_user.id))
        maternal_info = MaternalHealthInfo(**updated_data)
        
        return QuestionnaireResponse(
            success=True,
            message="Health information updated successfully",
            data=maternal_info,
            requires_onboarding=False
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update health information: {str(e)}"
        )

@router.get("/pregnancy-status-options")
async def get_pregnancy_status_options():
    """Get available pregnancy status options"""
    from models.maternal_schemas import PregnancyStatus
    return {
        "options": [
            {"value": status.value, "label": status.value.replace("_", " ").title()}
            for status in PregnancyStatus
        ]
    }

@router.get("/delivery-method-options")
async def get_delivery_method_options():
    """Get available delivery method options"""
    from models.maternal_schemas import DeliveryMethod
    return {
        "options": [
            {"value": method.value, "label": method.value.replace("_", " ").title()}
            for method in DeliveryMethod
        ]
    }

@router.get("/feeding-method-options")
async def get_feeding_method_options():
    """Get available feeding method options"""
    from models.maternal_schemas import FeedingMethod
    return {
        "options": [
            {"value": method.value, "label": method.value.replace("_", " ").title()}
            for method in FeedingMethod
        ]
    }

@router.get("/questionnaire-template")
async def get_questionnaire_template():
    """Get questionnaire template structure for frontend"""
    
    template = {
        "sections": [
            {
                "id": "basic_info",
                "title": "Basic Information",
                "fields": [
                    {"name": "pregnancy_status", "type": "select", "required": True, "options": "pregnancy_status"},
                    {"name": "due_date", "type": "date", "required": False},
                    {"name": "baby_birth_date", "type": "date", "required": False},
                    {"name": "number_of_children", "type": "number", "required": True, "min": 0}
                ]
            },
            {
                "id": "pregnancy_details",
                "title": "Pregnancy Details",
                "conditional": "pregnancy_status == 'pregnant'",
                "fields": [
                    {"name": "current_weeks_pregnant", "type": "number", "required": True, "min": 0, "max": 42},
                    {"name": "is_high_risk", "type": "checkbox", "required": False},
                    {"name": "high_risk_factors", "type": "multiselect", "required": False, 
                     "options": ["Gestational diabetes", "Preeclampsia", "Multiple pregnancy", "Advanced maternal age", "Other"]}
                ]
            },
            {
                "id": "postpartum_details",
                "title": "Postpartum Information",
                "conditional": "pregnancy_status == 'postpartum'",
                "fields": [
                    {"name": "weeks_postpartum", "type": "number", "required": True, "min": 0},
                    {"name": "delivery_method", "type": "select", "required": True, "options": "delivery_method"},
                    {"name": "feeding_method", "type": "select", "required": True, "options": "feeding_method"},
                    {"name": "has_postpartum_complications", "type": "checkbox", "required": False}
                ]
            },
            {
                "id": "medical_history",
                "title": "Medical History",
                "fields": [
                    {"name": "pre_existing_conditions", "type": "multiselect", "required": False,
                     "options": ["Hypertension", "Diabetes", "Thyroid disorders", "Heart disease", "Autoimmune disorders", "Other"]},
                    {"name": "medications", "type": "text", "required": False},
                    {"name": "allergies", "type": "text", "required": False},
                    {"name": "previous_pregnancies", "type": "number", "required": True, "min": 0}
                ]
            },
            {
                "id": "mental_health",
                "title": "Mental Health",
                "fields": [
                    {"name": "has_anxiety", "type": "checkbox", "required": False},
                    {"name": "has_depression", "type": "checkbox", "required": False},
                    {"name": "has_postpartum_depression", "type": "checkbox", "required": False},
                    {"name": "stress_level", "type": "scale", "required": True, "min": 1, "max": 10}
                ]
            },
            {
                "id": "lifestyle",
                "title": "Lifestyle",
                "fields": [
                    {"name": "sleep_hours_per_night", "type": "number", "required": True, "min": 0, "max": 24, "step": 0.5},
                    {"name": "exercise_frequency", "type": "select", "required": True,
                     "options": ["none", "rarely", "sometimes", "often", "daily"]},
                    {"name": "smoking_status", "type": "select", "required": True,
                     "options": ["never", "former", "current"]},
                    {"name": "alcohol_consumption", "type": "select", "required": True,
                     "options": ["none", "occasional", "regular"]}
                ]
            },
            {
                "id": "dietary_preferences",
                "title": "Dietary Preferences",
                "fields": [
                    {"name": "dietary_preferences", "type": "multiselect", "required": False,
                     "options": ["Vegetarian", "Vegan", "Gluten-free", "Dairy-free", "Low-carb", "Organic", "Other"]},
                    {"name": "food_allergies", "type": "text", "required": False},
                    {"name": "food_restrictions", "type": "text", "required": False},
                    {"name": "takes_prenatal_vitamins", "type": "checkbox", "required": False}
                ]
            },
            {
                "id": "support_system",
                "title": "Support System",
                "fields": [
                    {"name": "has_partner_support", "type": "checkbox", "required": False},
                    {"name": "has_family_support", "type": "checkbox", "required": False},
                    {"name": "has_friends_support", "type": "checkbox", "required": False},
                    {"name": "has_professional_support", "type": "checkbox", "required": False},
                    {"name": "support_person_name", "type": "text", "required": False}
                ]
            },
            {
                "id": "goals_concerns",
                "title": "Goals and Concerns",
                "fields": [
                    {"name": "primary_health_goals", "type": "multiselect", "required": False,
                     "options": ["Healthy pregnancy", "Postpartum recovery", "Mental wellness", "Physical fitness", "Nutrition", "Sleep improvement"]},
                    {"name": "main_concerns", "type": "multiselect", "required": False,
                     "options": ["Pregnancy complications", "Postpartum depression", "Baby health", "Weight management", "Relationship stress", "Work-life balance"]},
                    {"name": "areas_needing_support", "type": "multiselect", "required": False,
                     "options": ["Medical guidance", "Emotional support", "Nutrition advice", "Exercise planning", "Parenting tips", "Career guidance"]}
                ]
            },
            {
                "id": "app_preferences",
                "title": "App Preferences",
                "fields": [
                    {"name": "interested_in_diet_planning", "type": "checkbox", "required": False},
                    {"name": "interested_in_exercise_guidance", "type": "checkbox", "required": False},
                    {"name": "interested_in_mental_health_support", "type": "checkbox", "required": False},
                    {"name": "interested_in_medical_tracking", "type": "checkbox", "required": False},
                    {"name": "interested_in_community_support", "type": "checkbox", "required": False}
                ]
            }
        ]
    }
    
    return template
