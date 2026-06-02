from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime
import json

from sqlalchemy.orm import Session

from models.schemas import (
    ChatRequest, 
    ChatResponse, 
    EmotionDetectionRequest,
    EmotionDetectionResponse,
    MessageGenerationRequest,
    MessageGenerationResponse,
    CryAnalysisRequest,
    CryAnalysisResponse
)
from ai.orchestrator import AIOrchestrator
from ai.modules.cry_analysis import CryAnalysisModule
from ai.crisis import detect_crisis, send_twilio_crisis_alert
from models.database import db, get_pg_db
from models.auth_models import ChatMessage

router = APIRouter(prefix="/api", tags=["chat"])

# Initialize AI components
orchestrator = AIOrchestrator()
cry_analyzer = CryAnalysisModule()

def save_message_to_postgres(db: Session, user_id: str, session_id: str, role: str, content: str, 
                               emotion_detected: str = None, is_grounding_exercise: bool = False, 
                               suggestions: list = None) -> bool:
    """Save chat message to PostgreSQL. Returns True if successful, False otherwise."""
    try:
        # Try to convert user_id to int (PostgreSQL users.id is Integer)
        user_id_int = int(user_id)
        
        message = ChatMessage(
            user_id=user_id_int,
            role=role,
            content=content,
            session_id=session_id,
            emotion_detected=emotion_detected,
            is_grounding_exercise=is_grounding_exercise,
            suggestions=json.dumps(suggestions) if suggestions else None,
            timestamp=datetime.utcnow()
        )
        db.add(message)
        db.commit()
        return True
    except (ValueError, Exception) as e:
        # If user_id is not a valid integer or any other error, rollback and return False
        db.rollback()
        print(f"PostgreSQL persistence skipped: {e}")
        return False

