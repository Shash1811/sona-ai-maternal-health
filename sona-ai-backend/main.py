from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os
import sys
from dotenv import load_dotenv

# Fix encoding issue for emojis on Windows
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from sqlalchemy import text

# Ensure these are correctly imported from your database setup file
from models.database import db, pg_engine, Base
from routes import chat
from routes import auth
from routes import questionnaire
from routes import doctor
from routes import triage

# Load environment variables
load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle"""
    print("\nStarting Sona AI Backend...")

    # 1. Initialize PostgreSQL Tables
    try:
        Base.metadata.create_all(bind=pg_engine)
        with pg_engine.begin() as connection:
            connection.execute(
                text("ALTER TABLE mom_profiles ADD COLUMN IF NOT EXISTS questionnaire_data JSON")
            )
        print("PostgreSQL: Connected and tables verified/created!")
    except Exception as e:
        print(f"PostgreSQL connection failed: {e}")

    # 2. Connect to MongoDB
    try:
        await db.connect()
        print("MongoDB: Connected successfully!")
    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        raise

    # Check environment variables
    required_env_vars = ["GEMINI_API_KEY", "MONGODB_URL", "POSTGRES_DATABASE_URL"]
    missing_vars = [var for var in required_env_vars if not os.getenv(var)]

    if missing_vars:
        print(f"Warning: Missing environment variables: {missing_vars}")
        print("Some features may not work properly")

    print("All databases connected and initialized!\n")

    yield

    # Shutdown
    print("Shutting down Sona AI Backend...")
    await db.disconnect()
    print("Graceful shutdown completed")


# Create FastAPI app
app = FastAPI(
    title="Sona AI Backend",
    description="AI-powered maternal and child health support system",
    version="1.0.1",
    lifespan=lifespan
)


# Configure CORS
# If ALLOWED_ORIGINS is set, use it; otherwise match any http/https origin dynamically
ALLOWED_ORIGINS_STR = os.getenv("ALLOWED_ORIGINS", "")

if ALLOWED_ORIGINS_STR.strip():
    ALLOWED_ORIGINS = [o.strip() for o in ALLOWED_ORIGINS_STR.split(",") if o.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    # Match any http or https origin dynamically (allows credentials=True and headers=*)
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=r"https?://.*",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include routes
app.include_router(chat.router)
app.include_router(auth.router, prefix="/api")
app.include_router(questionnaire.router, prefix="/api")
app.include_router(doctor.router)
app.include_router(triage.router)

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Sona AI Backend",
        "description": "AI-powered maternal and child health support system",
        "version": "1.0.0"
    }


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        await db.client.admin.command('ping')
        mongo_status = "connected"
    except Exception:
        mongo_status = "disconnected"

    return {
        "status": "healthy" if mongo_status == "connected" else "unhealthy",
        "mongodb": mongo_status,
        "environment": {
            "gemini_configured": bool(os.getenv("GEMINI_API_KEY")),
            "mongodb_configured": bool(os.getenv("MONGODB_URL")),
            "postgres_configured": bool(os.getenv("POSTGRES_DATABASE_URL"))
        },
        "version": "1.0.0"
    }


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc),
            "type": type(exc).__name__
        }
    )


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "False").lower() == "true"

    print(f"Starting Sona AI Backend on {host}:{port}")
    print(f"API Documentation: http://{host}:{port}/docs")
    print(f"Health Check: http://{host}:{port}/health")

    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    )
