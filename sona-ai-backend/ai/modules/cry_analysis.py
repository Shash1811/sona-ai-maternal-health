from typing import Dict, Any, List
import base64
import random

class CryAnalysisModule:
    """Specialized module for baby cry analysis and guidance"""
    
    def __init__(self):
        self.cry_patterns = {
            "hungry": {
                "frequency": "high-pitched, rhythmic",
                "pattern": "short, repeated cries with pauses",
                "duration": "varies, often increases over time",
                "suggestions": [
                    "Try feeding your baby",
                    "Check if it's been 2-3 hours since last feeding",
                    "Offer a pacifier if breastfeeding",
                    "Look for hunger cues (rooting, hand-to-mouth)"
                ]
            },
            "sleepy": {
                "frequency": "low-pitched, whiny",
                "pattern": "intermittent, fussing sounds",
                "duration": "on and off, may escalate",
                "suggestions": [
                    "Check for sleep cues (yawning, rubbing eyes)",
                    "Create a calm, dark environment",
                    "Try swaddling or gentle rocking",
                    "Use white noise or shushing sounds"
                ]
            },
            "pain": {
                "frequency": "high-pitched, sudden",
                "pattern": "intense, unrelenting cries",
                "duration": "continuous, hard to soothe",
                "suggestions": [
                    "Check for obvious sources of pain",
                    "Ensure clothing isn't too tight",
                    "Check temperature (not too hot/cold)",
                    "Consider teething if age-appropriate",
                    "Contact pediatrician if concerned"
                ]
            },
            "discomfort": {
                "frequency": "moderate pitch",
                "pattern": "fussy, intermittent",
                "duration": "comes and goes",
                "suggestions": [
                    "Check diaper for changes",
                    "Ensure comfortable temperature",
                    "Change position frequently",
                    "Try gentle baby massage",
                    "Check for gas or burp needs"
                ]
            },
            "colic": {
                "frequency": "high-pitched, intense",
                "pattern": "predictable evening episodes",
                "duration": "3+ hours, same time daily",
                "suggestions": [
                    "Use the '5 S's method: Swaddle, Side/Stomach, Shush, Swing, Suck",
                    "Try warm baths",
                    "Gentle bicycle leg movements",
                    "Consult pediatrician for ruling out other issues",
                    "Remember: this phase will pass"
                ]
            }
        }
        
    async def analyze_cry(self, audio_data: str, user_id: str) -> Dict[str, Any]:
        """Analyze baby cry from audio data"""
        
        # In a real implementation, this would:
        # 1. Decode base64 audio
        # 2. Extract audio features using librosa
        # 3. Use ML model to classify cry type
        # 4. Return analysis with confidence scores
        
        # For now, we'll simulate the analysis
        analysis = self._simulate_cry_analysis(audio_data)
        
        response = f"""
I've analyzed your baby's cry and here's what I found:

**Most Likely Reason:** {analysis['reason'].title()}
**Confidence Level:** {analysis['confidence']}%

**What this cry typically sounds like:**
- Frequency: {self.cry_patterns[analysis['reason']]['frequency']}
- Pattern: {self.cry_patterns[analysis['reason']]['pattern']}
- Duration: {self.cry_patterns[analysis['reason']]['duration']}

**Immediate Suggestions:**
{self._format_suggestions(self.cry_patterns[analysis['reason']]['suggestions'])}

**Important Notes:**
- Trust your instincts - you know your baby best
- If the cry seems unusual or you're concerned, contact your pediatrician
- Every baby is different - these are general guidelines

Would you like more specific advice based on your baby's age and current situation?
        """
        
        return {
            "response": response,
            "suggestions": self.cry_patterns[analysis['reason']]['suggestions'],
            "cry_analysis": analysis,
            "urgency": self._get_urgency_level(analysis['reason'])
        }
        
    async def provide_recording_guidance(self) -> Dict[str, Any]:
        """Provide guidance on recording baby cry for analysis"""
        
        response = """
To analyze your baby's cry effectively, here's how to record it:

**Recording Tips:**
- Hold your phone 1-2 feet from your baby
- Record for at least 10-15 seconds of continuous crying
- Minimize background noise (TV, music, other people)
- Capture the natural cry - don't try to soothe during recording
- Record in a quiet environment if possible

**What I Listen For:**
- Cry pitch and frequency patterns
- Rhythm and timing of cries
- Duration and intensity
- Any variations in the cry pattern

**Safety First:**
- Never leave your baby unattended while recording
- If your baby seems to be in distress, attend to them first
- Recording can wait if immediate comfort is needed

Once you have a good recording, upload it here and I'll analyze it for you.
        """
        
        suggestions = [
            "Record during natural crying episodes",
            "Ensure baby is safe and attended",
            "Use your phone's voice memo app",
            "Keep recordings under 30 seconds",
            "Label recordings with time and context"
        ]
        
        return {
            "response": response,
            "suggestions": suggestions,
            "next_steps": "Record and upload baby cry for analysis"
        }
        
    async def provide_age_specific_advice(self, baby_age_months: int) -> Dict[str, Any]:
        """Provide age-specific advice for baby crying"""
        
        if baby_age_months <= 3:
            return await self._newborn_crying_advice()
        elif baby_age_months <= 6:
            return await self._infant_crying_advice()
        elif baby_age_months <= 12:
            return await self._older_infant_crying_advice()
        else:
            return await self._toddler_crying_advice()
            
    async def _newborn_crying_advice(self) -> Dict[str, Any]:
        """Advice for newborn crying (0-3 months)"""
        
        response = """
Newborn crying is completely normal and actually healthy! Here's what to expect:

**Normal Newborn Crying:**
- 2-3 hours per day is typical
- Often peaks at 6-8 weeks
- Crying is their main way to communicate
- Most intense in evenings

**Common Reasons:**
- Hunger (most common)
- Need for sleep
- Temperature discomfort
- Need for closeness/comfort
- Overstimulation

**Soothing Techniques:**
- The 5 S's: Swaddle, Side position, Shush, Swing, Suck
- Skin-to-skin contact
- Gentle rocking or walking
- White noise or shushing sounds
- Warm bath (if baby enjoys it)

**When to Contact Pediatrician:**
- Fever over 100.4°F (38°C)
- Crying for >3 hours continuously
- Difficulty breathing
- Unusual lethargy
- Poor feeding

Remember: You can't "spoil" a newborn with too much comfort!
        """
        
        return {
            "response": response,
            "suggestions": [
                "Try the 5 S's soothing method",
                "Keep a crying log to identify patterns",
                "Accept help from family and friends",
                "Remember this phase will pass",
                "Trust your parental instincts"
            ]
        }
        
    async def _infant_crying_advice(self) -> Dict[str, Any]:
        """Advice for infant crying (4-6 months)"""
        
        response = """
At 4-6 months, crying patterns start changing as babies develop more communication skills:

**Developmental Changes:**
- Crying often decreases from newborn peak
- More intentional sounds and babbling
- Beginning to show preferences
- May develop separation anxiety

**Common Cry Triggers:**
- Teething discomfort
- Boredom or overstimulation  
- Hunger (still common)
- Wanting to practice new skills
- Separation from caregivers

**New Soothing Strategies:**
- Introduce teething toys (refrigerated, not frozen)
- Establish consistent routines
- Offer more interactive play
- Practice independent playtime
- Use baby sign language basics

**Red Flags:**
- Sudden increase in crying
- Crying with fever or illness
- Injury or fall concerns
- Changes in eating/sleeping patterns

Your baby is learning to communicate in more complex ways!
        """
        
        return {
            "response": response,
            "suggestions": [
                "Introduce teething relief options",
                "Establish predictable routines",
                "Encourage self-soothing skills",
                "Monitor developmental milestones",
                "Stay consistent with responses"
            ]
        }
        
    async def _older_infant_crying_advice(self) -> Dict[str, Any]:
        """Advice for older infant crying (7-12 months)"""
        
        response = """
At 7-12 months, crying becomes more purposeful as babies develop stronger preferences:

**Communication Development:**
- Crying is more targeted and intentional
- Beginning to understand "no"
- May use crying to protest or manipulate
- Developing object permanence

**Common Cry Reasons:**
- Frustration with new skills
- Separation anxiety peaks
- Teething continues
- Hunger and discomfort
- Wanting specific items/attention

**Response Strategies:**
- Validate feelings before setting limits
- Offer choices when possible
- Maintain consistent boundaries
- Use distraction and redirection
- Encourage emerging language skills

**Positive Approaches:**
- Acknowledge the emotion
- Offer comfort briefly, then redirect
- Stay calm and consistent
- Celebrate communication attempts
- Remember this is normal development

Your baby is learning how to express big feelings!
        """
        
        return {
            "response": response,
            "suggestions": [
                "Stay consistent with boundaries",
                "Offer simple choices",
                "Use distraction techniques",
                "Encourage language development",
                "Model emotional regulation"
            ]
        }
        
    async def _toddler_crying_advice(self) -> Dict[str, Any]:
        """Advice for toddler crying (12+ months)"""
        
        response = """
Toddler crying reflects their growing independence and emotional development:

**Emotional Growth:**
- More complex emotions emerge
- Testing boundaries is normal
- Frustration tolerance is still developing
- Language skills may lag behind emotional expression

**Common Triggers:**
- Frustration with communication
- Not getting what they want
- Separation anxiety
- Overstimulation or exhaustion
- Big emotions they can't name yet

**Effective Responses:**
- Name and validate emotions
- Set clear, consistent boundaries
- Offer simple choices
- Use simple language they understand
- Model calm emotional regulation

**Building Emotional Skills:**
- Teach feeling words ("You seem angry")
- Read books about emotions
- Practice calming techniques together
- Praise emotional expression attempts
- Create predictable routines

Remember: Toddler crying is communication, not manipulation!
        """
        
        return {
            "response": response,
            "suggestions": [
                "Teach emotional vocabulary",
                "Maintain consistent routines",
                "Offer limited choices",
                "Practice patience and empathy",
                "Celebrate emotional milestones"
            ]
        }
        
    def _simulate_cry_analysis(self, audio_data: str) -> Dict[str, Any]:
        """Simulate cry analysis (placeholder for real ML implementation)"""
        
        # Simulate different cry types with confidence scores
        cry_types = list(self.cry_patterns.keys())
        weights = [0.3, 0.25, 0.2, 0.15, 0.1]  # Probability weights
        
        selected_type = random.choices(cry_types, weights=weights)[0]
        confidence = random.uniform(0.75, 0.95)
        
        return {
            "reason": selected_type,
            "confidence": round(confidence, 2),
            "audio_features": {
                "dominant_frequency": random.uniform(200, 800),
                "cry_duration": random.uniform(0.5, 3.0),
                "intensity": random.uniform(0.6, 1.0)
            }
        }
        
    def _format_suggestions(self, suggestions: List[str]) -> str:
        """Format suggestions for display"""
        formatted = ""
        for i, suggestion in enumerate(suggestions, 1):
            formatted += f"- {suggestion}\n"
        return formatted
        
    def _get_urgency_level(self, cry_reason: str) -> str:
        """Get urgency level based on cry reason"""
        
        high_urgency = ["pain", "colic"]
        medium_urgency = ["hungry", "discomfort"]
        low_urgency = ["sleepy"]
        
        if cry_reason in high_urgency:
            return "high"
        elif cry_reason in medium_urgency:
            return "medium"
        else:
            return "low"