@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_pg_db)
):
    """Main chat endpoint with AI orchestration, patient-aware RAG, and persistence."""
    
    # STEP 1: Try to save user message to PostgreSQL (best effort)
    save_message_to_postgres(
        db, request.user_id, request.session_id, "user", request.message
    )
    crisis_detection = detect_crisis(request.message)
    if crisis_detection["is_crisis"]:
        background_tasks.add_task(
            send_twilio_crisis_alert,
            request.user_id,
            request.message,
            crisis_detection,
        )
    
    try:
        # Fetch patient profile + questionnaire data for personalization
        patient_context = ""
        try:
            user_id_int = int(request.user_id)
            from models.auth_models import PatientProfile
            patient_profile = (
                db.query(PatientProfile)
                .filter(PatientProfile.user_id == user_id_int)
                .first()
            )
            if patient_profile:
                parts = [f"Patient name: {patient_profile.first_name}"]
                if patient_profile.age:
                    parts.append(f"Age: {patient_profile.age}")
                if patient_profile.gestation_week:
                    parts.append(f"Currently {patient_profile.gestation_week} weeks pregnant.")
                elif patient_profile.days_postpartum is not None:
                    parts.append(f"{patient_profile.days_postpartum} days postpartum.")
                if patient_profile.medical_history:
                    parts.append("Medical history: " + "; ".join(patient_profile.medical_history))
                if patient_profile.allergies:
                    parts.append("Allergies: " + ", ".join(patient_profile.allergies))
                if patient_profile.current_medications:
                    parts.append("Current medications: " + "; ".join(patient_profile.current_medications))
                if patient_profile.last_bp:
                    parts.append(f"Last known BP: {patient_profile.last_bp} mmHg")
                if patient_profile.stress_level is not None:
                    stress_label = "high" if patient_profile.stress_level >= 7 else ("moderate" if patient_profile.stress_level >= 4 else "low")
                    parts.append(f"Self-reported stress level: {patient_profile.stress_level}/10 ({stress_label}).")
                if patient_profile.sleep_hours is not None:
                    if patient_profile.sleep_hours < 5:
                        parts.append(f"Severe sleep deprivation: only {patient_profile.sleep_hours}h/night. Be especially gentle and acknowledge exhaustion.")
                    elif patient_profile.sleep_hours < 6:
                        parts.append(f"Poor sleep: {patient_profile.sleep_hours}h/night. Factor in fatigue when giving advice.")
                if patient_profile.has_anxiety:
                    parts.append("Patient reported anxiety during onboarding. Prioritize calm, reassuring language.")
                if patient_profile.has_depression:
                    parts.append("Patient reported depression/postpartum depression. Use mental-health-aware, non-judgmental tone.")
                if patient_profile.feeding_method:
                    parts.append(f"Feeding method: {patient_profile.feeding_method}.")
                if patient_profile.primary_health_goals:
                    parts.append("Health goals: " + ", ".join(patient_profile.primary_health_goals) + ".")
                if patient_profile.additional_notes:
                    parts.append(f"Main concerns from intake: {patient_profile.additional_notes}")
                if patient_profile.clinical_baseline_summary:
                    parts.append(f"\nClinical baseline (from intake): {patient_profile.clinical_baseline_summary}")
                patient_context = "\n".join(parts)
        except (ValueError, Exception) as e:
            print(f"[chat] Could not load patient profile: {e}")

        # Route through AI Orchestrator — its own RAGService handles retrieval internally
        from models.schemas import AIOrchestrationRequest
        orchestration_request = AIOrchestrationRequest(
            user_id=request.user_id,
            session_id=request.session_id,
            input_text=request.message,
            mode=request.mode,
            audio_data=request.audio_data,
            context={
                "patient_context": patient_context,
            }
        )
        
        orchestration_response = await orchestrator.process_request(orchestration_request)
        response_text = orchestration_response.response
        emotion_detected = orchestration_response.emotion_detected
        is_grounding_exercise = orchestration_response.is_grounding_exercise
        suggestions = orchestration_response.suggestions
        
        # Save AI response to PostgreSQL (best effort)
        save_message_to_postgres(
            db, request.user_id, request.session_id, "assistant", response_text,
            emotion_detected=emotion_detected.value if emotion_detected else None,
            is_grounding_exercise=is_grounding_exercise,
            suggestions=suggestions
        )
        
        # Also save to MongoDB for backward compatibility (background task)
        mock_response = {
            "response": response_text,
            "emotion_detected": None,
            "is_grounding_exercise": False,
            "suggestions": []
        }
        background_tasks.add_task(
            save_chat_interaction,
            request.user_id,
            request.session_id,
            request,
            mock_response
        )
        
        # Return AI response to frontend
        return ChatResponse(
            response=response_text,
            emotion_detected=emotion_detected,
            suggestions=suggestions if suggestions is not None else [],
            is_grounding_exercise=is_grounding_exercise,
            metadata={"crisis_detection": crisis_detection}
        )

        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")


