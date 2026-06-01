from typing import Dict, Any, List, Optional
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field, field_validator

class PregnancyStatus(str, Enum):
    PLANNING = "planning"
    PREGNANT = "pregnant"
    POSTPARTUM = "postpartum"
    NOT_APPLICABLE = "not_applicable"

class DeliveryMethod(str, Enum):
    VAGINAL = "vaginal"
    C_SECTION = "c_section"
    PLANNING = "planning"
    UNKNOWN = "unknown"

class FeedingMethod(str, Enum):
    BREASTFEEDING = "breastfeeding"
    FORMULA = "formula"
    COMBINATION = "combination"
    NOT_APPLICABLE = "not_applicable"

class MaternalHealthInfo(BaseModel):
    """Comprehensive maternal health questionnaire data"""
    
    # Basic Information
    user_id: Optional[str] = Field(default=None, description="Reference to PostgreSQL user ID")
    questionnaire_version: str = Field(default="1.0", description="Version of questionnaire")
    completed_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Pregnancy & Baby Information
    pregnancy_status: PregnancyStatus
    due_date: Optional[datetime] = None
    baby_birth_date: Optional[datetime] = None
    delivery_method: Optional[DeliveryMethod] = None
    number_of_children: int = Field(default=0, ge=0)
    
    # Current Pregnancy Details (if applicable)
    current_weeks_pregnant: Optional[int] = Field(None, ge=0, le=42)
    is_high_risk: bool = False
    high_risk_factors: List[str] = Field(default_factory=list)
    
    # Postpartum Information (if applicable)
    weeks_postpartum: Optional[int] = Field(None, ge=0)
    feeding_method: Optional[FeedingMethod] = None
    has_postpartum_complications: bool = False
    postpartum_complications: List[str] = Field(default_factory=list)
    
    # Medical History
    pre_existing_conditions: List[str] = Field(default_factory=list)
    medications: List[str] = Field(default_factory=list)
    allergies: List[str] = Field(default_factory=list)
    previous_pregnancies: int = Field(default=0, ge=0)
    
    # Mental Health
    has_anxiety: bool = False
    has_depression: bool = False
    has_postpartum_depression: bool = False
    stress_level: int = Field(default=5, ge=1, le=10, description="1-10 scale")
    
    # Lifestyle
    sleep_hours_per_night: float = Field(default=7.0, ge=0, le=24)
    exercise_frequency: str = Field(default="none", description="none, rarely, sometimes, often, daily")
    smoking_status: str = Field(default="never", description="never, former, current")
    alcohol_consumption: str = Field(default="none", description="none, occasional, regular")
    
    # Dietary Preferences & Restrictions
    dietary_preferences: List[str] = Field(default_factory=list)
    food_allergies: List[str] = Field(default_factory=list)
    food_restrictions: List[str] = Field(default_factory=list)
    takes_prenatal_vitamins: bool = False
    
    # Support System
    has_partner_support: bool = False
    has_family_support: bool = False
    has_friends_support: bool = False
    has_professional_support: bool = False
    support_person_name: Optional[str] = None
    
    # Goals & Concerns
    primary_health_goals: List[str] = Field(default_factory=list)
    main_concerns: List[str] = Field(default_factory=list)
    areas_needing_support: List[str] = Field(default_factory=list)
    
    # Preferences for App Features
    interested_in_diet_planning: bool = True
    interested_in_exercise_guidance: bool = True
    interested_in_mental_health_support: bool = True
    interested_in_medical_tracking: bool = True
    interested_in_community_support: bool = True

    @field_validator(
        "high_risk_factors",
        "postpartum_complications",
        "pre_existing_conditions",
        "medications",
        "allergies",
        "dietary_preferences",
        "food_allergies",
        "food_restrictions",
        "primary_health_goals",
        "main_concerns",
        "areas_needing_support",
        mode="before",
    )
    @classmethod
    def coerce_text_to_list(cls, value):
        if value is None or value == "":
            return []
        if isinstance(value, str):
            return [value]
        return value
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class MaternalHealthUpdate(BaseModel):
    """Schema for updating maternal health information"""
    pregnancy_status: Optional[PregnancyStatus] = None
    due_date: Optional[datetime] = None
    baby_birth_date: Optional[datetime] = None
    delivery_method: Optional[DeliveryMethod] = None
    current_weeks_pregnant: Optional[int] = Field(None, ge=0, le=42)
    weeks_postpartum: Optional[int] = Field(None, ge=0)
    feeding_method: Optional[FeedingMethod] = None
    stress_level: Optional[int] = Field(None, ge=1, le=10)
    sleep_hours_per_night: Optional[float] = Field(None, ge=0, le=24)
    exercise_frequency: Optional[str] = None
    main_concerns: Optional[List[str]] = None
    primary_health_goals: Optional[List[str]] = None

class QuestionnaireResponse(BaseModel):
    """Response wrapper for questionnaire operations"""
    success: bool
    message: str
    data: Optional[MaternalHealthInfo] = None
    requires_onboarding: bool = False
