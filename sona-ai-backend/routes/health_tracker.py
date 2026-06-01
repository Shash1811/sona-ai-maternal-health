from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Dict, Any
from bson import ObjectId

from models.database import get_pg_db, db as mongodb_db
from models.auth_models import User, UserRole, PatientProfile, MedicalProfessionalProfile, Appointment
from utils.auth_utils import get_current_user, get_current_mom
from ai.llm_integration import LLMIntegration

router = APIRouter(prefix="/api/health-tracker", tags=["health-tracker"])

# Initialize LLM Integration
llm_service = LLMIntegration()

# ---------------------------------------------------------
# 1. DAILY HEALTH TRACKER - PERSONALIZED AI INSIGHTS
# ---------------------------------------------------------

class VitalsLog(BaseModel):
    systolic: Optional[int] = None
    diastolic: Optional[int] = None
    glucose: Optional[int] = None
    heartRate: Optional[int] = None
    temperature: Optional[float] = None
    weight: Optional[float] = None
    sleep_hours: Optional[float] = None
    stress_level: Optional[int] = None
    notes: Optional[str] = ""

@router.post("/insights")
async def get_vitals_insights(
    vitals: VitalsLog,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_pg_db)
):
    """
    Generate personalized clinical-grade AI insights for a user based on their current vitals log.
    Includes overall status, a warm message, specific recommendations, warnings, and tailored self-care advice.
    """
    # Fetch PatientProfile if available to personalize response
    profile = db.query(PatientProfile).filter(PatientProfile.user_id == current_user.id).first()
    
    personalization_context = ""
    if profile:
        personalization_context = f"""
        Patient Profile Context:
        - Name: {profile.first_name or current_user.username}
        - Age: {profile.age}
        - Pregnancy/Postpartum Status: {"Postpartum (Days: " + str(profile.days_postpartum) + ")" if profile.days_postpartum else "Gestation Week: " + str(profile.gestation_week) if profile.gestation_week else "Not specified"}
        - Medical History: {profile.medical_history}
        - Allergies: {profile.allergies}
        - Primary Health Goals: {profile.primary_health_goals}
        """
    else:
        personalization_context = f"User: {current_user.username}"

    vitals_summary = f"""
    Vitals Logged Today:
    - Blood Pressure: {vitals.systolic}/{vitals.diastolic} mmHg if provided
    - Blood Glucose: {vitals.glucose} mg/dL if provided
    - Heart Rate: {vitals.heartRate} bpm if provided
    - Temperature: {vitals.temperature} °F if provided
    - Weight: {vitals.weight} kg if provided
    - Sleep Hours: {vitals.sleep_hours} hours if provided
    - Stress Level: {vitals.stress_level}/10 if provided
    - User Notes: "{vitals.notes}"
    """

    prompt = f"""
    You are Sona AI, a senior maternal-infant health clinical specialist. 
    Review the following user's vitals and details, and generate a highly structured clinical assessment.

    {personalization_context}
    
    {vitals_summary}

    Follow these normal ranges for context:
    - BP: Systolic 90-120 mmHg, Diastolic 60-80 mmHg. High is >130/80 (look out for preeclampsia flags in pregnant moms!).
    - Glucose: 70-100 mg/dL (fasting). High glucose in pregnancy can indicate gestational diabetes risk.
    - Heart Rate: 60-100 bpm.
    - Temperature: 97.0 - 99.0 °F.

    Respond STRICTLY in JSON format with the following exact keys:
    {{
        "overall_status": "excellent" or "attention" or "warning" (use 'attention' for minor elevations/stress, 'warning' for highly abnormal vitals),
        "summary": "A warm, personal, highly empathetic 2-sentence clinical baseline assessment addressing the mother by name.",
        "analysis": {{
            "blood_pressure": "Short clinical interpretation of BP.",
            "glucose": "Short clinical interpretation of blood glucose.",
            "other_vitals": "Interpretation of sleep, stress, heart rate, temperature, or weight."
        }},
        "recommendations": [
            "At least 3 specific, safe, highly actionable clinical/comfort steps tailored to their pregnancy/postpartum week (e.g. food swaps, hydration guidelines, specific prenatal yoga, or left-side resting)."
        ],
        "warnings": [
            "At least 2 clear maternal warning signs / 'Red Flags' (e.g., severe headache, visual changes for high BP, extreme fatigue) where they should immediately seek medical care."
        ]
    }}

    Be concise, speak with authoritative maternal warmth, and return ONLY valid JSON.
    """

    try:
        response = llm_service.client.generate_content(prompt)
        text = response.text.strip()
        
        # Clean markdown tags if LLM wraps JSON in ```json ... ```
        if text.startswith("```"):
            lines = text.split("\n")
            if lines[0].startswith("```json") or lines[0].startswith("```"):
                text = "\n".join(lines[1:-1])
        
        import json
        insights = json.loads(text)
        return insights
    except Exception as e:
        print(f"Error generating AI insights: {e}")
        # Fallback response structure
        return {
            "overall_status": "attention",
            "summary": f"Hello {current_user.username}. Thank you for logging your health tracker vitals. Here is Sona's general check-in.",
            "analysis": {
                "blood_pressure": "Vitals successfully logged. Monitor regularly to identify trends.",
                "glucose": "Keep tracking fasting and postpartum glucose levels.",
                "other_vitals": "Be sure to prioritize 7-8 hours of sleep and stress relief."
            },
            "recommendations": [
                "Drink 8-10 glasses of water daily to maintain amniotic fluid and blood volume.",
                "Practice 10 minutes of gentle diaphragmatic breathing to regulate stress.",
                "Schedule a short walk if your physical stamina permits."
            ],
            "warnings": [
                "Seek emergency care if you experience blurry vision, swelling of face/hands, or severe abdominal pain.",
                "Contact your doctor if fetal movements drop below 10 kicks in 2 hours."
            ]
        }

