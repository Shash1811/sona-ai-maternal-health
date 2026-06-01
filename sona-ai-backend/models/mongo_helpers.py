from fastapi import Depends
from models.database import db as mongodb_db

async def get_mongodb():
    """Dependency to get MongoDB database instance"""
    return mongodb_db
