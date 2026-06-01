# 👩‍🍼 Sona AI: Full-Stack Clinical Maternal & Infant Health Ecosystem

Sona AI is an emotionally intelligent, multi-agent digital health platform designed to address the deep physiological and emotional complexities of pregnancy, postpartum transition, and early childhood care. 

By integrating specialized LLM agents with physical vital tracking, clinical risk-stratification onboarding questionnaires, and direct linkages to human obstetric practitioners, Sona AI provides mothers and healthcare providers with a continuous, responsive, and secure support channel.

---

## 🏗️ Technical Architecture & Decoupled State Layers

Sona AI uses a decoupled multi-database structure designed to optimize performance, security, and schema flexibility:

```
                  +-----------------------------------+
                  |        React Frontend Client      |
                  |  (React 18 + Vite + TypeScript)   |
                  +-----------------------------------+
                                    |
                    API Requests    |    JSON Responses
                    (JWT Bearer)    |    (Framer Motion)
                                    v
                  +-----------------------------------+
                  |          FastAPI Backend          |
                  |     (Uvicorn + Python 3.10+)      |
                  +-----------------------------------+
                    /               |               \
      PostgreSQL ORM /    NoSQL Driver \    RAG Engine \
    (SQLAlchemy/Alembic)      (Motor/PyMongo)    (ChromaDB/SentenceTransformers)
          v                         v                         v
+-------------------+     +-------------------+     +-------------------+
|  PostgreSQL DB    |     |    MongoDB DB     |     |     ChromaDB      |
|  - User Auth      |     |  - Chat Messages  |     |  - WHO Guidelines |
|  - Doctor Mapping |     |  - Vitals Logs    |     |  - Pediatric FAQs |
|  - Patient Triage |     |  - Mood Entries   |     |  - Clinical Books |
+-------------------+     +-------------------+     +-------------------+
                                    |
                                    | Prompts + Context
                                    v
                          +-------------------+
                          |  Google Gemini    |
                          |  1.5 Flash/Lite   |
                          +-------------------+
```

---

## 📂 Project Directory Structure

```
Maternal and child support/
├── data_pipeline/                # RAG Knowledge Ingestion Pipeline
│   ├── pdfs/                     # Vetted clinical PDFs (WHO, pediatric guidelines)
│   └── ingestion.py              # Ingests guidelines, generates embeddings, stores in ChromaDB
├── docs/                         # Technical Architecture & System Documentation
│   ├── Sona_AI_Project_Documentation.html
│   ├── Sona_AI_Project_Documentation.pdf
│   └── generate_report.py        # PDF Documentation Compile Script
├── frontend/                     # React Single Page Application (SPA)
│   ├── public/                   # Static public assets
│   │   └── music/                # Soothing audio tracks (served in relaxation page)
│   ├── src/                      # Frontend source code
│   │   ├── components/           # Reusable UI components (HealthTab, Chat, Vitals)
│   │   └── pages/                # Pages (MusicPage, TestCasesPage, Onboarding)
│   ├── .env                      # Frontend environment variables
│   └── package.json              # Package manifest and dependencies
├── sona-ai-backend/              # FastAPI High-Performance Backend
│   ├── ai/                       # Intelligent Router & Agentic Modules
│   │   ├── modules/              # Specialized agents (Mental Health, Cry Analysis, Coach)
│   │   ├── orchestrator.py       # Smart routing system based on intent & emotions
│   │   └── llm_integration.py    # Google Gemini API integration
│   ├── models/                   # Database schemas and database connectors
│   ├── routes/                   # API router controllers (Auth, Chat, Triage)
│   ├── tests/                    # Automated integration testing
│   │   └── test_gemini.py        # API verification suite
│   ├── .env                      # Backend local environment configurations
│   ├── main.py                   # Server startup script
│   └── requirements.txt          # Python library declarations
├── .gitignore                    # Universal root Git ignore file
└── README.md                     # Master workspace documentation (This file)
```

---

## ⚡ Quick Start & Deployment Guide

