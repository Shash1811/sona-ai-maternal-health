from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum, Text, ForeignKey, JSON, Float, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

# Import the Base from database.py to ensure all models use the same Base
from models.database import Base

class UserRole(enum.Enum):
    MOM = "mom"
    MEDICAL_PROFESSIONAL = "medical_professional"

class User(Base):
    """Core user table with authentication credentials"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships to role-specific profiles
    mom_profile = relationship("MomProfile", back_populates="user", uselist=False)
    medical_profile = relationship("MedicalProfessionalProfile", back_populates="user", uselist=False)
    patient_profile = relationship(
        "PatientProfile",
        back_populates="user",
        uselist=False,
        foreign_keys="PatientProfile.user_id",
    )

class MomProfile(Base):
    """Extended profile for Mom users"""
    __tablename__ = "mom_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Basic mom information
    first_name = Column(String)
    last_name = Column(String)
    phone_number = Column(String)
    date_of_birth = Column(DateTime)
    
    # Pregnancy/baby information
    due_date = Column(DateTime)
    baby_birth_date = Column(DateTime)
    number_of_children = Column(Integer, default=0)
    
    # Preferences
    preferred_language = Column(String, default="english")
    timezone = Column(String, default="UTC")
    
    # Onboarding status
    has_completed_onboarding = Column(Boolean, default=False)
    onboarding_completed_at = Column(DateTime(timezone=True))
    
    # Questionnaire data stored as JSON
    questionnaire_data = Column(JSON, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship back to User
    user = relationship("User", back_populates="mom_profile")


class PatientProfile(Base):
    """Extended clinical patient profile — stores structured health data for RAG personalization."""
    __tablename__ = "patient_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False, index=True)

    # Doctor-Patient assignment
    assigned_doctor_id = Column(
        Integer, ForeignKey("users.id"), nullable=True, index=True
    )  # FK → users.id of a MEDICAL_PROFESSIONAL

    # Identity
    first_name = Column(String, nullable=False)
    age = Column(Integer)
    phone = Column(String)

    # Pregnancy / postpartum status (mutually exclusive)
    gestation_week = Column(Integer, nullable=True)
    days_postpartum = Column(Integer, nullable=True)

    # Clinical history stored as JSON arrays
    medical_history = Column(JSON, default=list)
    allergies = Column(JSON, default=list)
    current_medications = Column(JSON, default=list)

    # Most recently self-reported vitals
    last_bp = Column(String, nullable=True)
    last_hr = Column(Integer, nullable=True)
    last_weight_kg = Column(Float, nullable=True)
    last_temp_c = Column(Float, nullable=True)

    # Onboarding questionnaire — raw answers stored as JSON
    onboarding_questionnaire = Column(JSON, nullable=True)
    onboarding_completed_at = Column(DateTime(timezone=True), nullable=True)

    # Agentic LLM-generated clinical baseline summary (produced on questionnaire submit)
    clinical_baseline_summary = Column(Text, nullable=True)

    # Lifestyle fields (extracted from questionnaire for fast SQL queries)
    stress_level = Column(Integer, nullable=True)          # 1-10
    sleep_hours = Column(Float, nullable=True)             # hours/night
    primary_health_goals = Column(JSON, default=list)
    feeding_method = Column(String, nullable=True)         # breastfeeding/formula/combination
    has_anxiety = Column(Boolean, default=False)
    has_depression = Column(Boolean, default=False)

    # Free-text notes from questionnaire / onboarding
    additional_notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="patient_profile", foreign_keys=[user_id])
    assigned_doctor = relationship(
        "User", foreign_keys=[assigned_doctor_id], uselist=False
    )
    triage_records = relationship(
        "TriageRecord", back_populates="patient_profile",
        order_by="TriageRecord.analyzed_at.desc()"
    )


class TriageRecord(Base):
    """Stores the output of the Agentic Risk Triage Engine for each analysis run."""
    __tablename__ = "triage_records"

    id = Column(Integer, primary_key=True, index=True)
    patient_profile_id = Column(Integer, ForeignKey("patient_profiles.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    # Agentic risk assessment output
    risk_level = Column(String, nullable=False)           # "critical" | "high" | "routine"
    primary_symptom = Column(String, nullable=False)
    clinical_summary = Column(Text, nullable=False)       # 2-sentence AI-generated summary
    er_advised = Column(Boolean, default=False)

    # Source data snapshot (what messages were analysed)
    messages_analyzed = Column(Integer, default=0)
    analysis_trigger = Column(String, default="manual")  # "manual" | "auto" | "chat_threshold"

    analyzed_at = Column(DateTime(timezone=True), server_default=func.now())
    is_current = Column(Boolean, default=True)            # Only latest record is "current"

    patient_profile = relationship("PatientProfile", back_populates="triage_records")
    user = relationship("User")

class MedicalProfessionalProfile(Base):
    """Extended profile for Medical Professional users"""
    __tablename__ = "medical_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Professional information
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    professional_title = Column(String, nullable=False)  # Dr., RN, etc.
    
    # Credentials
    license_number = Column(String, unique=True)
    specialization = Column(String)  # OB/GYN, Pediatrician, etc.
    years_of_experience = Column(Integer)
    
    # Practice information
    hospital_or_clinic = Column(String)
    practice_address = Column(Text)
    phone_number = Column(String)
    
    # Verification status
    is_license_verified = Column(Boolean, default=False)
    verification_document_url = Column(String)  # URL to uploaded license
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship back to User
    user = relationship("User", back_populates="medical_profile")

class Session(Base):
    """User sessions for authentication"""
    __tablename__ = "sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_token = Column(String, unique=True, nullable=False, index=True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User")

class ChatMessage(Base):
    """Chat messages for conversation history - powers recommendation engine"""
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    role = Column(String, nullable=False)  # "user" or "assistant"
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    # Optional fields for AI metadata
    session_id = Column(String, nullable=True, index=True)
    emotion_detected = Column(String, nullable=True)
    is_grounding_exercise = Column(Boolean, default=False)
    suggestions = Column(Text, nullable=True)  # JSON string of suggestions
    
    # Relationship back to User
    user = relationship("User", back_populates="chat_messages")

# Add relationship to User model
User.chat_messages = relationship("ChatMessage", back_populates="user", order_by="ChatMessage.timestamp.desc()")

class Appointment(Base):
    """Appointments scheduled with medical professionals or personal tracking items"""
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    doctor_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    
    title = Column(String, nullable=False)
    doctor_name = Column(String, nullable=True)
    date = Column(String, nullable=False)  # format: YYYY-MM-DD
    time = Column(String, nullable=False)  # format: HH:MM
    location = Column(String, nullable=True)
    type = Column(String, nullable=False, default="checkup")  # checkup, ultrasound, vaccination, test, consult, other
    notes = Column(Text, nullable=True)
    status = Column(String, nullable=False, default="scheduled")  # scheduled, completed, cancelled
    meeting_url = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id])
    doctor = relationship("User", foreign_keys=[doctor_id])

