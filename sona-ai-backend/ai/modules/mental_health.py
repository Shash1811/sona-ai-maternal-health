from typing import Dict, Any, List
import random

class MentalHealthModule:
    """Specialized module for mental health support and grounding exercises"""
    
    def __init__(self):
        self.grounding_exercises = [
            {
                "name": "5-4-3-2-1 Grounding",
                "steps": [
                    "Name 5 things you can see around you",
                    "Name 4 things you can feel (your clothes, chair, etc.)",
                    "Name 3 things you can hear",
                    "Name 2 things you can smell",
                    "Name 1 thing you can taste"
                ]
            },
            {
                "name": "Box Breathing",
                "steps": [
                    "Breathe in slowly for 4 counts",
                    "Hold your breath for 4 counts",
                    "Breathe out slowly for 4 counts",
                    "Hold for 4 counts",
                    "Repeat 5-10 times"
                ]
            },
            {
                "name": "Progressive Muscle Relaxation",
                "steps": [
                    "Tense your shoulders for 5 seconds, then release",
                    "Tense your hands for 5 seconds, then release", 
                    "Tense your feet for 5 seconds, then release",
                    "Notice the difference between tension and relaxation"
                ]
            }
        ]
        
    async def provide_grounding_exercise(self, user_id: str, user_input: str) -> Dict[str, Any]:
        """Provide immediate grounding exercise for panic/anxiety"""
        
        # Select appropriate exercise based on context
        exercise = self._select_grounding_exercise(user_input)
        
        response = f"""
I can see you're feeling overwhelmed right now. Let's do a grounding exercise together to help you feel more centered.

**{exercise['name']}**

{self._format_exercise_steps(exercise['steps'])}

Take your time with each step. I'm right here with you through this. You're safe, and this feeling will pass.

Remember: panic attacks are temporary, even though they feel overwhelming in the moment. You've gotten through this before, and you'll get through it again.
        """
        
        suggestions = [
            "Continue with the grounding exercise",
            "Try splashing cold water on your face",
            "Hold an ice cube in your hand",
            "Call a trusted friend or family member",
            "Use a calming app like Calm or Headspace"
        ]
        
        return {
            "response": response,
            "suggestions": suggestions,
            "exercise_type": exercise["name"],
            "urgency": "high"
        }
        
    async def assess_stress_level(self, user_id: str, user_input: str) -> Dict[str, Any]:
        """Assess user's stress level from text"""
        
        stress_indicators = [
            "overwhelmed", "can't cope", "too much", "stressed", "exhausted",
            "burnout", "breaking point", "at my limit"
        ]
        
        stress_score = 0
        for indicator in stress_indicators:
            if indicator in user_input.lower():
                stress_score += 1
                
        stress_level = min(stress_score / 3, 1.0)  # Normalize to 0-1
        
        if stress_level > 0.7:
            return await self._provide_high_stress_support(user_id)
        elif stress_level > 0.4:
            return await self._provide_moderate_stress_support(user_id)
        else:
            return await self._provide_low_stress_support(user_id)
            
    async def _provide_high_stress_support(self, user_id: str) -> Dict[str, Any]:
        """Provide support for high stress levels"""
        
        response = """
It sounds like you're under a lot of pressure right now. Your feelings are completely valid - motherhood is incredibly demanding, and it's okay to feel overwhelmed.

Let's focus on immediate relief:

**Immediate Actions:**
- Take 3 deep breaths right now
- Put down what you're doing for 5 minutes
- Drink a glass of water
- Step outside for fresh air if possible

**Remember:**
- You don't have to be perfect
- It's okay to ask for help
- This difficult phase will pass
- You're doing an amazing job

Would you like me to help you identify specific areas where you could get support?
        """
        
        suggestions = [
            "Call a friend or family member",
            "Ask your partner to take over for 30 minutes",
            "Consider hiring temporary help if possible",
            "Join a mothers' support group",
            "Talk to a therapist or counselor"
        ]
        
        return {
            "response": response,
            "suggestions": suggestions,
            "stress_level": "high"
        }
        
    async def _provide_moderate_stress_support(self, user_id: str) -> Dict[str, Any]:
        """Provide support for moderate stress levels"""
        
        response = """
I can see you're managing a lot right now. It's great that you're recognizing your stress levels - that's the first step to managing them effectively.

**Stress Management Strategies:**
- Break large tasks into smaller, manageable steps
- Schedule short breaks throughout your day
- Practice saying "no" to non-essential commitments
- Prioritize sleep and nutrition

**Self-Care Ideas:**
- 10-minute walk outside
- Quick stretching routine
- Listen to calming music
- Journal your thoughts for 5 minutes

Remember that taking care of yourself isn't selfish - it's essential for being able to care for others.
        """
        
        suggestions = [
            "Try a 10-minute meditation",
            "Go for a short walk",
            "Call a friend for support",
            "Practice deep breathing exercises",
            "Schedule regular self-care time"
        ]
        
        return {
            "response": response,
            "suggestions": suggestions,
            "stress_level": "moderate"
        }
        
    async def _provide_low_stress_support(self, user_id: str) -> Dict[str, Any]:
        """Provide support for low stress levels"""
        
        response = """
It's good that you're staying aware of your stress levels. Even low-level stress can build up over time, so it's smart to address it early.

**Preventive Strategies:**
- Maintain a consistent sleep schedule
- Stay connected with your support network
- Make time for activities you enjoy
- Practice gratitude daily

**Building Resilience:**
- Focus on what you can control
- Celebrate small wins
- Learn to accept help graciously
- Remember that "good enough" is often perfect

You're doing a wonderful job managing the complexities of motherhood!
        """
        
        suggestions = [
            "Continue your current self-care routine",
            "Explore new stress management techniques",
            "Connect with other mothers regularly",
            "Consider journaling your experiences",
            "Practice mindfulness exercises"
        ]
        
        return {
            "response": response,
            "suggestions": suggestions,
            "stress_level": "low"
        }
        
    def _select_grounding_exercise(self, user_input: str) -> Dict[str, Any]:
        """Select appropriate grounding exercise based on user input"""
        
        user_input_lower = user_input.lower()
        
        if "breathe" in user_input_lower or "breathing" in user_input_lower:
            return self.grounding_exercises[1]  # Box Breathing
        elif "muscle" in user_input_lower or "tense" in user_input_lower:
            return self.grounding_exercises[2]  # Progressive Muscle Relaxation
        else:
            return self.grounding_exercises[0]  # 5-4-3-2-1 Grounding
            
    def _format_exercise_steps(self, steps: List[str]) -> str:
        """Format exercise steps for display"""
        formatted = ""
        for i, step in enumerate(steps, 1):
            formatted += f"{i}. {step}\n"
        return formatted