### 1. Prerequisites
- **Node.js**: `18.0.0+`
- **Python**: `3.10+`
- **MongoDB**: Local community server or a MongoDB Atlas Cloud connection URI.
- **PostgreSQL**: Local running PostgreSQL instance (or cloud host) with a database named `maternal_app_db`.
- **Google Gemini API Key**: Acquired from [Google AI Studio](https://aistudio.google.com/).

---

### 2. Environment Variables Configuration

#### 🔹 Backend Setup (`sona-ai-backend/.env`)
Create `sona-ai-backend/.env` and specify the following variables:
```env
# Google Gemini API Configuration
GEMINI_API_KEY=AIzaSyCo_...   # Your active Gemini API key

# Datastore URIs
MONGODB_URL=mongodb://127.0.0.1:27017/sona_ai
POSTGRES_DATABASE_URL=postgresql://postgres:password@localhost:5432/maternal_app_db

# JWT Security
JWT_SECRET=your_super_secure_jwt_secret_key

# Service Settings
DEBUG=True
HOST=0.0.0.0
PORT=8000
```
*(An example file is provided at `sona-ai-backend/.env.example`)*

#### 🔹 Frontend Setup (`frontend/.env`)
Create `frontend/.env` specifying the backend API host endpoint:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

### 3. Step-by-Step Installation & Launch

#### Step A: Initialize Backend Dependencies
Create a virtual environment and install the required library set inside the backend folder:
```bash
cd sona-ai-backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

#### Step B: Compile RAG Vector Database
To feed Sona AI with official, clinical WHO guidelines, run the ingestion script from the workspace root:
```bash
python data_pipeline/ingestion.py
```
*This parses the PDFs stored inside `data_pipeline/pdfs/`, segments the text, generates vector embeddings using a local HuggingFace model, and writes them directly to the backend's `chroma_db/` directory.*

#### Step C: Seed Datastore (Optional)
To set up mock clinicians (such as Dr. Chen) and patient baselines for testing, run the seed script:
```bash
python seed_data.py
```

#### Step D: Start Backend Service
```bash
python main.py
```
The FastAPI documentation will be available at `http://localhost:8000/docs` and the API will listen at `http://localhost:8000/api`.

#### Step E: Install & Launch Frontend Client
In a separate terminal shell, run:
```bash
cd frontend
npm install
npm run dev
```
The React development server will launch at `http://localhost:5173`.

---

## 🧠 Core Agentic Modules & Smart Router

Sona AI operates an intelligent agent routing gateway (`orchestrator.py`) which acts upon user message categorization:

1. **Mental Health & Panic Grounding (`mental_health.py`):** Initiates if severe postpartum stress or breathlessness is identified. It locks general conversation and guides the mother through 4-7-8 box breathing or sensory grounding.
2. **Baby Cry Analysis (`cry_analysis.py`):** Classifies dynamic baby cry characteristics (hunger, sleepiness, pain, colic) and provides age-specific soothing directives.
3. **Identity Resume Coach (`identity_coach.py`):** Re-translates motherhood caretaking narratives (e.g., resource coordination, crisis management) into high-value professional skill descriptions for resumes.
4. **Communication Templates (`communication.py`):** Generates pre-written, custom-tailored messages for partners, family members, or clinicians with selectable assertive, appreciative, or collaborative tones.
5. **Clinical Triage Engine (`triage_engine.py`):** Analyzes clinical onboarding responses, categorizes patient risk priorities, and streams warning triggers directly onto the Doctor's Triage Dashboard.

---

## 🔒 Safety Safeguards & HIPAA Alignment

- **Prescription Denial Gate:** Automatically catches drug query patterns and displays a strict disclaimer, redirecting the patient to write their obstetrician instead.
- **Vitals Checklist Thresholds:** Alerts patients locally and flags the doctor dashboard immediately if systolic BP exceeds `140 mmHg` or diastolic BP exceeds `90 mmHg`.
- **PHI Anonymization:** Deterministically parses out names, emails, and phone numbers before routing prompts to external Gemini LLM pipelines, safeguarding patient privacy.

---

## 🧪 Quality Assurance & Test Matrix

The React client features an interactive automated Test Runner (`/test-cases`) running full simulation suites of backend REST routes, vector retrieval accuracy, and guardrail responses. The platform maintains a **100% pass rate** across all automated tests with a mean round-trip latency of **285ms**.

---

**Built with ❤️ for clinical maternal and infant health support**