# ---------------------------------------------------------
# 2. DOCTOR LISTING FOR SCHEDULING WIZARD
# ---------------------------------------------------------

@router.get("/doctors", response_model=List[Dict[str, Any]])
async def list_verified_doctors(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_pg_db)
):
    """
    List all medical professionals in Sona AI, enabling patients to schedule consultations.
    """
    doctors = db.query(User, MedicalProfessionalProfile).join(
        MedicalProfessionalProfile, MedicalProfessionalProfile.user_id == User.id
    ).filter(User.role == UserRole.MEDICAL_PROFESSIONAL).all()

    return [
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "first_name": p.first_name,
            "last_name": p.last_name,
            "professional_title": p.professional_title,
            "specialization": p.specialization,
            "hospital_or_clinic": p.hospital_or_clinic,
            "years_of_experience": p.years_of_experience,
            "phone_number": p.phone_number,
        }
        for u, p in doctors
    ]

# ---------------------------------------------------------
# 3. SCHEDULING CALENDARS - APPOINTMENTS ENDPOINTS
# ---------------------------------------------------------

class AppointmentCreate(BaseModel):
    title: str
    doctor_id: Optional[int] = None
    doctor_name: Optional[str] = None
    date: str
    time: str
    location: Optional[str] = ""
    type: str  # checkup, ultrasound, vaccination, test, consult, other
    notes: Optional[str] = ""

class AppointmentResponse(BaseModel):
    id: int
    title: str
    doctor_id: Optional[int]
    doctor_name: Optional[str]
    date: str
    time: str
    location: Optional[str]
    type: str
    notes: Optional[str]
    status: str
    meeting_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

@router.post("/appointments", response_model=AppointmentResponse)
async def create_appointment(
    payload: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_pg_db)
):
    """
    Create a new appointment in PostgreSQL database.
    If appointment is a telemedicine consult, automatically generates a Jitsi Meet link.
    """
    meeting_url = None
    if payload.type == "consult":
        room_name = f"sona-telehealth-{current_user.id}-{payload.doctor_id or 0}-{int(datetime.utcnow().timestamp())}"
        meeting_url = f"https://meet.jit.si/{room_name}"

    db_appointment = Appointment(
        user_id=current_user.id,
        doctor_id=payload.doctor_id,
        doctor_name=payload.doctor_name,
        title=payload.title,
        date=payload.date,
        time=payload.time,
        location=payload.location,
        type=payload.type,
        notes=payload.notes,
        meeting_url=meeting_url,
        status="scheduled"
    )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

@router.get("/appointments", response_model=List[AppointmentResponse])
async def list_appointments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_pg_db)
):
    """
    Get all appointments scheduled by the logged-in user.
    """
    appointments = db.query(Appointment).filter(
        Appointment.user_id == current_user.id
    ).order_by(Appointment.date.asc(), Appointment.time.asc()).all()
    return appointments

