"""
Triage Route — /api/triage
===========================
Exposes:
  POST /api/triage/analyze          — Run the agentic triage engine for a patient
  GET  /api/triage/{user_id}        — Fetch the latest triage record for a patient
  GET  /api/triage/queue            — All patients with their current triage records
                                       (used by the Provider Dashboard smart queue)
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ai.triage_engine import TriageEngine
from models.auth_models import PatientProfile, TriageRecord, User, UserRole
from models.database import get_pg_db
from models.triage_schemas import (
    TriageAnalysisRequest,
    TriageAnalysisResponse,
    TriageRecordResponse,
    PatientListItem,
)
from utils.auth_utils import get_current_medical_professional

router = APIRouter(prefix="/api/triage", tags=["triage"])

# Singleton engine (stateless — safe to share)
_engine = TriageEngine()


# ─── POST /api/triage/analyze ─────────────────────────────────────────────────

@router.post("/analyze", response_model=TriageAnalysisResponse)
async def analyze_patient(
    payload: TriageAnalysisRequest,
    pg_db: Session = Depends(get_pg_db),
    current_user: User = Depends(get_current_medical_professional),
):
    """
    Trigger the Agentic Triage Engine for a specific patient.
    Only accessible by authenticated medical professionals.
    """
    # Confirm patient exists
    patient = (
        pg_db.query(User)
        .filter(User.id == payload.user_id, User.role == UserRole.MOM)
        .first()
    )
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    try:
        triage_record = _engine.analyze_patient(
            pg_db=pg_db,
            user_id=payload.user_id,
            trigger=payload.trigger,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Triage engine error: {exc}")

    return TriageAnalysisResponse(
        success=True,
        triage=TriageRecordResponse.model_validate(triage_record),
        patient_name=patient.username,
    )


# ─── GET /api/triage/queue ────────────────────────────────────────────────────

@router.get("/queue", response_model=list[PatientListItem])
async def get_triage_queue(
    pg_db: Session = Depends(get_pg_db),
    current_user: User = Depends(get_current_medical_professional),
):
    """
    Return patients assigned to this doctor, enriched with their current triage
    record and patient profile. Results are pre-sorted by risk level (critical first).
    Patients with no assignment are excluded — use /api/doctor/patients for a global view.
    """
    rows = (
        pg_db.query(User, PatientProfile, TriageRecord)
        .join(PatientProfile, PatientProfile.user_id == User.id)
        .outerjoin(
            TriageRecord,
            (TriageRecord.user_id == User.id) & (TriageRecord.is_current == True),
        )
        .filter(
            User.role == UserRole.MOM,
            User.is_active == True,
            PatientProfile.assigned_doctor_id == current_user.id,
        )
        .all()
    )

    risk_order = {"critical": 0, "high": 1, "routine": 2}

    items = []
    for user, profile, triage in rows:
        risk = triage.risk_level if triage else "routine"
        items.append(
            PatientListItem(
                id=user.id,
                name=profile.first_name or user.username,
                email=user.email,
                age=profile.age,
                gestation_week=profile.gestation_week,
                days_postpartum=profile.days_postpartum,
                primary_symptom=triage.primary_symptom if triage else "No assessment",
                risk_level=risk,
                er_advised=triage.er_advised if triage else False,
                clinical_summary=triage.clinical_summary if triage else "No triage run yet.",
                clinical_baseline_summary=profile.clinical_baseline_summary,
                last_seen=(
                    user.updated_at.strftime("%d %b %Y %H:%M")
                    if user.updated_at
                    else user.created_at.strftime("%d %b %Y") if user.created_at else None
                ),
                medical_history=profile.medical_history or [],
                allergies=profile.allergies or [],
                current_medications=profile.current_medications or [],
                last_bp=profile.last_bp,
                last_hr=profile.last_hr,
                stress_level=profile.stress_level,
                sleep_hours=profile.sleep_hours,
                has_anxiety=profile.has_anxiety or False,
                has_depression=profile.has_depression or False,
                feeding_method=profile.feeding_method,
                primary_health_goals=profile.primary_health_goals or [],
            )
        )

    items.sort(key=lambda x: risk_order.get(x.risk_level, 2))
    return items



# ─── GET /api/triage/{user_id} ───────────────────────────────────────────────

@router.get("/{user_id}", response_model=TriageRecordResponse)
async def get_patient_triage(
    user_id: int,
    pg_db: Session = Depends(get_pg_db),
    current_user: User = Depends(get_current_medical_professional),
):
    """Return the latest current triage record for a specific patient."""
    triage = _engine.get_current_triage(pg_db, user_id)
    if not triage:
        raise HTTPException(
            status_code=404,
            detail=f"No triage record found for user_id={user_id}. Run /analyze first.",
        )
    return TriageRecordResponse.model_validate(triage)
