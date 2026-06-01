import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime
from typing import Dict, Any, List, Optional
from bson import ObjectId
from dotenv import load_dotenv

# --- Added SQLAlchemy Imports for PostgreSQL ---
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Load environment variables
load_dotenv()

# MongoDB Configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "sona_ai")

# PostgreSQL Configuration
POSTGRES_DATABASE_URL = os.getenv("POSTGRES_DATABASE_URL", "postgresql://postgres:%20@localhost:5432/maternal_app_db")

# ==========================================
# 1. POSTGRESQL SETUP (For Auth & Relational Data)
# ==========================================
# Create the SQLAlchemy engine that main.py is looking for
pg_engine = create_engine(POSTGRES_DATABASE_URL)

# Create a session maker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=pg_engine)

# Base class for your Postgres models (tables)
Base = declarative_base()

# Dependency helper for your routes
def get_pg_db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

# ==========================================
# 2. MONGODB SETUP (For Questionnaires & Chat)
# ==========================================
class Database:
    def __init__(self):
        self.client: AsyncIOMotorClient = None
        self.db = None
        self.mongo_client = None
        self.mongo_db = None

    async def connect(self):
        """Connect to both MongoDB and PostgreSQL"""
        try:
            # MongoDB Connection
            self.client = AsyncIOMotorClient(MONGODB_URL, server_api=ServerApi('1'))
            self.db = self.client[DATABASE_NAME]
            
            # MongoDB Sync Client for some operations
            self.mongo_client = MongoClient(MONGODB_URL, server_api=ServerApi('1'))
            self.mongo_db = self.mongo_client[DATABASE_NAME]
            
            print(f"✅ Connected to MongoDB: {DATABASE_NAME}")
            return True
        except Exception as e:
            print(f"❌ MongoDB connection failed: {e}")
            return False

    async def disconnect(self):
        """Disconnect from both databases"""
        if self.client:
            self.client.close()
        if self.mongo_client:
            self.mongo_client.close()
        print("🔌 Disconnected from databases")

    async def create_indexes(self):
        """Create database indexes for performance"""
        # Chat history indexes
        await self.db.chat_history.create_index([("user_id", 1), ("timestamp", -1)])
        await self.db.chat_history.create_index([("session_id", 1)])
        
        # User profiles indexes
        await self.db.user_profiles.create_index([("user_id", 1)], unique=True)
        
        # Mood logs indexes
        await self.db.mood_logs.create_index([("user_id", 1), ("timestamp", -1)])
        
        # Maternal questionnaire indexes
        await self.db.maternal_info.create_index([("user_id", 1)], unique=True)
        await self.db.maternal_info.create_index([("completed_at", -1)])
        
        print("📊 Database indexes created successfully")

    # Chat History Operations
    async def save_message(self, user_id: str, session_id: str, message: Dict[str, Any]):
        """Save a chat message"""
        message_data = {
            "user_id": user_id,
            "session_id": session_id,
            "timestamp": datetime.utcnow(),
            **message
        }
        await self.db.chat_history.insert_one(message_data)

    async def get_chat_history(self, user_id: str, limit: int = 50):
        """Get chat history for a user"""
        cursor = self.db.chat_history.find(
            {"user_id": user_id}
        ).sort("timestamp", -1).limit(limit)
        return await cursor.to_list(length=limit)

    async def save_user_profile(self, user_id: str, profile_data: Dict[str, Any]):
        """Save or update user profile"""
        profile_data_with_timestamp = {
            "user_id": user_id,
            "updated_at": datetime.utcnow(),
            **profile_data
        }
        await self.db.user_profiles.update_one(
            {"user_id": user_id},
            {"$set": profile_data_with_timestamp},
            upsert=True
        )

    async def get_user_profile(self, user_id: str):
        """Get user profile data"""
        return await self.db.user_profiles.find_one({"user_id": user_id})

    async def save_mood_log(self, user_id: str, mood_data: Dict[str, Any]):
        """Save mood log entry"""
        mood_entry = {
            "user_id": user_id,
            "timestamp": datetime.utcnow(),
            **mood_data
        }
        await self.db.mood_logs.insert_one(mood_entry)

    async def get_mood_history(self, user_id: str, days: int = 30):
        """Get mood history for the last N days"""
        from datetime import timedelta
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        cursor = self.db.mood_logs.find(
            {"user_id": user_id, "timestamp": {"$gte": cutoff_date}}
        ).sort("timestamp", -1)
        
        return await cursor.to_list(length=100)

    # User Session Operations
    async def get_user_sessions(self, user_id: str):
        """Get all sessions for a user"""
        sessions = await self.db.chat_history.distinct("session_id", {"user_id": user_id})
        return sessions

    # Maternal Questionnaire Operations
    async def save_maternal_questionnaire(self, user_id: str, questionnaire_data: Dict[str, Any]):
        """Save or update maternal questionnaire data"""
        questionnaire_data_with_timestamp = {
            "user_id": user_id,
            **questionnaire_data,
            "updated_at": datetime.utcnow()
        }
        
        await self.db.maternal_info.update_one(
            {"user_id": user_id},
            {"$set": questionnaire_data_with_timestamp},
            upsert=True
        )
    
    async def get_maternal_questionnaire(self, user_id: str):
        """Get maternal questionnaire data for a user"""
        return await self.db.maternal_info.find_one({"user_id": user_id})
    
    async def has_completed_questionnaire(self, user_id: str) -> bool:
        """Check if user has completed the questionnaire"""
        questionnaire = await self.get_maternal_questionnaire(user_id)
        return questionnaire is not None
    
    async def update_maternal_health_info(self, user_id: str, update_data: Dict[str, Any]):
        """Update specific fields in maternal health info"""
        update_data_with_timestamp = {
            **update_data,
            "updated_at": datetime.utcnow()
        }
        
        await self.db.maternal_info.update_one(
            {"user_id": user_id},
            {"$set": update_data_with_timestamp}
        )

# Global database instance
db = Database()