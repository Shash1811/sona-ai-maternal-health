"""
ai/questionnaire_summarizer.py
================================
Agentic Questionnaire Summarizer
---------------------------------
Ingests a patient's raw onboarding questionnaire answers and uses Gemini
to produce a concise, clinically-structured `clinical_baseline_summary`.

This summary is:
  1. Stored in PatientProfile.clinical_baseline_summary for instant
     Provider Dashboard display.
  2. Injected into the Sona AI chat prompt for personalization.
  3. Available to the Doctor Co-Pilot for baseline queries.
"""

from __future__ import annotations

import os
import re
from typing import Any, Dict

import google.generativeai as genai


# ─── LLM Setup ───────────────────────────────────────────────────────────────

def _get_model():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not set")
    genai.configure(api_key=api_key)
    return genai.GenerativeModel("gemini-2.5-flash-lite")


# ─── Prompt ──────────────────────────────────────────────────────────────────

SUMMARIZER_PROMPT = """\
You are a senior maternal-health clinical summarizer AI.
You will be given a patient's raw onboarding questionnaire answers in JSON format.

Your task is to produce a single paragraph (3-5 sentences) that is:
  - Written in concise, clinical English suitable for a physician
  - Captures the key facts: pregnancy/postpartum status, mental-health flags
    (anxiety, depression, stress level), sleep quality, main concerns,
    medical history, and primary health goals
  - Flags any high-risk indicators so the doctor notices them immediately

Do NOT start with "Patient reports" every sentence — vary your phrasing.
Do NOT include the raw JSON values verbatim; synthesise them into prose.
Output ONLY the summary paragraph. No headers, no bullet points, no preamble.

--- QUESTIONNAIRE DATA ---
{questionnaire_json}

--- SUMMARY ---
"""


# ─── Public API ──────────────────────────────────────────────────────────────

def generate_clinical_baseline_summary(questionnaire: Dict[str, Any]) -> str:
    """
    Synchronously generate a clinical baseline summary from raw questionnaire data.

    Returns a plain-text summary string.
    Falls back to a structured plain-text summary if the LLM is unavailable.
    """
    import json

    # Sanitise: remove internal meta-fields the LLM doesn't need
    clean = {
        k: v for k, v in questionnaire.items()
        if k not in ("user_id", "completed_at", "questionnaire_version", "_id")
        and v not in (None, [], "", {})
    }

    questionnaire_json = json.dumps(clean, indent=2, default=str)
    prompt = SUMMARIZER_PROMPT.format(questionnaire_json=questionnaire_json)

    try:
        model = _get_model()
        response = model.generate_content(prompt)
        if response and hasattr(response, "text") and response.text:
            return response.text.strip()
        raise ValueError("Empty LLM response")

    except Exception as exc:
        print(f"[QuestionnaireSummarizer] LLM error: {exc} — using fallback summary")
        return _fallback_summary(clean)


def _fallback_summary(q: Dict[str, Any]) -> str:
    """Build a plain-text summary without an LLM call."""
    parts = []

    status = q.get("pregnancy_status", "unknown")
    weeks_pg = q.get("current_weeks_pregnant")
    weeks_pp = q.get("weeks_postpartum")

    if status == "pregnant" and weeks_pg:
        parts.append(f"Patient is currently {weeks_pg} weeks pregnant.")
    elif status == "postpartum" and weeks_pp:
        parts.append(f"Patient is {weeks_pp} weeks postpartum.")
    else:
        parts.append(f"Pregnancy status: {status}.")

    stress = q.get("stress_level")
    sleep = q.get("sleep_hours_per_night")
    anxiety = q.get("has_anxiety", False)
    depression = q.get("has_depression", False) or q.get("has_postpartum_depression", False)

    mh_parts = []
    if stress and stress >= 7:
        mh_parts.append(f"high stress (level {stress}/10)")
    elif stress:
        mh_parts.append(f"moderate stress (level {stress}/10)")
    if anxiety:
        mh_parts.append("reported anxiety")
    if depression:
        mh_parts.append("reported depression")
    if sleep and sleep < 5:
        mh_parts.append(f"severe sleep deprivation ({sleep}h/night)")
    elif sleep and sleep < 6:
        mh_parts.append(f"poor sleep ({sleep}h/night)")

    if mh_parts:
        parts.append("Mental health and lifestyle flags: " + ", ".join(mh_parts) + ".")

    conditions = q.get("pre_existing_conditions", [])
    if conditions:
        parts.append("Pre-existing conditions: " + ", ".join(conditions) + ".")

    goals = q.get("primary_health_goals", [])
    concerns = q.get("main_concerns", [])
    if goals:
        parts.append("Primary health goals: " + ", ".join(goals) + ".")
    if concerns:
        parts.append("Main concerns: " + ", ".join(concerns) + ".")

    feeding = q.get("feeding_method")
    if feeding and feeding != "not_applicable":
        parts.append(f"Feeding method: {feeding}.")

    return " ".join(parts) if parts else "No questionnaire data available."
