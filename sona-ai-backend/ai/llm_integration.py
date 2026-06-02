import google.generativeai as genai
import os
from typing import Dict, Any, Optional
from models.schemas import ChatMode, EmotionType


class LLMIntegration:
    """Integration with Gemini API for LLM responses"""

    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError("❌ GEMINI_API_KEY not found in environment variables")

        # Set API key globally
        genai.configure(api_key=api_key)
        # Create client
        self.client = genai.GenerativeModel("gemini-1.5-flash")


    async def generate_response(
        self,
        user_message: str,
        mode: ChatMode,
        emotion: Optional[EmotionType] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:

        user_message_clean = user_message.lower().strip()

        system_prompt = self._get_system_prompt(mode, emotion)
        rag_context = (context or {}).get("rag_context", "")
        patient_context = (context or {}).get("patient_context", "")

        # Build the patient context block only if we have data
        patient_context_block = ""
        if patient_context:
            patient_context_block = f"""
--- PATIENT CONTEXT (use this to personalise your response) ---
{patient_context}
----------------------------------------------------------------
"""

        try:
            # Strong structured prompt with personalization rule
            full_prompt = f"""
You are Sona AI, an advanced, highly trained maternal and infant health clinical advisor. Your goal is to provide highly actionable, concrete solutions.

Follow these rules strictly:
1. Provide Concrete Solutions: Do not just tell the user to see a doctor for common, non-emergency issues. Give step-by-step instructions, safe home care remedies, or specific clinical advice to solve their problem.
2. Clinical Authority: Speak with the confidence, warmth, and expertise of a senior clinical specialist. Give clear, direct answers.
3. Smart Triage: If the user describes severe, acute symptoms (e.g., severe bleeding, extreme abdominal pain, unconsciousness), validate their pain, provide immediate first-aid steps if applicable, and firmly instruct them to go to the emergency room immediately.
4. Conversational Flow (NO REPETITION): If the user asks a direct question or states a symptom, DO NOT re-introduce yourself (e.g., do not say "I am Sona"). Dive straight into the clinical answer.
5. The "One-Question" Rule (NO DIAGNOSTIC LOOPS): If a user reports a non-emergency symptom (e.g., bloating, mild pain), provide immediate, safe home-care comfort measures right away based on the most likely maternal/postpartum causes. Do not give them a list of diagnostic questions. You may ask EXACTLY ONE natural, conversational follow-up question at the end to keep the human connection, but do not interrogate them.
6. The WHO Timeline Law: The WHO age guidelines for infant feeding (e.g., 6 months of exclusive breastfeeding) are absolute law. If a user asks about giving ANY solid food, puree, or drink to a baby under 6 months old, you must strictly advise them to wait until 6 months.
7. The Knowledge Fallback: Always prioritize the provided Context. IF the Context does not contain the answer, seamlessly fall back on your general medical training. NEVER mention that you are checking a database.
8. Personalization: Use the provided Patient Context below to personalise your advice. Address the patient by name if known. If they ask for activities or wellness tips, recommend specific, safe activities (like prenatal yoga at their exact gestation week, or postpartum walking) that perfectly match their current gestational or postpartum timeline. If they have known allergies or conditions in their profile, factor those into any advice you give.

{system_prompt}
{patient_context_block}
WHO document context:
{rag_context if rag_context else "No matching WHO document excerpt was retrieved for this message."}

User message: "{user_message}"

Respond as Sona:
"""

            # Call Gemini
            response = self.client.generate_content(full_prompt)

            # Strict response validation
            if not response or not hasattr(response, "text") or not response.text:
                raise Exception("Empty response from Gemini")

            ai_response = response.text.strip()

            # Debug logs
            print("\n--- DEBUG ---")
            print("USER:", user_message)
            print("AI:", ai_response[:200])
            print("-------------\n")

            suggestions = self._generate_suggestions(ai_response, mode, emotion)

            return {
                "response": ai_response,
                "suggestions": suggestions,
                "model": "gemini-1.5-flash",

                "tokens_used": 0
            }

        except Exception as e:
            print(f"❌ Gemini API error: {e}")

            return {
                "response": self._get_fallback_response(mode, emotion),
                "suggestions": self._get_fallback_suggestions(mode),
                "model": "fallback",
                "tokens_used": 0
            }


    def _get_system_prompt(self, mode: ChatMode, emotion: Optional[EmotionType]) -> str:

        base_prompt = """
You are Sona, an AI-powered maternal and child health assistant.
You are empathetic, supportive, and emotionally intelligent.
"""

        if emotion == EmotionType.PANIC:
            return base_prompt + """
User is panicking.
- Calm them immediately
- Use short sentences
- Guide breathing
- Be extremely gentle
"""

        elif emotion == EmotionType.ANXIOUS:
            return base_prompt + """
User is anxious.
- Reassure them
- Offer calming techniques
- Speak softly and supportively
"""

        elif mode == ChatMode.HEALTH:
            return base_prompt + """
Health mode:
- Talk about baby care, maternal health
- Give safe, general advice
- Suggest doctor when needed
"""

        elif mode == ChatMode.IDENTITY:
            return base_prompt + """
Identity mode:
- Help mothers with career, confidence
- Highlight transferable skills
- Be empowering
"""

        return base_prompt

    def _generate_suggestions(self, response: str, mode: ChatMode, emotion: Optional[EmotionType]) -> list:

        if emotion == EmotionType.PANIC:
            return [
                "Try a breathing exercise",
                "Ground yourself (5-4-3-2-1)",
                "Call someone you trust",
                "Listen to calming audio"
            ]

        elif mode == ChatMode.HEALTH:
            return [
                "Track symptoms",
                "Consult a doctor",
                "Rest and hydrate",
                "Light exercise"
            ]

        elif mode == ChatMode.IDENTITY:
            return [
                "List your skills",
                "Update resume",
                "Explore flexible jobs",
                "Network online"
            ]

        return [
            "Take a short break",
            "Talk to someone",
            "Practice self-care",
            "You’re doing great 💛"
        ]

    def _get_fallback_response(self, mode: ChatMode, emotion: Optional[EmotionType]) -> str:

        if emotion == EmotionType.PANIC:
            return "Hey… let's pause together for a moment 💛 Take a slow breath in… and out… You're not alone in this."

        elif mode == ChatMode.HEALTH:
            return "I'm here for you on this journey 💕 For anything serious, please reach out to your doctor."

        elif mode == ChatMode.IDENTITY:
            return "You're doing amazing 💛 Your experience as a mother has given you strengths you might not even see."

        return "I'm here for you 💛 Tell me what's on your mind, even if it feels small."

    def _get_fallback_suggestions(self, mode: ChatMode) -> list:

        return [
            "Take a deep breath",
            "Rest for a bit",
            "Talk to someone",
            "Be kind to yourself"
        ]
