#!/usr/bin/env python3
"""
Test script for Gemini API integration
"""

import os
import sys
from pathlib import Path

# Add backend root directory to path
sys.path.append(str(Path(__file__).parent.parent))

try:
    import google.generativeai as genai
    from dotenv import load_dotenv
    
    # Load environment variables
    load_dotenv()
    
    print("🧪 Testing Gemini API Integration")
    print("=" * 40)
    
    # Check API key
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ GEMINI_API_KEY not found in environment variables")
        print("Please add your Gemini API key to the .env file")
        sys.exit(1)
    
    print(f"✅ API key found: {api_key[:10]}...")
    
    # Configure Gemini
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-pro")
    
    # Test 1: Basic generation
    print("\n📝 Test 1: Basic text generation")
    try:
        response = model.generate_content("Hello, how are you?")
        print(f"✅ Response: {response.text[:100]}...")
    except Exception as e:
        print(f"❌ Basic generation failed: {e}")
        sys.exit(1)
    
    # Test 2: Maternal health context
    print("\n📝 Test 2: Maternal health context")
    try:
        prompt = """
        You are Sona, a caring maternal health assistant.
        A user says: "I'm feeling overwhelmed with my newborn"
        Respond with empathy and helpful advice.
        """
        response = model.generate_content(prompt)
        print(f"✅ Response: {response.text[:200]}...")
    except Exception as e:
        print(f"❌ Context generation failed: {e}")
        sys.exit(1)
    
    # Test 3: Panic response
    print("\n📝 Test 3: Panic response")
    try:
        prompt = """
        You are Sona, a maternal health assistant.
        A user says: "I'm having a panic attack"
        Respond with immediate calming support and breathing exercises.
        Keep it short and calming.
        """
        response = model.generate_content(prompt)
        print(f"✅ Response: {response.text[:200]}...")
    except Exception as e:
        print(f"❌ Panic response failed: {e}")
        sys.exit(1)
    
    # Test 4: Identity coaching
    print("\n📝 Test 4: Identity coaching")
    try:
        prompt = """
        You are Sona, an identity coach for mothers.
        A user says: "How can I explain my motherhood skills on a resume?"
        Respond with professional skill translation.
        """
        response = model.generate_content(prompt)
        print(f"✅ Response: {response.text[:200]}...")
    except Exception as e:
        print(f"❌ Identity coaching failed: {e}")
        sys.exit(1)
    
    print("\n🎉 All tests passed!")
    print("✅ Gemini API is working correctly")
    print("✅ All AI modules should function properly")
    
    # Test LLM integration module
    print("\n📝 Test 5: LLM Integration Module")
    try:
        from ai.llm_integration import LLMIntegration
        from models.schemas import ChatMode, EmotionType
        
        llm = LLMIntegration()
        
        # Test normal response
        result = llm.generate_response(
            user_message="Hi, how are you?",
            mode=ChatMode.HEALTH,
            emotion=None
        )
        print(f"✅ LLM Integration response: {result['response'][:100]}...")
        
        # Test panic response
        result = llm.generate_response(
            user_message="I'm having a panic attack",
            mode=ChatMode.HEALTH,
            emotion=EmotionType.PANIC
        )
        print(f"✅ Panic response: {result['response'][:100]}...")
        
    except Exception as e:
        print(f"❌ LLM Integration test failed: {e}")
        sys.exit(1)
    
    print("\n🎉 Complete integration test passed!")
    print("🚀 Sona AI is ready to use with Gemini API")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Please install dependencies: pip install -r requirements.txt")
    sys.exit(1)
except Exception as e:
    print(f"❌ Unexpected error: {e}")
    sys.exit(1)
