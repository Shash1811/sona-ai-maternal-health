"""
Agentic Risk Triage Engine
===========================
Analyses a patient's recent ChatLogs + PatientProfile using Gemini and
produces a structured risk assessment:
  - risk_level   : "critical" | "high" | "routine"
  - primary_symptom
  - clinical_summary  (2 sentences)
  - er_advised   : bool

Results are persisted to TriageRecord so the Provider Dashboard can
fetch them instantly without re-running the LLM on every page load.
"""

from __future__ import annotations

import json
import os
import re
from datetime import datetime
from typing import Optional

import google.generativeai as genai
from sqlalchemy.orm import Session

from models.auth_models import (
    ChatMessage,
    PatientProfile,
    TriageRecord,
    User,
)


# ──────────────────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────────────────

def _build_profile_summary(profile: PatientProfile) -> str:
    """Render the patient profile as a short text block for the LLM."""
    parts = [f"Patient: {profile.first_name}, Age {profile.age or 'unknown'}"]

    if profile.gestation_week:
        parts.append(f"Currently {profile.gestation_week} weeks pregnant.")
    elif profile.days_postpartum is not None:
        parts.append(f"{profile.days_postpartum} days postpartum.")

    if profile.medical_history:
        parts.append("Medical history: " + "; ".join(profile.medical_history))
    if profile.allergies:
        parts.append("Allergies: " + ", ".join(profile.allergies))
    if profile.current_medications:
        parts.append("Medications: " + "; ".join(profile.current_medications))
    if profile.last_bp:
        parts.append(f"Last BP: {profile.last_bp} mmHg")
    if profile.last_temp_c:
        parts.append(f"Last temp: {profile.last_temp_c}°C")

    # Questionnaire-derived fields
    if profile.stress_level is not None:
        parts.append(f"Self-reported stress: {profile.stress_level}/10")
    if profile.sleep_hours is not None:
        parts.append(f"Sleep: {profile.sleep_hours}h/night")
    if profile.has_anxiety:
        parts.append("Reported anxiety: YES")
    if profile.has_depression:
        parts.append("Reported depression/PPD: YES")
    if profile.feeding_method:
        parts.append(f"Feeding method: {profile.feeding_method}")
    if profile.primary_health_goals:
        parts.append("Health goals: " + ", ".join(profile.primary_health_goals))

    # LLM-generated baseline summary from onboarding (highest signal)
    if profile.clinical_baseline_summary:
        parts.append(f"\nClinical baseline summary: {profile.clinical_baseline_summary}")

    if profile.additional_notes:
        parts.append(f"Notes: {profile.additional_notes}")

    return "\n".join(parts)



def _format_chat_log(messages: list[ChatMessage]) -> str:
    """Turn a list of ChatMessage ORM objects into a readable transcript."""
    lines = []
    for msg in messages:
        role = "Patient" if msg.role == "user" else "Sona AI"
        ts = msg.timestamp.strftime("%Y-%m-%d %H:%M") if msg.timestamp else "?"
        lines.append(f"[{ts}] {role}: {msg.content}")
    return "\n".join(lines) if lines else "No recent conversation."


def _parse_triage_json(raw: str) -> dict:
    """
    Extract a JSON object from the LLM response even if it's wrapped in
    markdown code fences or surrounded by extra prose.
    """
    # Strip markdown fences
    cleaned = re.sub(r"```(?:json)?", "", raw).strip()
    cleaned = cleaned.strip("`").strip()

    # Find the first '{...}' block
    match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if match:
        return json.loads(match.group())

    raise ValueError(f"Could not parse triage JSON from LLM output:\n{raw[:500]}")


# ──────────────────────────────────────────────────────────────────────────────
# Triage Engine
# ──────────────────────────────────────────────────────────────────────────────

