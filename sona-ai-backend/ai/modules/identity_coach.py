from typing import Dict, Any, List
import re

class IdentityCoachModule:
    """Specialized module for identity coaching and resume building"""
    
    def __init__(self):
        self.motherhood_skills = {
            "project_management": [
                "coordinating multiple schedules and activities",
                "managing household operations and logistics",
                "planning and executing family events and milestones",
                "balancing competing priorities and deadlines"
            ],
            "leadership": [
                "leading family decision-making processes",
                "mentoring and guiding children's development",
                "coordinating with schools and childcare providers",
                "advocating for family needs in various settings"
            ],
            "communication": [
                "negotiating with children and family members",
                "explaining complex concepts simply",
                "mediating conflicts and finding solutions",
                "building relationships with teachers and caregivers"
            ],
            "time_management": [
                "managing tight schedules and deadlines",
                "prioritizing tasks under pressure",
                "adapting to changing circumstances quickly",
                "maximizing productivity in limited time windows"
            ],
            "problem_solving": [
                "creative solutions to daily challenges",
                "crisis management and quick thinking",
                "resource management and budgeting",
                "adapting strategies based on outcomes"
            ],
            "emotional_intelligence": [
                "empathy and understanding others' needs",
                "patience and emotional regulation",
                "conflict resolution and mediation",
                "building and maintaining relationships"
            ],
            "multitasking": [
                "simultaneous task management",
                "switching between different roles efficiently",
                "handling interruptions while maintaining focus",
                "coordinating multiple activities simultaneously"
            ],
            "budget_management": [
                "household financial planning",
                "cost optimization and resource allocation",
                "long-term financial goal setting",
                "managing expenses within constraints"
            ]
        }
        
        self.professional_translations = {
            "coordinating family schedules": "Project Coordination",
            "managing household budget": "Financial Management",
            "resolving family conflicts": "Conflict Resolution",
            "teaching children new skills": "Training and Development",
            "organizing family events": "Event Planning",
            "advocating for children's needs": "Stakeholder Management",
            "managing daily routines": "Operations Management",
            "balancing work and family": "Work-Life Balance Integration"
        }
        
    async def process_identity_request(self, user_id: str, user_input: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Process identity coaching request"""
        
        user_input_lower = user_input.lower()
        
        if "resume" in user_input_lower or "cv" in user_input_lower:
            return await self._help_with_resume(user_id, user_input, context)
        elif "skills" in user_input_lower or "experience" in user_input_lower:
            return await self._identify_skills(user_id, user_input, context)
        elif "career" in user_input_lower or "job" in user_input_lower:
            return await self._career_guidance(user_id, user_input, context)
        elif "interview" in user_input_lower:
            return await self._interview_preparation(user_id, user_input, context)
        else:
            return await self._general_identity_coaching(user_id, user_input, context)
            
    async def _help_with_resume(self, user_id: str, user_input: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Provide resume building assistance"""
        
        response = """
Let's transform your motherhood experience into a powerful resume! Your journey as a mother has given you incredible professional skills.

**Step 1: Identify Your Transferable Skills**

Here are the key professional skills you've developed:

**Project Management**
- Coordinating complex family schedules and logistics
- Managing multiple concurrent projects (children's activities, household operations)
- Planning and executing family events and milestones

**Leadership & Management**
- Leading family decision-making processes
- Mentoring and guiding children's development
- Coordinating with external stakeholders (schools, healthcare providers)

**Communication & Negotiation**
- Mediating conflicts and finding win-win solutions
- Building relationships across diverse groups
- Advocating effectively for family needs

**Time Management & Organization**
- Excelling in high-pressure, deadline-driven environments
- Prioritizing competing demands efficiently
- Adapting quickly to changing circumstances

**Problem Solving & Crisis Management**
- Creative problem-solving under pressure
- Resource optimization and budget management
- Quick decision-making in critical situations

**Step 2: Professional Language Translation**

Instead of saying: "Managed household with 3 children"
Say: "Managed complex household operations serving 4 stakeholders, coordinating schedules, logistics, and resource allocation"

Instead of saying: "Resolved family conflicts"
Say: "Mediated conflicts and implemented solutions that improved family dynamics and communication"

Would you like me to help you craft specific bullet points for your resume? Tell me about your daily routines and challenges!
        """
        
        suggestions = [
            "List your daily motherhood responsibilities",
            "Think about challenging situations you've handled",
            "Consider volunteer work or community involvement",
            "Reflect on skills you've developed over time",
            "Research companies with family-friendly policies"
        ]
        
        return {
            "response": response,
            "suggestions": suggestions,
            "focus_area": "resume_building"
        }
        
    async def _identify_skills(self, user_id: str, user_input: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Help identify and articulate professional skills"""
        
        # Extract skills from user input
        identified_skills = self._extract_skills_from_input(user_input)
        
        response = f"""
Based on what you've shared, I can see you've developed these valuable professional skills:

**Your Identified Skills:**
{self._format_identified_skills(identified_skills)}

**Professional Value:**
These skills are highly valued in the workplace because they demonstrate:
- Adaptability and resilience
- Complex problem-solving abilities
- Strong interpersonal skills
- Leadership potential
- Emotional intelligence

**Industries Where These Skills Shine:**
- Project Management
- Human Resources
- Education and Training
- Healthcare Administration
- Customer Success
- Operations Management
- Non-profit Management

**Next Steps:**
1. Quantify your achievements when possible
2. Gather specific examples for each skill
3. Practice articulating these skills professionally
4. Update your LinkedIn profile with these skills

What specific industry or role interests you most? I can help you tailor your skills presentation for that field.
        """
        
        suggestions = [
            "Create a skill inventory with specific examples",
            "Practice explaining your skills in professional terms",
            "Research job descriptions in your target industry",
            "Network with other working mothers",
            "Consider professional development opportunities"
        ]
        
        return {
            "response": response,
            "suggestions": suggestions,
            "identified_skills": identified_skills,
            "focus_area": "skill_identification"
        }
        
    async def _career_guidance(self, user_id: str, user_input: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Provide career guidance for returning mothers"""
        
        response = """
Returning to the workforce after motherhood is a journey that many successful professionals have taken. Your experience as a mother has actually made you a stronger candidate in many ways.

**Career Paths That Value Motherhood Skills:**

**Remote/Flexible Roles**
- Project Management
- Virtual Assistant
- Content Creation
- Online Teaching/Tutoring
- Social Media Management

**People-Focused Roles**
- Human Resources
- Customer Success
- Sales and Account Management
- Non-profit Program Management
- Education and Training

**Operations and Logistics**
- Office Management
- Event Planning
- Supply Chain Coordination
- Facilities Management
- Program Coordination

**Strategy and Planning**
- Business Analysis
- Operations Research
- Process Improvement
- Quality Assurance
- Risk Management

**Re-entering Strategies:**
1. **Start with Contract/Part-time Work** - Build confidence and recent experience
2. **Leverage Your Network** - Connect with other mothers who've made the transition
3. **Highlight Your Skills** - Frame motherhood experience professionally
4. **Consider Education** - Certifications can bridge gaps
5. **Be Confident** - Your skills are valuable and in-demand

**Companies Known for Mother-Friendly Policies:**
- Patagonia
- Salesforce
- Deloitte
- Ernst & Young
- Google
- Microsoft

What type of work environment appeals to you most? I can help you explore specific opportunities.
        """
        
        suggestions = [
            "Research companies with family-friendly policies",
            "Update your professional network on LinkedIn",
            "Consider part-time or contract work first",
            "Look into remote work opportunities",
            "Connect with other working mothers in your field"
        ]
        
        return {
            "response": response,
            "suggestions": suggestions,
            "focus_area": "career_guidance"
        }
        
    async def _interview_preparation(self, user_id: str, user_input: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Provide interview preparation for returning mothers"""
        
        response = """
Interviewing after motherhood requires confidence and the right framing. Here's how to prepare:

**Common Interview Questions & Motherhood-Friendly Answers:**

**"Tell me about your career gap"**
→ "I took a planned career break to focus on my growing family. During this time, I developed strong project management, leadership, and problem-solving skills while managing complex household operations. I'm excited to bring these enhanced skills back to a professional setting."

**"How do you handle pressure?"**
→ "Motherhood has prepared me exceptionally well for high-pressure situations. I regularly manage multiple competing priorities, make quick decisions under stress, and maintain composure during challenging situations."

**"How do you manage your time?"**
→ "My experience managing a household has made me exceptionally skilled at time management, prioritization, and meeting deadlines. I've mastered the art of maximizing productivity in limited time windows."

**"Why should we hire you?"**
→ "My experience as a mother has enhanced my professional skills in ways that traditional career paths don't always provide. I bring emotional intelligence, crisis management, and a proven ability to handle complex, dynamic situations."

**Addressing Motherhood in Interviews:**
- Frame it as a strength, not a weakness
- Connect motherhood skills to job requirements
- Be confident about your capabilities
- Show enthusiasm for returning to work
- Demonstrate that you're up-to-date with industry trends

**Preparation Tips:**
- Practice your professional story
- Research the company thoroughly
- Prepare questions about work-life balance
- Dress professionally and confidently
- Follow up with thank-you notes

Remember: Your motherhood experience has made you a stronger, more capable professional!
        """
        
        suggestions = [
            "Practice your elevator pitch",
            "Research the company's family policies",
            "Prepare examples of skills in action",
            "Practice with a friend or mentor",
            "Update your professional wardrobe if needed"
        ]
        
        return {
            "response": response,
            "suggestions": suggestions,
            "focus_area": "interview_preparation"
        }
        
    async def _general_identity_coaching(self, user_id: str, user_input: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Provide general identity coaching support"""
        
        response = """
Your identity as a mother doesn't replace your professional identity - it enhances it. The journey of motherhood transforms women into stronger, more capable professionals.

**The Motherhood Professional Advantage:**

**Enhanced Emotional Intelligence**
- Better understanding of others' needs and motivations
- Improved conflict resolution skills
- Greater empathy and patience

**Superior Time Management**
- Mastery of prioritization under pressure
- Ability to handle multiple deadlines simultaneously
- Efficient resource allocation

**Leadership Development**
- Natural mentoring and guidance abilities
- Decision-making under uncertainty
- Team coordination and motivation

**Resilience and Adaptability**
- Experience handling unexpected challenges
- Quick problem-solving under pressure
- Ability to pivot strategies when needed

**Reclaiming Your Professional Identity:**
1. **Acknowledge Your Growth** - You're not the same person you were before motherhood, you're better
2. **Connect Your Experiences** - Link motherhood skills to professional requirements
3. **Build Your Confidence** - Practice articulating your value
4. **Find Your Community** - Connect with other working mothers
5. **Set Boundaries** - Define what works for your family and career

**Remember:**
- You don't have to choose between being a mother and being a professional
- Your experiences have made you more valuable, not less
- The right employer will recognize and value your enhanced capabilities
- You deserve to pursue your professional ambitions

What aspect of your professional identity would you like to explore further?
        """
        
        suggestions = [
            "Journal about your professional growth",
            "Connect with other working mothers",
            "Research companies that value working parents",
            "Consider professional development opportunities",
            "Practice self-compassion during this transition"
        ]
        
        return {
            "response": response,
            "suggestions": suggestions,
            "focus_area": "identity_coaching"
        }
        
    def _extract_skills_from_input(self, user_input: str) -> List[str]:
        """Extract professional skills from user input"""
        identified_skills = []
        user_input_lower = user_input.lower()
        
        for skill_category, skills in self.motherhood_skills.items():
            for skill in skills:
                # Check if any keywords from the skill description appear in user input
                skill_keywords = skill.split()[:3]  # Take first 3 words as keywords
                if any(keyword in user_input_lower for keyword in skill_keywords):
                    identified_skills.append(skill_category)
                    break
                    
        return list(set(identified_skills))  # Remove duplicates
        
    def _format_identified_skills(self, skills: List[str]) -> str:
        """Format identified skills for display"""
        if not skills:
            return "I'd love to help you identify your skills! Tell me about your daily routines and challenges as a mother."
            
        formatted = ""
        for skill in skills:
            skill_examples = self.motherhood_skills.get(skill, [])[:2]  # Show first 2 examples
            formatted += f"**{skill.title().replace('_', ' ')}**\n"
            for example in skill_examples:
                formatted += f"- {example}\n"
            formatted += "\n"
            
        return formatted
