from typing import Dict, Any, List
import re

class CommunicationModule:
    """Specialized module for generating communication messages and providing communication support"""
    
    def __init__(self):
        self.message_templates = {
            "partner": {
                "supportive": {
                    "need_help": "I'm feeling really overwhelmed today and could really use your support. Could you help me with [specific task]?",
                    "emotional_support": "I'm having a tough time emotionally right now. Can we talk later tonight? I just need someone to listen.",
                    "appreciation": "I want you to know how much I appreciate everything you do for our family. Your support means everything to me.",
                    "quality_time": "I miss connecting with you. Can we plan some time just for us this week?",
                    "burnout": "I'm feeling close to burnout and need to talk about how we can rebalance our responsibilities."
                },
                "assertive": {
                    "need_break": "I need a real break to recharge. Can you take over childcare for [specific time] this weekend?",
                    "household_responsibility": "I need you to take more responsibility around the house. I can't manage everything alone.",
                    "emotional_labor": "I need you to be more proactive about noticing what needs to be done rather than waiting for me to ask.",
                    "boundaries": "I need to set some boundaries around my time and energy. I can't be available 24/7.",
                    "partnership": "We need to work as equal partners in this. I need you to step up and take initiative."
                }
            },
            "family": {
                "mother": {
                    "need_support": "Mom, I'm having a really hard time right now and could use your support. Can we talk soon?",
                    "advice_request": "I'm struggling with [specific challenge]. I'd love to hear your perspective when you have time.",
                    "gratitude": "Thank you so much for always being there for me. Your support means the world to me.",
                    "visit_request": "I'd love to see you soon. Would you be able to visit [specific timeframe]?",
                    "gentle_boundary": "I know you mean well, but I need to handle this my own way right now."
                },
                "doctor": {
                    "concern": "I'm concerned about [specific symptom/behavior]. Could we schedule an appointment to discuss this?",
                    "appointment_request": "I'd like to schedule an appointment for [baby/myself] to discuss [specific issue].",
                    "urgent_concern": "I have some urgent concerns about [symptom/behavior]. When would be the earliest I could be seen?"
                }
            }
        }
        
    async def generate_message(self, user_id: str, user_input: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Generate communication message based on user input"""
        
        # Parse the user's request
        request_info = self._parse_communication_request(user_input)
        
        # Generate appropriate message
        message = self._generate_appropriate_message(request_info)
        
        # Provide additional guidance
        guidance = self._provide_communication_guidance(request_info)
        
        response = f"""
I'll help you craft the perfect message for {request_info['recipient']}. Here's a message you can use:

**Suggested Message:**
{message}

**Key Points:**
- It's {request_info['tone']} and direct
- Expresses your needs clearly
- Maintains the relationship
- Sets appropriate boundaries if needed

**Delivery Tips:**
{guidance}

**Remember:**
- Choose the right time to have this conversation
- Be prepared for their response
- Stay true to your needs and feelings
- It's okay to ask for what you need

Would you like me to adjust the tone or add anything specific to this message?
        """
        
        suggestions = [
            "Practice saying the message out loud",
            "Choose a good time for the conversation",
            "Be prepared for different responses",
            "Stay true to your feelings and needs",
            "Follow up if needed"
        ]
        
        return {
            "response": response,
            "suggestions": suggestions,
            "generated_message": message,
            "recipient": request_info['recipient'],
            "tone": request_info['tone']
        }
        
    async def provide_communication_advice(self, user_id: str, user_input: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Provide general communication advice"""
        
        response = """
Effective communication is essential for your wellbeing as a mother. Here's how to strengthen your communication skills:

**Key Communication Principles:**

**Be Clear and Direct**
- Use "I" statements to express your feelings
- Be specific about what you need
- Avoid expecting others to read your mind

**Choose the Right Time**
- Pick calm moments for important conversations
- Avoid discussions when anyone is hungry, angry, or tired
- Schedule regular check-ins with important people

**Listen Actively**
- Give your full attention when others speak
- Validate their feelings even if you disagree
- Ask clarifying questions to ensure understanding

**Set Healthy Boundaries**
- It's okay to say no
- Be clear about your limits
- Follow through on consequences

**Common Communication Challenges:**

**With Your Partner:**
- Schedule regular couple time
- Divide mental labor explicitly
- Appreciate each other's contributions

**With Family:**
- Set clear visitation boundaries
- Handle unsolicited advice gracefully
- Maintain your authority as parent

**With Friends:**
- Be honest about your availability
- Find other mothers for support
- Don't compare yourself to others

**Remember:** Your voice matters. Your needs are valid. You deserve to be heard and supported.
        """
        
        suggestions = [
            "Practice expressing needs clearly",
            "Schedule regular check-ins with important people",
            "Learn to say no gracefully",
            "Find your communication style",
            "Seek support when needed"
        ]
        
        return {
            "response": response,
            "suggestions": suggestions,
            "focus_area": "general_communication"
        }
        
    def _parse_communication_request(self, user_input: str) -> Dict[str, Any]:
        """Parse user input to extract communication request details"""
        
        user_input_lower = user_input.lower()
        
        # Determine recipient
        recipient = "general"
        if "partner" in user_input_lower or "husband" in user_input_lower or "spouse" in user_input_lower:
            recipient = "partner"
        elif "mother" in user_input_lower or "mom" in user_input_lower:
            recipient = "mother"
        elif "father" in user_input_lower or "dad" in user_input_lower:
            recipient = "father"
        elif "doctor" in user_input_lower or "pediatrician" in user_input_lower:
            recipient = "doctor"
        elif "friend" in user_input_lower:
            recipient = "friend"
        elif "family" in user_input_lower:
            recipient = "family"
            
        # Determine tone
        tone = "supportive"
        if "assertive" in user_input_lower or "firm" in user_input_lower or "boundary" in user_input_lower:
            tone = "assertive"
        elif "angry" in user_input_lower or "frustrated" in user_input_lower:
            tone = "confrontational"
        elif "grateful" in user_input_lower or "thank" in user_input_lower:
            tone = "appreciative"
            
        # Extract situation
        situation = self._extract_situation(user_input)
        
        return {
            "recipient": recipient,
            "tone": tone,
            "situation": situation,
            "original_input": user_input
        }
        
    def _generate_appropriate_message(self, request_info: Dict[str, Any]) -> str:
        """Generate appropriate message based on request info"""
        
        recipient = request_info['recipient']
        tone = request_info['tone']
        situation = request_info['situation']
        
        # Get template based on recipient and tone
        templates = self.message_templates.get(recipient, {}).get(tone, {})
        
        if templates:
            # Select appropriate template based on situation
            if "help" in situation.lower() or "overwhelmed" in situation.lower():
                return templates.get("need_help", self._generate_fallback_message(request_info))
            elif "appreciate" in situation.lower() or "thank" in situation.lower():
                return templates.get("appreciation", self._generate_fallback_message(request_info))
            elif "concern" in situation.lower() or "worry" in situation.lower():
                return templates.get("concern", self._generate_fallback_message(request_info))
            else:
                # Return first available template
                return list(templates.values())[0] if templates else self._generate_fallback_message(request_info)
        else:
            return self._generate_fallback_message(request_info)
            
    def _generate_fallback_message(self, request_info: Dict[str, Any]) -> str:
        """Generate fallback message when no template matches"""
        
        recipient = request_info['recipient']
        tone = request_info['tone']
        situation = request_info['situation']
        
        if tone == "supportive":
            return f"I wanted to reach out about {situation}. I could really use your support and understanding right now."
        elif tone == "assertive":
            return f"I need to talk to you about {situation}. I need you to understand my perspective and work with me on this."
        else:
            return f"I wanted to discuss {situation} with you. Can we find some time to talk?"
            
    def _provide_communication_guidance(self, request_info: Dict[str, Any]) -> str:
        """Provide guidance for delivering the message"""
        
        guidance = """
- Choose a calm, private moment for this conversation
- Practice what you want to say beforehand
- Be prepared for their reaction and stay calm
- Follow up if needed
- Remember that expressing your needs is healthy and necessary
        """
        
        if request_info['tone'] == "assertive":
            guidance += """
- Stand firm but remain respectful
- Focus on your feelings and needs, not blaming
- Be prepared to repeat your boundaries if needed
        """
        elif request_info['recipient'] == "doctor":
            guidance += """
- Be specific about symptoms and concerns
- Write down questions beforehand
- Bring someone with you for support if needed
        """
            
        return guidance.strip()
        
    def _extract_situation(self, user_input: str) -> str:
        """Extract the situation from user input"""
        
        # Look for key phrases that indicate the situation
        situation_patterns = [
            (r"need help with (.+)", r"help with \1"),
            (r"concerned about (.+)", r"concern about \1"),
            (r"want to (.+)", r"want to \1"),
            (r"need (.+)", r"need \1"),
            (r"feeling (.+)", r"feeling \1"),
            (r"overwhelmed with (.+)", r"overwhelmed with \1"),
        ]
        
        for pattern, replacement in situation_patterns:
            match = re.search(pattern, user_input.lower())
            if match:
                return match.group(1)
                
        # If no specific situation found, return a general one
        return "a personal matter"