TRIAGE_PROMPT_TEMPLATE = """\
You are a senior clinical AI triage engine for a maternal health platform.
You will be given:
  1. A structured patient profile.
  2. The last 20 messages between the patient and Sona AI (our chat assistant).

Your task is to output a JSON object ONLY (no prose, no markdown fences) with
exactly these 4 keys:

{{
  "risk_level": "<critical|high|routine>",
  "primary_symptom": "<one concise clinical phrase>",
  "clinical_summary": "<exactly 2 sentences summarising the clinical picture>",
  "er_advised": <true|false>
}}

Definitions:
- critical : Symptoms suggesting obstetric emergency (e.g. HELLP, eclampsia,
             severe PPH, stillbirth concern, sepsis). ER visit mandatory.
- high     : Significant concern requiring physician follow-up within 24 h
             (e.g. mastitis, reduced FM, moderate PPD, early pre-eclampsia).
- routine  : Normal pregnancy/postpartum complaints, no red flags.

--- PATIENT PROFILE ---
{profile_summary}

--- RECENT CONVERSATION (oldest first) ---
{chat_log}

--- INSTRUCTIONS ---
Respond with the JSON object ONLY. No other text.
"""


class TriageEngine:
    """Agentic risk triage engine backed by Gemini."""

    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not set")
        genai.configure(api_key=api_key)
        self._model = genai.GenerativeModel("gemini-1.5-flash")

    # ── Public API ────────────────────────────────────────────────────────────

    def analyze_patient(
        self,
        pg_db: Session,
        user_id: int,
        trigger: str = "manual",
    ) -> TriageRecord:
        """
        Run a full triage analysis for the given patient and persist the result.

        Returns the new TriageRecord ORM instance.
        """
        # 1. Fetch patient profile
        profile = (
            pg_db.query(PatientProfile)
            .filter(PatientProfile.user_id == user_id)
            .first()
        )
        if not profile:
            raise ValueError(f"No PatientProfile found for user_id={user_id}")

        # 2. Fetch last 20 chat messages (chronological order)
        messages = (
            pg_db.query(ChatMessage)
            .filter(ChatMessage.user_id == user_id)
            .order_by(ChatMessage.timestamp.desc())
            .limit(20)
            .all()
        )
        messages.reverse()  # oldest first for readability

        # 3. Build prompt
        prompt = TRIAGE_PROMPT_TEMPLATE.format(
            profile_summary=_build_profile_summary(profile),
            chat_log=_format_chat_log(messages),
        )

        # 4. Call Gemini
        try:
            raw_response = self._model.generate_content(prompt)
            result = _parse_triage_json(raw_response.text)
        except Exception as exc:
            print(f"[TriageEngine] LLM error: {exc}")
            # Safe fallback — do not fail the endpoint
            result = {
                "risk_level": "routine",
                "primary_symptom": "Unable to assess — LLM error",
                "clinical_summary": (
                    "The triage engine encountered an error analysing this patient. "
                    "Please review manually."
                ),
                "er_advised": False,
            }

        # Validate risk_level
        valid_levels = {"critical", "high", "routine"}
        risk_level = result.get("risk_level", "routine").lower()
        if risk_level not in valid_levels:
            risk_level = "routine"

        # 5. Mark any existing current records as stale
        (
            pg_db.query(TriageRecord)
            .filter(TriageRecord.user_id == user_id, TriageRecord.is_current == True)
            .update({"is_current": False})
        )

        # 6. Persist new triage record
        triage_record = TriageRecord(
            patient_profile_id=profile.id,
            user_id=user_id,
            risk_level=risk_level,
            primary_symptom=result.get("primary_symptom", "Unknown"),
            clinical_summary=result.get("clinical_summary", ""),
            er_advised=bool(result.get("er_advised", False)),
            messages_analyzed=len(messages),
            analysis_trigger=trigger,
            analyzed_at=datetime.utcnow(),
            is_current=True,
        )
        pg_db.add(triage_record)
        pg_db.commit()
        pg_db.refresh(triage_record)

        print(
            f"[TriageEngine] user_id={user_id} → {risk_level.upper()} "
            f"({result.get('primary_symptom')})"
        )
        return triage_record

    def get_current_triage(
        self, pg_db: Session, user_id: int
    ) -> Optional[TriageRecord]:
        """Return the most recent current triage record for a patient."""
        return (
            pg_db.query(TriageRecord)
            .filter(TriageRecord.user_id == user_id, TriageRecord.is_current == True)
            .order_by(TriageRecord.analyzed_at.desc())
            .first()
        )
