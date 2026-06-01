"""
Pydantic schemas for PatientProfile, TriageRecord, and triage API I/O.
"""
from __future__ import annotations

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


# ─── PatientProfile Schemas ───────────────────────────────

class PatientProfileCreate(BaseModel):
    first_name: str
    age: Optional[int] = None
    phone: Optional[str] = None
    gestation_week: Optional[int] = None
    days_postpartum: Optional[int] = None
    medical_history: List[str] = Field(default_factory=list)
    allergies: List[str] = Field(default_factory=list)
    current_medications: List[str] = Field(default_factory=list)
    last_bp: Optional[str] = None
    last_hr: Optional[int] = None
    last_weight_kg: Optional[float] = None
    last_temp_c: Optional[float] = None
    additional_notes: Optional[str] = None


class PatientProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    age: Optional[int] = None
    phone: Optional[str] = None
    gestation_week: Optional[int] = None
    days_postpartum: Optional[int] = None
    medical_history: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    current_medications: Optional[List[str]] = None
    last_bp: Optional[str] = None
    last_hr: Optional[int] = None
    last_weight_kg: Optional[float] = None
    last_temp_c: Optional[float] = None
    additional_notes: Optional[str] = None


class PatientProfileResponse(BaseModel):
    id: int
    user_id: int
    first_name: str
    age: Optional[int]
    phone: Optional[str]
    gestation_week: Optional[int]
    days_postpartum: Optional[int]
    medical_history: List[str]
    allergies: List[str]
    current_medications: List[str]
    last_bp: Optional[str]
    last_hr: Optional[int]
    last_weight_kg: Optional[float]
    last_temp_c: Optional[float]
    additional_notes: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# ─── TriageRecord Schemas ─────────────────────────────────

class TriageAnalysisRequest(BaseModel):
    """Request body for POST /api/triage/analyze"""
    user_id: int
    trigger: str = "manual"   # "manual" | "auto" | "chat_threshold"


class TriageRecordResponse(BaseModel):
    """Serialised triage record returned to the Provider Dashboard."""
    id: int
    user_id: int
    patient_profile_id: int
    risk_level: str                   # "critical" | "high" | "routine"
    primary_symptom: str
    clinical_summary: str
    er_advised: bool
    messages_analyzed: int
    analysis_trigger: str
    analyzed_at: Optional[datetime]
    is_current: bool

    class Config:
        from_attributes = True


class TriageAnalysisResponse(BaseModel):
    """Full response from the triage engine, including freshly computed record."""
    success: bool
    triage: TriageRecordResponse
    patient_name: str


# ─── Provider Dashboard – enriched patient list item ─────

class PatientListItem(BaseModel):
    """Compact record for the smart triage queue."""
    id: int
    name: str
    email: str
    age: Optional[int]
    gestation_week: Optional[int]
    days_postpartum: Optional[int]
    primary_symptom: str
    risk_level: str
    er_advised: bool
    clinical_summary: str
    clinical_baseline_summary: Optional[str] = None   # LLM-generated onboarding summary
    last_seen: Optional[str]
    medical_history: List[str]
    allergies: List[str]
    current_medications: List[str]
    last_bp: Optional[str]
    last_hr: Optional[int]
    # Questionnaire-derived lifestyle fields
    stress_level: Optional[int] = None
    sleep_hours: Optional[float] = None
    has_anxiety: bool = False
    has_depression: bool = False
    feeding_method: Optional[str] = None
    primary_health_goals: List[str] = Field(default_factory=list)

