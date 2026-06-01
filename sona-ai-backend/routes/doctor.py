from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from models.auth_models import ChatMessage, MedicalProfessionalProfile, MomProfile, PatientProfile, TriageRecord, User, UserRole
from models.database import get_pg_db
from utils.auth_utils import get_current_medical_professional

router = APIRouter(prefix="/api/doctor", tags=["doctor"])


class DoctorMessageCreate(BaseModel):
    patient_id: int
    message: str


class ConsultCreate(BaseModel):
    patient_id: int
    reason: Optional[str] = None


@router.get("/profile-status")
async def profile_status(
    current_user: User = Depends(get_current_medical_professional),
    db: Session = Depends(get_pg_db),
):
    profile = db.query(MedicalProfessionalProfile).filter(MedicalProfessionalProfile.user_id == current_user.id).first()
    return {
        "is_license_submitted": bool(profile and profile.license_number and profile.verification_document_url),
        "is_license_verified": bool(profile and profile.is_license_verified),
        "profile": {
            "professional_title": profile.professional_title if profile else None,
            "license_number": profile.license_number if profile else None,
            "specialization": profile.specialization if profile else None,
        } if profile else None,
    }


@router.get("/patients")
async def list_patients(
    current_user: User = Depends(get_current_medical_professional),
    db: Session = Depends(get_pg_db),
):
    """
    Return all MOM patients enriched with their PatientProfile and latest triage record.
    Sorted by risk level (critical first).
    """
    rows = (
        db.query(User, MomProfile, PatientProfile, TriageRecord)
        .join(MomProfile, MomProfile.user_id == User.id, isouter=True)
        .join(PatientProfile, PatientProfile.user_id == User.id, isouter=True)
        .outerjoin(
            TriageRecord,
            (TriageRecord.user_id == User.id) & (TriageRecord.is_current == True),
        )
        .filter(User.role == UserRole.MOM)
        .order_by(User.created_at.desc())
        .all()
    )

    risk_order = {"critical": 0, "high": 1, "routine": 2}

    patients = [
        {
            "id": user.id,
            "name": (cp.first_name if cp else None) or user.username,
            "email": user.email,
            "age": cp.age if cp else None,
            "phone": cp.phone if cp else None,
            "number_of_children": mp.number_of_children if mp else 0,
            "has_completed_onboarding": mp.has_completed_onboarding if mp else False,
            "gestation_week": cp.gestation_week if cp else None,
            "days_postpartum": cp.days_postpartum if cp else None,
            "due_date": mp.due_date.isoformat() if mp and mp.due_date else None,
            # Triage data
            "risk_level": triage.risk_level if triage else "routine",
            "primary_symptom": triage.primary_symptom if triage else "No assessment",
            "er_advised": triage.er_advised if triage else False,
            "clinical_summary": triage.clinical_summary if triage else "Run /api/triage/analyze to generate.",
            "triage_analyzed_at": triage.analyzed_at.isoformat() if triage and triage.analyzed_at else None,
            # Clinical profile
            "medical_history": cp.medical_history if cp else [],
            "allergies": cp.allergies if cp else [],
            "current_medications": cp.current_medications if cp else [],
            "last_bp": cp.last_bp if cp else None,
            "last_hr": cp.last_hr if cp else None,
            "last_seen": user.updated_at.isoformat() if user.updated_at else (user.created_at.isoformat() if user.created_at else None),
        }
        for user, mp, cp, triage in rows
    ]

    # Sort by risk level
    patients.sort(key=lambda p: risk_order.get(p["risk_level"], 2))
    return {"patients": patients}


@router.get("/patients/{patient_id}")
async def get_patient(
    patient_id: int,
    current_user: User = Depends(get_current_medical_professional),
    db: Session = Depends(get_pg_db),
):
    patient = db.query(User).filter(User.id == patient_id, User.role == UserRole.MOM).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    profile = db.query(MomProfile).filter(MomProfile.user_id == patient_id).first()
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.user_id == patient_id)
        .order_by(ChatMessage.timestamp.desc())
        .limit(10)
        .all()
    )

    return {
        "patient": {
            "id": patient.id,
            "name": patient.username,
            "email": patient.email,
            "is_active": patient.is_active,
            "profile": {
                "number_of_children": profile.number_of_children if profile else 0,
                "has_completed_onboarding": profile.has_completed_onboarding if profile else False,
                "questionnaire_data": profile.questionnaire_data if profile else None,
            },
            "recent_chat": [
                {
                    "role": message.role,
                    "content": message.content,
                    "emotion_detected": message.emotion_detected,
                    "timestamp": message.timestamp.isoformat() if message.timestamp else None,
                }
                for message in messages
            ],
        }
    }


