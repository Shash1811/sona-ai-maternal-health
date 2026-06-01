from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class ChatMode(str, Enum):
    HEALTH = "health"
    IDENTITY = "identity"

class MessageType(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"

class EmotionType(str, Enum):
    HAPPY = "happy"
    SAD = "sad"
    ANXIOUS = "anxious"
    ANGRY = "angry"
    NEUTRAL = "neutral"
    PANIC = "panic"

class CryReason(str, Enum):
    HUNGRY = "hungry"
    SLEEPY = "sleepy"
    PAIN = "pain"
    DISCOMFORT = "discomfort"
    COLIC = "colic"
    UNKNOWN = "unknown"

class Message(BaseModel):
    type: MessageType
    content: str
    timestamp: Optional[datetime] = None
    emotion: Optional[EmotionType] = None
    metadata: Optional[Dict[str, Any]] = None

class ChatRequest(BaseModel):
    user_id: str
    session_id: str
    message: str
    mode: ChatMode = ChatMode.HEALTH
    audio_data: Optional[str] = None  # Base64 encoded audio

class ChatResponse(BaseModel):
    response: str
    emotion_detected: Optional[EmotionType] = None
    suggestions: Optional[List[str]] = None
    is_grounding_exercise: bool = False
    metadata: Optional[Dict[str, Any]] = None

class CryAnalysisRequest(BaseModel):
    user_id: str
    audio_data: str  # Base64 encoded audio
    baby_age_months: int

class CryAnalysisResponse(BaseModel):
    reason: CryReason
    confidence: float
    suggestions: List[str]
    urgency_level: str  # low, medium, high

class EmotionDetectionRequest(BaseModel):
    text: str
    user_id: str

class EmotionDetectionResponse(BaseModel):
    emotion: EmotionType
    confidence: float
    stress_level: float  # 0-1 scale

class MessageGenerationRequest(BaseModel):
    recipient_type: str  # partner, family, doctor
    situation: str
    tone: str = "supportive"
    user_id: str

class MessageGenerationResponse(BaseModel):
    message: str
    tone: str
    suggestions: List[str]

class UserProfile(BaseModel):
    user_id: str
    name: Optional[str] = None
    baby_due_date: Optional[datetime] = None
    baby_birth_date: Optional[datetime] = None
    preferences: Optional[Dict[str, Any]] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class MoodLog(BaseModel):
    user_id: str
    mood: EmotionType
    stress_level: float
    notes: Optional[str] = None
    timestamp: Optional[datetime] = None

class ChatSession(BaseModel):
    session_id: str
    user_id: str
    mode: ChatMode
    started_at: datetime
    last_activity: datetime
    message_count: int = 0

class AIIntent(BaseModel):
    intent_type: str
    confidence: float
    parameters: Dict[str, Any]

class AIOrchestrationRequest(BaseModel):
    user_id: str
    session_id: str
    input_text: str
    mode: ChatMode
    audio_data: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class AIOrchestrationResponse(BaseModel):
    response: str
    intent: AIIntent
    emotion_detected: Optional[EmotionType] = None
    is_grounding_exercise: bool = False
    suggestions: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None
