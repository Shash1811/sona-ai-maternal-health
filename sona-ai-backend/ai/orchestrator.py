from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

from models.schemas import (
    AIOrchestrationRequest, 
    AIOrchestrationResponse, 
    AIIntent, 
    EmotionType,
    ChatMode
)

from ai.modules.mental_health import MentalHealthModule
from ai.modules.cry_analysis import CryAnalysisModule
from ai.modules.identity_coach import IdentityCoachModule
from ai.modules.communication import CommunicationModule
from ai.llm_integration import LLMIntegration
from ai.rag_service import RAGService
from models.database import db


class AIOrchestrator:
    """Smart routing system for AI modules"""
    
    def __init__(self):
        self.mental_health = MentalHealthModule()
        self.cry_analysis = CryAnalysisModule()
        self.identity_coach = IdentityCoachModule()
        self.communication = CommunicationModule()
        self.llm = LLMIntegration()
        self.rag = RAGService()
        
    async def process_request(self, request: AIOrchestrationRequest) -> AIOrchestrationResponse:
        
        print("\n🔥 NEW REQUEST 🔥")
        print("USER INPUT:", request.input_text)

        # STEP 1: Intent
        intent = await self._detect_intent(request)
        print("INTENT:", intent.intent_type)

        # STEP 2: Emotion
        emotion = await self._detect_emotion(request.input_text)
        print("EMOTION:", emotion)

        # STEP 3: Route
        request.context = request.context or {}
        if "rag_context" not in request.context:
            rag_chunks = self.rag.retrieve(request.input_text)
            request.context["rag_context"] = self.rag.build_context(rag_chunks)
            request.context["rag_sources"] = [
                {"title": chunk["title"], "source": chunk["source"], "score": chunk["score"]}
                for chunk in rag_chunks
            ]

        response_data = await self._route_request(request, intent, emotion)
        response_data.metadata = response_data.metadata or {}
        response_data.metadata["rag_sources"] = request.context.get("rag_sources", [])

        print("FINAL RESPONSE:", response_data.response)
        print("---------------\n")

        # STEP 4: Save
        await self._save_interaction(request, response_data)

        return response_data
        

    async def _detect_intent(self, request: AIOrchestrationRequest) -> AIIntent:
        text = request.input_text.strip().lower()

        # Handle greetings
        if text in ["hi", "hello", "hey", "hii"]:
            return AIIntent(
                intent_type="greeting",
                confidence=1.0,
                parameters={}
            )

        panic_keywords = ["panic", "can't breathe", "overwhelmed"]

        if any(k in text for k in panic_keywords):
            return AIIntent(
                intent_type="panic_support",
                confidence=0.9,
                parameters={}
            )

        identity_keywords = ["resume", "career", "job"]

        if request.mode == ChatMode.IDENTITY or any(k in text for k in identity_keywords):
            return AIIntent(
                intent_type="identity_coaching",
                confidence=0.8,
                parameters={}
            )

        comm_keywords = [
        "write a message",
        "draft a message",
        "send a message",
        "text my",
        "message my",
        "compose message"
    ]


        if any(k in text for k in comm_keywords):
            return AIIntent(
                intent_type="communication",
                confidence=0.7,
                parameters={}
            )

        return AIIntent(
            intent_type="general_health",
            confidence=0.6,
            parameters={}
        )


    async def _detect_emotion(self, text: str) -> EmotionType:
        text = text.lower()

        if any(w in text for w in ["panic", "can't breathe"]):
            return EmotionType.PANIC

        if any(w in text for w in ["anxious", "worried"]):
            return EmotionType.ANXIOUS

        if any(w in text for w in ["sad", "cry"]):
            return EmotionType.SAD

        return EmotionType.NEUTRAL


    async def _route_request(self, request, intent, emotion):

        # 🔥 FORCE LLM FOR NORMAL CHAT
        if intent.intent_type == "general_health":
            print("➡️ ROUTING TO LLM")
            response = await self.llm.generate_response(
                request.input_text,
                request.mode,
                emotion,
                request.context
            )

            return AIOrchestrationResponse(
                response=response["response"],
                intent=intent,
                emotion_detected=emotion,
                suggestions=response.get("suggestions", []),
                metadata={"llm": response}
            )

        elif intent.intent_type == "panic_support":
            print("➡️ ROUTING TO MENTAL HEALTH")

            response = await self.mental_health.provide_grounding_exercise(
                request.user_id, request.input_text
            )

            return AIOrchestrationResponse(
                response=response["response"],
                intent=intent,
                emotion_detected=emotion,
                suggestions=response["suggestions"],
                is_grounding_exercise=True
            )

        elif intent.intent_type == "identity_coaching":
            print("➡️ ROUTING TO IDENTITY")

            response = await self.identity_coach.process_identity_request(
                request.user_id, request.input_text, request.context
            )

            return AIOrchestrationResponse(
                response=response["response"],
                intent=intent,
                emotion_detected=emotion,
                suggestions=response["suggestions"]
            )

        elif intent.intent_type == "communication":
            print("➡️ ROUTING TO COMMUNICATION")

            response = await self.communication.generate_message(
                request.user_id, request.input_text, request.context
            )

            return AIOrchestrationResponse(
                response=response["response"],
                intent=intent,
                emotion_detected=emotion,
                suggestions=response["suggestions"]
            )

        else:
            print("⚠️ FALLBACK TO LLM")

            response = await self.llm.generate_response(
                request.input_text,
                request.mode,
                emotion,
                request.context
            )

            return AIOrchestrationResponse(
                response=response["response"],
                intent=intent,
                emotion_detected=emotion,
                suggestions=response.get("suggestions", [])
            )


    async def _save_interaction(self, request, response):
        try:
            await db.save_message(request.user_id, request.session_id, {
                "type": "user",
                "content": request.input_text
            })

            await db.save_message(request.user_id, request.session_id, {
                "type": "assistant",
                "content": response.response
            })

        except Exception as e:
            print("DB ERROR:", e)