@router.post("/messages")
async def send_patient_message(
    payload: DoctorMessageCreate,
    current_user: User = Depends(get_current_medical_professional),
    db: Session = Depends(get_pg_db),
):
    patient = db.query(User).filter(User.id == payload.patient_id, User.role == UserRole.MOM).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    message = ChatMessage(
        user_id=payload.patient_id,
        role="doctor",
        content=payload.message,
        session_id=f"doctor-{current_user.id}-patient-{payload.patient_id}",
        timestamp=datetime.utcnow(),
    )
    db.add(message)
    db.commit()
    return {"success": True, "message": "Message sent to patient"}


@router.post("/consults")
async def create_consult(
    payload: ConsultCreate,
    current_user: User = Depends(get_current_medical_professional),
    db: Session = Depends(get_pg_db),
):
    patient = db.query(User).filter(User.id == payload.patient_id, User.role == UserRole.MOM).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    room_name = f"sona-consult-{current_user.id}-{payload.patient_id}-{int(datetime.utcnow().timestamp())}"
    return {
        "success": True,
        "room_name": room_name,
        "video_url": f"https://meet.jit.si/{room_name}",
        "reason": payload.reason,
    }


# ── Doctor-Patient Assignment ──────────────────────────────────────────────────

class AssignPatientPayload(BaseModel):
    patient_user_id: int


@router.post("/assign-patient")
async def assign_patient(
    payload: AssignPatientPayload,
    current_user: User = Depends(get_current_medical_professional),
    db: Session = Depends(get_pg_db),
):
    """
    Link a patient to the logged-in doctor.
    Sets PatientProfile.assigned_doctor_id = current_user.id.
    Idempotent: safe to call multiple times.
    """
    patient = db.query(User).filter(
        User.id == payload.patient_user_id,
        User.role == UserRole.MOM
    ).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    profile = db.query(PatientProfile).filter(
        PatientProfile.user_id == payload.patient_user_id
    ).first()
    if not profile:
        raise HTTPException(
            status_code=422,
            detail="Patient has no PatientProfile yet. They must complete onboarding first."
        )

    profile.assigned_doctor_id = current_user.id
    db.commit()
    return {
        "success": True,
        "message": f"Patient {patient.username} assigned to Dr. {current_user.username}",
        "patient_id": patient.id,
        "doctor_id": current_user.id,
    }


@router.get("/my-patients")
async def my_patients(
    current_user: User = Depends(get_current_medical_professional),
    db: Session = Depends(get_pg_db),
):
    """
    Return all patients explicitly assigned to the logged-in doctor,
    enriched with PatientProfile, triage, and clinical baseline summary.
    """
    rows = (
        db.query(User, PatientProfile, TriageRecord)
        .join(PatientProfile, PatientProfile.user_id == User.id)
        .outerjoin(
            TriageRecord,
            (TriageRecord.user_id == User.id) & (TriageRecord.is_current == True),
        )
        .filter(
            User.role == UserRole.MOM,
            PatientProfile.assigned_doctor_id == current_user.id,
        )
        .all()
    )

    risk_order = {"critical": 0, "high": 1, "routine": 2}

    patients = [
        {
            "id": user.id,
            "name": cp.first_name or user.username,
            "email": user.email,
            "age": cp.age,
            "gestation_week": cp.gestation_week,
            "days_postpartum": cp.days_postpartum,
            # Triage
            "risk_level": triage.risk_level if triage else "routine",
            "primary_symptom": triage.primary_symptom if triage else "No assessment",
            "er_advised": triage.er_advised if triage else False,
            "clinical_summary": triage.clinical_summary if triage else None,
            "triage_analyzed_at": triage.analyzed_at.isoformat() if triage and triage.analyzed_at else None,
            # Clinical profile
            "clinical_baseline_summary": cp.clinical_baseline_summary,
            "medical_history": cp.medical_history or [],
            "allergies": cp.allergies or [],
            "current_medications": cp.current_medications or [],
            "last_bp": cp.last_bp,
            "last_hr": cp.last_hr,
            # Questionnaire lifestyle
            "stress_level": cp.stress_level,
            "sleep_hours": cp.sleep_hours,
            "has_anxiety": cp.has_anxiety or False,
            "has_depression": cp.has_depression or False,
            "feeding_method": cp.feeding_method,
            "primary_health_goals": cp.primary_health_goals or [],
            "onboarding_questionnaire": cp.onboarding_questionnaire,
            "last_seen": (
                user.updated_at.isoformat() if user.updated_at
                else user.created_at.isoformat() if user.created_at else None
            ),
        }
        for user, cp, triage in rows
    ]

    patients.sort(key=lambda p: risk_order.get(p["risk_level"], 2))
    return {"patients": patients, "total": len(patients)}