@router.post("/analyze-cry", response_model=CryAnalysisResponse)
async def analyze_cry(request: CryAnalysisRequest):
    """Analyze baby cry from audio data"""
    try:
        analysis = await cry_analyzer.analyze_cry(request.audio_data, request.user_id)
        
        return CryAnalysisResponse(
            reason=analysis["cry_analysis"]["reason"],
            confidence=analysis["cry_analysis"]["confidence"],
            suggestions=analysis["suggestions"],
            urgency_level=analysis["urgency"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cry analysis failed: {str(e)}")

@router.post("/detect-emotion", response_model=EmotionDetectionResponse)
async def detect_emotion(request: EmotionDetectionRequest):
    """Detect emotion from text"""
    try:
        emotion = await orchestrator._detect_emotion(request.text)
        
        # Calculate stress level based on emotion
        stress_levels = {
            "panic": 0.9,
            "anxious": 0.7,
            "angry": 0.6,
            "sad": 0.5,
            "happy": 0.2,
            "neutral": 0.3
        }
        
        stress_level = stress_levels.get(emotion, 0.4)
        confidence = 0.8  # Placeholder for actual confidence calculation
        
        return EmotionDetectionResponse(
            emotion=emotion,
            confidence=confidence,
            stress_level=stress_level
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Emotion detection failed: {str(e)}")

@router.post("/generate-message", response_model=MessageGenerationResponse)
async def generate_message(request: MessageGenerationRequest):
    """Generate communication message"""
    try:
        comm_module = orchestrator.communication
        response = await comm_module.generate_message(
            request.user_id,
            f"Help me write a message to my {request.recipient_type} about {request.situation}",
            {"tone": request.tone}
        )
        
        return MessageGenerationResponse(
            message=response["generated_message"],
            tone=request.tone,
            suggestions=response["suggestions"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Message generation failed: {str(e)}")

@router.get("/chat-history/{user_id}")
async def get_chat_history(
    user_id: str, 
    session_id: Optional[str] = None, 
    limit: int = 50,
    db: Session = Depends(get_pg_db)
):
    """Get chat history for a user from PostgreSQL"""
    try:
        # Try to convert user_id to int
        try:
            user_id_int = int(user_id)
        except ValueError:
            # If user_id is not a valid integer, return empty history
            # This happens with test data like "user_123"
            return {"history": [], "total_count": 0}
        
        query = db.query(ChatMessage).filter(ChatMessage.user_id == user_id_int)
        
        if session_id:
            query = query.filter(ChatMessage.session_id == session_id)
        
        # Order by timestamp descending, then reverse for chronological order
        messages = query.order_by(ChatMessage.timestamp.desc()).limit(limit).all()
        messages.reverse()  # Reverse to get chronological order
        
        # Format response
        history = [
            {
                "id": msg.id,
                "role": msg.role,
                "content": msg.content,
                "timestamp": msg.timestamp.isoformat() if msg.timestamp else None,
                "session_id": msg.session_id,
                "emotion_detected": msg.emotion_detected,
                "is_grounding_exercise": msg.is_grounding_exercise,
                "suggestions": json.loads(msg.suggestions) if msg.suggestions else None
            }
            for msg in messages
        ]
                
        return {"history": history, "total_count": len(history)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get chat history: {str(e)}")

@router.get("/user-sessions/{user_id}")
async def get_user_sessions(user_id: str):
    """Get all chat sessions for a user"""
    try:
        sessions = await db.get_user_sessions(user_id)
        return {"sessions": sessions}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get user sessions: {str(e)}")

@router.get("/user-profile/{user_id}")
async def get_user_profile(user_id: str):
    """Get user profile"""
    try:
        profile = await db.get_user_profile(user_id)
        if not profile:
            # Create default profile
            profile = {
                "user_id": user_id,
                "created_at": datetime.utcnow(),
                "preferences": {}
            }
            await db.save_user_profile(user_id, profile)
            
        return profile
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get user profile: {str(e)}")

@router.post("/user-profile/{user_id}")
async def update_user_profile(user_id: str, profile_data: dict):
    """Update user profile"""
    try:
        await db.save_user_profile(user_id, profile_data)
        return {"message": "Profile updated successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")

@router.get("/mood-history/{user_id}")
async def get_mood_history(user_id: str, days: int = 30):
    """Get mood history for a user"""
    try:
        mood_history = await db.get_mood_history(user_id, days)
        return {"mood_history": mood_history}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get mood history: {str(e)}")

@router.post("/mood-log/{user_id}")
async def log_mood(user_id: str, mood_data: dict):
    """Log mood entry"""
    try:
        await db.save_mood_log(user_id, mood_data)
        return {"message": "Mood logged successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to log mood: {str(e)}")

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

async def save_chat_interaction(user_id: str, session_id: str, request: ChatRequest, response: dict):
    """Save chat interaction to database (background task)"""
    try:
        # Save user message
        await db.save_message(user_id, session_id, {
            "type": "user",
            "content": request.message,
            "mode": request.mode,
            "has_audio": bool(request.audio_data)
        })
        
        # Save assistant response
        await db.save_message(user_id, session_id, {
            "type": "assistant",
            "content": response.get("response", ""),
            "emotion_detected": response.get("emotion_detected"),
            "is_grounding_exercise": response.get("is_grounding_exercise", False),
            "suggestions": response.get("suggestions", [])
        })
        
    except Exception as e:
        print(f"Error saving chat interaction: {e}")
        # Don't fail the response if database save fails
