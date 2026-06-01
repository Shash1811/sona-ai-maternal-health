import os
from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# PostgreSQL Configuration
POSTGRES_DATABASE_URL = os.getenv("POSTGRES_DATABASE_URL", "postgresql://user:password@localhost/sona_auth")

# Create SQLAlchemy engine
engine = create_engine(POSTGRES_DATABASE_URL)

# Create session maker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create declarative base
Base = declarative_base()

# Dependency to get database session
def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Function to create tables
def create_tables():
    """Create all tables in the database"""
    Base.metadata.create_all(bind=engine)
    print("📊 PostgreSQL tables created successfully")

# Function to test connection
def test_connection():
    """Test PostgreSQL connection"""
    try:
        with engine.connect() as connection:
            result = connection.execute("SELECT 1")
            print("✅ PostgreSQL connection test successful")
            return True
    except Exception as e:
        print(f"❌ PostgreSQL connection test failed: {e}")
        return False
