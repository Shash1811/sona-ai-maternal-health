"""
seed_data.py  (v2 - adds doctor-patient assignment + questionnaire summarizer)
================================================================================
Run from inside sona-ai-backend/:
    python seed_data.py

Creates / updates these test accounts:

  DOCTORS
  -------
  dr.smith@sona.ai      AdminPassword123!   (OB/GYN - Sarah + Emily assigned)
  dr.chen@sona.ai       AdminPassword123!   (OB/GYN - Jessica assigned)

  PATIENTS
  --------
  sarah.p@email.com     Patient123!   32w pregnant, high BP  -> dr.smith
  emily.r@email.com     Patient123!   42d postpartum, routine -> dr.smith
  jessica.m@email.com   Patient123!   14d postpartum, anxiety + sleep deprivation -> dr.chen
"""

from __future__ import annotations

import os
import sys
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
load_dotenv()

from models.database import pg_engine, Base, SessionLocal
from models.auth_models import (
    ChatMessage,
    MedicalProfessionalProfile,
    MomProfile,
    PatientProfile,
    TriageRecord,
    User,
    UserRole,
)
from utils.auth_utils import get_password_hash


# ─── Helpers ─────────────────────────────────────────────────────────────────

def _upsert_user(db, email, username, password, role) -> User:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            email=email, username=username,
            hashed_password=get_password_hash(password),
            role=role, is_active=True, is_verified=True,
        )
        db.add(user)
        db.flush()
        print(f"  [NEW] {email}")
    else:
        user.hashed_password = get_password_hash(password)
        print(f"  [UPD] {email}")
    return user


def _upsert_med_profile(db, user_id, **kwargs):
    p = db.query(MedicalProfessionalProfile).filter(
        MedicalProfessionalProfile.user_id == user_id
    ).first()
    if not p:
        p = MedicalProfessionalProfile(user_id=user_id, **kwargs)
        db.add(p)
        print("    [OK] Medical profile created")
    else:
        print("    [--] Medical profile exists")
    return p


def _upsert_mom_profile(db, user_id, **kwargs):
    p = db.query(MomProfile).filter(MomProfile.user_id == user_id).first()
    if not p:
        p = MomProfile(user_id=user_id, **kwargs)
        db.add(p)
    return p


def _upsert_patient_profile(db, user_id, **kwargs) -> PatientProfile:
    p = db.query(PatientProfile).filter(PatientProfile.user_id == user_id).first()
    if not p:
        p = PatientProfile(user_id=user_id, **kwargs)
        db.add(p)
        db.flush()
        print("    [OK] PatientProfile created")
    else:
        for k, v in kwargs.items():
            setattr(p, k, v)
        db.flush()
        print("    [UPD] PatientProfile updated")
    return p


def _add_chat_messages(db, user_id, messages):
    existing = db.query(ChatMessage).filter(ChatMessage.user_id == user_id).count()
    if existing:
        print(f"    [--] Chat messages already exist (user_id={user_id}), skipping")
        return
    for role, content, minutes_ago in messages:
        db.add(ChatMessage(
            user_id=user_id, role=role, content=content,
            session_id=f"seed-{user_id}",
            timestamp=datetime.now(timezone.utc) - timedelta(minutes=minutes_ago),
        ))


def _upsert_triage(db, profile: PatientProfile, user_id, **kwargs):
    existing = db.query(TriageRecord).filter(
        TriageRecord.user_id == user_id, TriageRecord.is_current == True
    ).first()
    if existing:
        print(f"    [--] Triage record exists (user_id={user_id}), skipping")
        return
    db.add(TriageRecord(
        patient_profile_id=profile.id,
        user_id=user_id,
        analysis_trigger="seed",
        analyzed_at=datetime.now(timezone.utc),
        is_current=True,
        **kwargs,
    ))


