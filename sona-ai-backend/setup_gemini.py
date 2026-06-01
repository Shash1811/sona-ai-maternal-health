#!/usr/bin/env python3
"""
Setup script for Gemini API integration
"""

import os
import sys
from pathlib import Path

def check_gemini_setup():
    """Check if Gemini API is properly configured"""
    
    print("🔍 Checking Gemini API setup...")
    
    # Check if google-genai is installed
    try:
        import google.genai as genai
        print("✅ google-genai package is installed")
    except ImportError:
        print("❌ google-genai package not found")
        print("Install with: pip install google-genai==0.3.0")
        return False
    
    # Check API key
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ GEMINI_API_KEY not found in environment variables")
        return False
    
    print("✅ GEMINI_API_KEY found")
    
    # Test API connection
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content("Hello")
        print("✅ Gemini API connection successful")
        return True
    except Exception as e:
        print(f"❌ Gemini API connection failed: {e}")
        return False

def install_dependencies():
    """Install required dependencies"""
    print("📦 Installing dependencies...")
    
    deps = [
        "google-genai==0.3.0",
        "fastapi==0.104.1",
        "uvicorn[standard]==0.24.0",
        "pydantic==2.5.0",
        "python-dotenv==1.0.0",
        "pymongo==4.6.0",
        "motor==3.3.2",
        "python-multipart==0.0.6",
        "Pillow==10.1.0",
        "numpy==1.24.3",
        "scikit-learn==1.3.2",
        "textblob==0.17.1",
        "httpx==0.25.2",
        "python-jose[cryptography]==3.3.0",
        "passlib[bcrypt]==1.7.4",
        "python-dateutil==2.8.2"
    ]
    
    for dep in deps:
        print(f"Installing {dep}...")
        os.system(f"pip install {dep}")
    
    print("✅ All dependencies installed")

def create_env_file():
    """Create .env file with proper format"""
    
    env_content = """# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# MongoDB
MONGODB_URL=mongodb://127.0.0.1:27017/sona_ai

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# FastAPI Settings
DEBUG=True
HOST=0.0.0.0
PORT=8000

# CORS Settings
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
"""
    
    env_path = Path(".env")
    if not env_path.exists():
        with open(env_path, "w") as f:
            f.write(env_content)
        print("✅ Created .env file")
        print("📝 Please edit .env and add your Gemini API key")
    else:
        print("ℹ️  .env file already exists")

def main():
    """Main setup function"""
    
    print("🚀 Sona AI Gemini Setup")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not Path("main.py").exists():
        print("❌ Please run this script from the sona-ai-backend directory")
        sys.exit(1)
    
    # Install dependencies
    install_dependencies()
    
    # Create .env file
    create_env_file()
    
    # Check setup
    print("\n🔍 Final setup check:")
    if check_gemini_setup():
        print("🎉 Gemini API is ready to use!")
        print("\n📋 Next steps:")
        print("1. Start MongoDB: mongod")
        print("2. Run the backend: python main.py")
        print("3. Start the frontend: cd ../frontend && npm run dev")
    else:
        print("\n❌ Setup incomplete. Please check the errors above.")
        print("\n📋 To get a Gemini API key:")
        print("1. Go to: https://makersuite.google.com/app/apikey")
        print("2. Create a new API key")
        print("3. Add it to your .env file: GEMINI_API_KEY=your_key_here")

if __name__ == "__main__":
    main()