@router.delete("/appointments/{appointment_id}")
async def delete_appointment(
    appointment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_pg_db)
):
    """
    Delete / cancel a scheduled appointment.
    """
    appt = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.user_id == current_user.id
    ).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    db.delete(appt)
    db.commit()
    return {"success": True, "message": "Appointment cancelled successfully"}

# ---------------------------------------------------------
# 4. COMMUNITY FORUMS - MONGODB BACKED ENDPOINTS
# ---------------------------------------------------------

class CommentCreate(BaseModel):
    content: str

class PostCreate(BaseModel):
    content: str
    mood: Optional[str] = ""
    tags: List[str] = []

@router.get("/community/posts")
async def get_community_posts(current_user: User = Depends(get_current_user)):
    """
    List all community posts stored in MongoDB.
    Enriches posts with 'isLiked' and 'isBookmarked' based on the logged-in user.
    """
    cursor = mongodb_db.db.community_posts.find().sort("timestamp", -1)
    posts = await cursor.to_list(length=100)
    
    formatted_posts = []
    for post in posts:
        post_id = str(post["_id"])
        liked_users = post.get("liked_users", [])
        bookmarked_users = post.get("bookmarked_users", [])
        
        comments = []
        for c in post.get("comments", []):
            comments.append({
                "id": str(c.get("id")),
                "author": c.get("author"),
                "content": c.get("content"),
                "timestamp": c.get("timestamp"),
                "likes": c.get("likes", 0)
            })

        formatted_posts.append({
            "id": post_id,
            "author": post.get("author"),
            "content": post.get("content"),
            "timestamp": post.get("timestamp"),
            "likes": len(liked_users),
            "comments": comments,
            "isLiked": str(current_user.id) in liked_users,
            "isBookmarked": str(current_user.id) in bookmarked_users,
            "tags": post.get("tags", []),
            "mood": post.get("mood")
        })
        
    return formatted_posts

@router.post("/community/posts")
async def create_community_post(
    payload: PostCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Create a new community post and save to MongoDB.
    """
    new_post = {
        "author": current_user.username,
        "content": payload.content,
        "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
        "liked_users": [],
        "bookmarked_users": [],
        "comments": [],
        "tags": payload.tags,
        "mood": payload.mood or None
    }
    result = await mongodb_db.db.community_posts.insert_one(new_post)
    return {"success": True, "id": str(result.inserted_id)}

@router.post("/community/posts/{post_id}/like")
async def like_community_post(
    post_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Toggle 'like' status for a community post in MongoDB.
    """
    try:
        oid = ObjectId(post_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid post ID")
        
    post = await mongodb_db.db.community_posts.find_one({"_id": oid})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    liked_users = post.get("liked_users", [])
    user_id_str = str(current_user.id)
    
    if user_id_str in liked_users:
        liked_users.remove(user_id_str)
    else:
        liked_users.append(user_id_str)
        
    await mongodb_db.db.community_posts.update_one(
        {"_id": oid},
        {"$set": {"liked_users": liked_users}}
    )
    
    return {"success": True, "likes": len(liked_users), "isLiked": user_id_str in liked_users}

@router.post("/community/posts/{post_id}/bookmark")
async def bookmark_community_post(
    post_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Toggle 'bookmark' status for a community post in MongoDB.
    """
    try:
        oid = ObjectId(post_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid post ID")
        
    post = await mongodb_db.db.community_posts.find_one({"_id": oid})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    bookmarked_users = post.get("bookmarked_users", [])
    user_id_str = str(current_user.id)
    
    if user_id_str in bookmarked_users:
        bookmarked_users.remove(user_id_str)
    else:
        bookmarked_users.append(user_id_str)
        
    await mongodb_db.db.community_posts.update_one(
        {"_id": oid},
        {"$set": {"bookmarked_users": bookmarked_users}}
    )
    
    return {"success": True, "isBookmarked": user_id_str in bookmarked_users}

@router.post("/community/posts/{post_id}/comments")
async def add_post_comment(
    post_id: str,
    payload: CommentCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Add a comment to an existing post in MongoDB.
    """
    try:
        oid = ObjectId(post_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid post ID")
        
    post = await mongodb_db.db.community_posts.find_one({"_id": oid})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    comments = post.get("comments", [])
    new_comment = {
        "id": str(ObjectId()),
        "author": current_user.username,
        "content": payload.content,
        "timestamp": "Just now",
        "likes": 0
    }
    comments.append(new_comment)
    
    await mongodb_db.db.community_posts.update_one(
        {"_id": oid},
        {"$set": {"comments": comments}}
    )
    
    return {"success": True, "comment": new_comment}