def _generate_summary(questionnaire: dict) -> str:
    """Generate clinical_baseline_summary (calls LLM, falls back to text)."""
    try:
        from ai.questionnaire_summarizer import generate_clinical_baseline_summary
        print("    [AI] Generating clinical_baseline_summary via Gemini...")
        summary = generate_clinical_baseline_summary(questionnaire)
        print("    [OK] Summary generated")
        return summary
    except Exception as exc:
        print(f"    [WARN] LLM summarizer failed ({exc}), using fallback")
        from ai.questionnaire_summarizer import _fallback_summary
        return _fallback_summary(questionnaire)


# ─── Main ─────────────────────────────────────────────────────────────────────

def seed():
    print("\n[SEED v2] Starting...\n")
    Base.metadata.create_all(bind=pg_engine)
    print("  [OK] Tables verified\n")

    db: Session = SessionLocal()
    try:

        # ══════════════════════════════════════════════════════════════
        # DOCTORS
        # ══════════════════════════════════════════════════════════════

        print("== DOCTORS ==")

        smith = _upsert_user(db, "dr.smith@sona.ai", "Dr. Sarah Smith",
                              "AdminPassword123!", UserRole.MEDICAL_PROFESSIONAL)
        _upsert_med_profile(db, smith.id,
            first_name="Sarah", last_name="Smith",
            professional_title="Dr.", license_number="MED-2024-SONA-001",
            specialization="Obstetrics & Gynaecology",
            years_of_experience=12,
            hospital_or_clinic="Sona Maternal Health Centre",
            phone_number="+91 98765 00001",
            is_license_verified=True)
        db.flush()

        chen = _upsert_user(db, "dr.chen@sona.ai", "Dr. Li Chen",
                             "AdminPassword123!", UserRole.MEDICAL_PROFESSIONAL)
        _upsert_med_profile(db, chen.id,
            first_name="Li", last_name="Chen",
            professional_title="Dr.", license_number="MED-2024-SONA-002",
            specialization="Obstetrics & Gynaecology / Postpartum Care",
            years_of_experience=9,
            hospital_or_clinic="Sona Maternal Health Centre",
            phone_number="+91 98765 00002",
            is_license_verified=True)
        db.flush()

        # ══════════════════════════════════════════════════════════════
        # PATIENT 1 — Sarah Patel (High Risk) -> dr.smith
        # ══════════════════════════════════════════════════════════════

        print("\n== PATIENT 1: sarah.p@email.com (High Risk -> dr.smith) ==")
        sarah = _upsert_user(db, "sarah.p@email.com", "Sarah Patel",
                              "Patient123!", UserRole.MOM)
        _upsert_mom_profile(db, sarah.id,
            first_name="Sarah", last_name="Patel",
            phone_number="+91 98765 43210",
            number_of_children=1, has_completed_onboarding=True,
            onboarding_completed_at=datetime.now(timezone.utc) - timedelta(days=60),
            questionnaire_data={"pregnancy_status": "pregnant", "gestation_week": 32})

        sarah_q = {
            "pregnancy_status": "pregnant",
            "current_weeks_pregnant": 32,
            "is_high_risk": True,
            "high_risk_factors": ["Gestational hypertension"],
            "pre_existing_conditions": ["Gestational hypertension (onset at 26 weeks)", "Iron-deficiency anaemia"],
            "allergies": ["Penicillin", "Sulfa drugs"],
            "medications": ["Labetalol 200mg twice daily", "Ferrous sulfate 325mg", "Prenatal vitamins"],
            "has_anxiety": True,
            "stress_level": 8,
            "sleep_hours_per_night": 5.5,
            "primary_health_goals": ["Healthy pregnancy", "Mental wellness"],
            "main_concerns": ["Pregnancy complications"],
            "feeding_method": "breastfeeding",
        }

        sarah_profile = _upsert_patient_profile(db, sarah.id,
            first_name="Sarah", age=29, phone="+91 98765 43210",
            gestation_week=32, days_postpartum=None,
            assigned_doctor_id=smith.id,
            medical_history=sarah_q["pre_existing_conditions"],
            allergies=sarah_q["allergies"],
            current_medications=sarah_q["medications"],
            last_bp="148/96", last_hr=92, last_weight_kg=68.5, last_temp_c=37.0,
            stress_level=8, sleep_hours=5.5,
            has_anxiety=True, has_depression=False,
            primary_health_goals=sarah_q["primary_health_goals"],
            feeding_method="breastfeeding",
            onboarding_questionnaire=sarah_q,
            onboarding_completed_at=datetime.now(timezone.utc) - timedelta(days=60),
            additional_notes="Pregnancy complications; monitoring BP at home daily",
            clinical_baseline_summary=_generate_summary(sarah_q),
        )

        _add_chat_messages(db, sarah.id, [
            ("user", "Hi Sona, I have been having really bad cramping in my upper abdomen for the last 3 hours. It started suddenly.", 180),
            ("assistant", "I'm concerned. Upper abdominal pain in pregnancy, especially sudden onset, can signal preeclampsia or HELLP syndrome. Do you also have a headache or vision changes?", 179),
            ("user", "Yes, I have a headache and my vision is a bit blurry.", 178),
            ("assistant", "Sarah, with your BP history at 32 weeks plus these three symptoms together, I need you to go to the ER right now. Call 108 or have someone drive you immediately. These are signs of severe preeclampsia.", 177),
            ("user", "My home BP is 152/98. Is that dangerous?", 175),
            ("assistant", "Yes. 152/98 with those symptoms is a medical emergency. Please go to the ER now. Do not wait.", 174),
            ("user", "Going to the hospital now. Thank you.", 170),
            ("assistant", "You are doing the right thing. Tell the team everything you told me. I have flagged this for Dr. Smith.", 170),
        ])
        _upsert_triage(db, sarah_profile, sarah.id,
            risk_level="high",
            primary_symptom="Severe upper abdominal cramping + headache + blurry vision (BP 152/98)",
            clinical_summary=(
                "Patient at 32 weeks with known gestational hypertension reports acute epigastric pain, "
                "headache, and blurry vision with home BP of 152/98 mmHg -- consistent with severe preeclampsia "
                "or early HELLP syndrome. Sona AI directed patient to emergency services; urgent physician review required."
            ),
            er_advised=True, messages_analyzed=8,
        )

        # ══════════════════════════════════════════════════════════════
        # PATIENT 2 — Emily Roberts (Routine) -> dr.smith
        # ══════════════════════════════════════════════════════════════

        print("\n== PATIENT 2: emily.r@email.com (Routine -> dr.smith) ==")
        emily = _upsert_user(db, "emily.r@email.com", "Emily Roberts",
                              "Patient123!", UserRole.MOM)
        _upsert_mom_profile(db, emily.id,
            first_name="Emily", last_name="Roberts",
            phone_number="+91 87654 32100",
            number_of_children=2, has_completed_onboarding=True,
            onboarding_completed_at=datetime.now(timezone.utc) - timedelta(days=50),
            baby_birth_date=datetime.now(timezone.utc) - timedelta(days=42))

        emily_q = {
            "pregnancy_status": "postpartum",
            "weeks_postpartum": 6,
            "delivery_method": "vaginal",
            "feeding_method": "breastfeeding",
            "pre_existing_conditions": ["SVD -- uncomplicated", "Episiotomy (healed)"],
            "allergies": ["Codeine"],
            "medications": ["Postpartum multivitamins", "Ibuprofen 400mg as needed"],
            "has_anxiety": False, "has_depression": False,
            "stress_level": 4,
            "sleep_hours_per_night": 6.0,
            "primary_health_goals": ["Postpartum recovery", "Physical fitness"],
            "main_concerns": ["Baby health"],
        }

        emily_profile = _upsert_patient_profile(db, emily.id,
            first_name="Emily", age=31, phone="+91 87654 32100",
            gestation_week=None, days_postpartum=42,
            assigned_doctor_id=smith.id,
            medical_history=emily_q["pre_existing_conditions"],
            allergies=emily_q["allergies"],
            current_medications=emily_q["medications"],
            last_bp="112/72", last_hr=74, last_weight_kg=61.0, last_temp_c=36.7,
            stress_level=4, sleep_hours=6.0,
            has_anxiety=False, has_depression=False,
            primary_health_goals=emily_q["primary_health_goals"],
            feeding_method="breastfeeding",
            onboarding_questionnaire=emily_q,
            onboarding_completed_at=datetime.now(timezone.utc) - timedelta(days=50),
            additional_notes="Baby health concerns",
            clinical_baseline_summary=_generate_summary(emily_q),
        )

        _add_chat_messages(db, emily.id, [
            ("user", "Hi Sona! 6 weeks postpartum now. Feeling good overall.", 2880),
            ("assistant", "Wonderful! How is breastfeeding going, and how is your energy level?", 2879),
            ("user", "Breastfeeding well. Some lower back pain though.", 2875),
            ("assistant", "Very common at 6 weeks -- your core is still recovering. Pelvic tilts and cat-cow stretches help. Also check your nursing posture; a pillow can reduce strain.", 2874),
            ("user", "Just a dull ache, nothing sharp. My lochia stopped. Normal?", 2870),
            ("assistant", "Yes, completely normal! Lochia resolves between 4-6 weeks. You are right on track.", 2869),
            ("user", "What exercises are safe for me now?", 2865),
            ("assistant", "At 6 weeks post-SVD: gentle walking (20-30 min), Kegels (3x10 daily), and heel slides. Avoid high-impact or sit-ups for 3 more months.", 2864),
        ])
        _upsert_triage(db, emily_profile, emily.id,
            risk_level="routine",
            primary_symptom="6-week postpartum check-in -- mild lower back pain",
            clinical_summary=(
                "Patient is 42 days post-uncomplicated SVD with resolved lochia, successful breastfeeding, "
                "and mild lower back pain only. No red flags; Sona AI provided exercise guidance and routine follow-up reminder."
            ),
            er_advised=False, messages_analyzed=8,
        )

        # ══════════════════════════════════════════════════════════════
        # PATIENT 3 — Jessica Miller (High Risk) -> dr.chen  *** NEW ***
        # ══════════════════════════════════════════════════════════════

        print("\n== PATIENT 3: jessica.m@email.com (High Anxiety + Sleep Dep -> dr.chen) ==")
        jessica = _upsert_user(db, "jessica.m@email.com", "Jessica Miller",
                               "Patient123!", UserRole.MOM)
        _upsert_mom_profile(db, jessica.id,
            first_name="Jessica", last_name="Miller",
            phone_number="+91 76543 21000",
            number_of_children=1, has_completed_onboarding=True,
            onboarding_completed_at=datetime.now(timezone.utc) - timedelta(days=14),
            baby_birth_date=datetime.now(timezone.utc) - timedelta(days=14))

        jessica_q = {
            "pregnancy_status": "postpartum",
            "weeks_postpartum": 2,
            "delivery_method": "c_section",
            "feeding_method": "breastfeeding",
            "has_postpartum_complications": True,
            "postpartum_complications": ["C-section wound healing", "Nipple soreness from breastfeeding"],
            "pre_existing_conditions": [],
            "allergies": [],
            "medications": ["Paracetamol 500mg as needed", "Postnatal multivitamins"],
            "has_anxiety": True,
            "has_depression": False,
            "has_postpartum_depression": False,
            "stress_level": 9,
            "sleep_hours_per_night": 3.0,
            "exercise_frequency": "none",
            "primary_health_goals": ["Mental wellness", "Postpartum recovery", "Sleep improvement"],
            "main_concerns": ["Baby health", "Postpartum depression", "Relationship stress"],
            "areas_needing_support": ["Emotional support", "Medical guidance"],
            "feeding_method": "breastfeeding",
            "food_allergies": [],
            "food_restrictions": [],
            "has_partner_support": True,
            "has_family_support": False,
            "takes_prenatal_vitamins": True,
            "interested_in_mental_health_support": True,
            "interested_in_medical_tracking": True,
        }

        jessica_profile = _upsert_patient_profile(db, jessica.id,
            first_name="Jessica", age=27, phone="+91 76543 21000",
            gestation_week=None, days_postpartum=14,
            assigned_doctor_id=chen.id,
            medical_history=[],
            allergies=[],
            current_medications=["Paracetamol 500mg as needed", "Postnatal multivitamins"],
            last_bp="110/70", last_hr=82, last_weight_kg=58.0, last_temp_c=36.8,
            stress_level=9, sleep_hours=3.0,
            has_anxiety=True, has_depression=False,
            primary_health_goals=["Mental wellness", "Postpartum recovery", "Sleep improvement"],
            feeding_method="breastfeeding",
            onboarding_questionnaire=jessica_q,
            onboarding_completed_at=datetime.now(timezone.utc) - timedelta(days=14),
            additional_notes="Baby health, postpartum depression risk, relationship stress",
            clinical_baseline_summary=_generate_summary(jessica_q),
        )

        _add_chat_messages(db, jessica.id, [
            ("user", "Hi. I had my baby 2 weeks ago via C-section and I am really struggling. I can't sleep at all.", 300),
            ("assistant", "Jessica, I hear you -- 2 weeks post-C-section with severe sleep deprivation is incredibly hard. You are not alone. Can you tell me how many hours you are getting, and is your baby sleeping at all between feeds?", 299),
            ("user", "Maybe 2-3 hours broken up. Baby feeds every 1.5 hours. I am completely exhausted and starting to feel hopeless sometimes.", 298),
            ("assistant", "Feeling hopeless with this level of exhaustion is a serious flag I want to address gently. This can be the start of postpartum depression, which is very common and very treatable. I am going to flag this for Dr. Chen to review your case. In the meantime: try to sleep when the baby sleeps, even 20 minutes matters. Is there anyone at home who can take one night feed?", 297),
            ("user", "My husband is trying to help but he works during the day. And I am having trouble breastfeeding too -- my nipples are really sore.", 295),
            ("assistant", "Nipple soreness at 2 weeks is extremely common, especially post-C-section when the latch may be affected by your recovery position. Check that the baby has a deep latch covering most of the areola, not just the nipple. Applying lanolin cream after each feed and allowing nipples to air-dry can help significantly. Would you like me to walk you through latch correction?", 294),
            ("user", "Yes please. Also I am worried about my C-section wound. It's been itching.", 290),
            ("assistant", "Itching around a C-section wound between days 10-14 is usually a sign of normal healing -- the nerves are regenerating. However, if you notice any redness spreading outward, warmth, discharge, or fever above 38C, go to the ER immediately as that would indicate infection. For the itch, keep the area clean and dry. Loose cotton clothing helps. How does the wound look visually today?", 289),
        ])

        _upsert_triage(db, jessica_profile, jessica.id,
            risk_level="high",
            primary_symptom="Severe sleep deprivation (3h/night) + high anxiety + hopelessness at 2 weeks postpartum",
            clinical_summary=(
                "Patient is 14 days post-emergency C-section, reporting only 2-3h of fragmented sleep nightly, "
                "stress level 9/10, self-reported anxiety, and emerging feelings of hopelessness -- presentation "
                "consistent with early postpartum depression and acute exhaustion requiring urgent physician follow-up. "
                "Sona AI has flagged for Dr. Chen's review and provided immediate supportive guidance."
            ),
            er_advised=False, messages_analyzed=8,
        )

        # ══════════════════════════════════════════════════════════════
        # Commit
        # ══════════════════════════════════════════════════════════════
        db.commit()

        print("\n" + "=" * 65)
        print("[DONE] Seed v2 completed successfully!\n")
        print("  +-----------------------------+--------------------+-----------+")
        print("  | Email                       | Password           | Doctor    |")
        print("  +-----------------------------+--------------------+-----------+")
        print("  | dr.smith@sona.ai            | AdminPassword123!  | (Doctor)  |")
        print("  | dr.chen@sona.ai             | AdminPassword123!  | (Doctor)  |")
        print("  | sarah.p@email.com           | Patient123!        | dr.smith  |")
        print("  | emily.r@email.com           | Patient123!        | dr.smith  |")
        print("  | jessica.m@email.com         | Patient123!        | dr.chen   |")
        print("  +-----------------------------+--------------------+-----------+")
        print("=" * 65 + "\n")

    except Exception as exc:
        db.rollback()
        print(f"\n[FAIL] Seed FAILED: {exc}")
        import traceback; traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    seed()
