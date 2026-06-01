# Sona AI - Full-Stack Maternal & Child Health Chatbot

## 🎯 Overview

Sona AI is an emotionally intelligent, multi-agent chatbot system designed to support maternal mental health, baby care assistance, identity/resume coaching, and communication support.

## 🏗️ Architecture

```
Frontend (React + Vite + TypeScript + shadcn/ui)
    ↓
Backend API (FastAPI + Python)
    ↓
AI Orchestration Layer (Smart Routing)
    ↓
Specialized AI Modules
    ↓
Database Layer (MongoDB)
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB (local or Atlas)
- **Gemini API key** (from Google AI Studio)

### Backend Setup

1. **Install Dependencies**
```bash
cd sona-ai-backend
pip install -r requirements.txt
```

2. **Get Gemini API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key

3. **Environment Setup**
```bash
cp .env.example .env
# Edit .env and add your Gemini API key:
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URL=mongodb://127.0.0.1:27017/sona_ai
```

4. **Test Gemini API**
```bash
python test_gemini.py
```

5. **Start MongoDB**
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
```

6. **Run Backend**
```bash
python main.py
```
Backend will start on `http://localhost:8000`

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Start Frontend**
```bash
npm run dev
```
Frontend will start on `http://localhost:5173`

## 🌐 API Endpoints

### Main Chat
- `POST /api/chat` - Main chat endpoint with AI orchestration
- `GET /api/chat-history/{user_id}` - Get chat history
- `GET /api/user-sessions/{user_id}` - Get user sessions

### AI Services
- `POST /api/analyze-cry` - Baby cry analysis
- `POST /api/detect-emotion` - Emotion detection from text
- `POST /api/generate-message` - Generate communication messages

### User Management
- `GET /api/user-profile/{user_id}` - Get user profile
- `POST /api/user-profile/{user_id}` - Update user profile
- `GET /api/mood-history/{user_id}` - Get mood history
- `POST /api/mood-log/{user_id}` - Log mood entry

### Health
- `GET /api/health` - Health check endpoint

## 🧠 AI Modules

### 1. Mental Health Module
- **Purpose**: Panic/anxiety support and grounding exercises
- **Features**: 
  - 5-4-3-2-1 grounding technique
  - Box breathing exercises
  - Progressive muscle relaxation
  - Stress level assessment

### 2. Baby Cry Analysis Module
- **Purpose**: Analyze baby cries and provide guidance
- **Features**:
  - Cry pattern analysis (hungry, sleepy, pain, discomfort, colic)
  - Age-specific advice (0-3 months, 4-6 months, 7-12 months, 12+ months)
  - Recording guidance
  - Urgency level assessment

### 3. Identity Coach Module
- **Purpose**: Translate motherhood experience into professional skills
- **Features**:
  - Resume building assistance
  - Skill identification and articulation
  - Career guidance for returning mothers
  - Interview preparation
  - Professional language translation

### 4. Communication Module
- **Purpose**: Generate messages for partners, family, doctors
- **Features**:
  - Message templates for different recipients
  - Tone adjustment (supportive, assertive, appreciative)
  - Communication guidance
  - Boundary-setting support

## 🤖 LLM Integration

### Gemini API Integration
- **Model**: gemini-1.5-flash (fast and efficient)
- **System Prompts**: Tailored for each AI module
- **Context Awareness**: Maintains conversation context
- **Fallback Responses**: Graceful degradation when API unavailable

### Prompt Engineering
- **Health Assistant**: Empathetic, supportive, medically cautious
- **Identity Coach**: Empowering, forward-thinking, professional
- **Panic Response**: Calming, direct, immediate action-oriented
- **General Support**: Warm, informative, emotionally intelligent

## 🧠 Memory System

### MongoDB Collections
- **chat_history**: All chat messages with metadata
- **user_profiles**: User preferences and information
- **mood_logs**: Emotional state tracking over time

### Data Flow
```
User Input → Backend → AI Router → Module → LLM → Response → Frontend → Store in DB
```

## 🔄 AI Orchestration

### Smart Routing Logic
1. **Intent Detection**: Analyze user input for specific needs
2. **Emotion Detection**: Identify emotional state
3. **Module Selection**: Route to appropriate AI module
4. **Response Generation**: Create contextual response
5. **Database Storage**: Save interaction for continuity

### Intent Types
- **panic_support**: Immediate grounding exercises
- **cry_analysis**: Baby cry interpretation
- **identity_coaching**: Career and skill development
- **communication**: Message generation
- **general_health**: General maternal health support

## 🎨 Frontend Features

### Chat Interface
- **Mode Toggle**: Health Assistant vs Identity Coach
- **Message Types**: User and assistant messages with animations
- **Emotion Indicators**: Visual feedback for detected emotions
- **Grounding Exercises**: Special formatting for panic support
- **Quick Prompts**: One-tap access to common needs
- **Audio Support**: Placeholder for cry analysis uploads

### UI Components
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Framer Motion for polished UX
- **Accessibility**: Screen reader support and keyboard navigation
- **Error Handling**: Graceful fallbacks and user feedback

## 🔒 Security & Privacy

### Data Protection
- **API Keys**: Stored in environment variables
- **User Data**: Encrypted storage in MongoDB
- **Input Validation**: Sanitization and validation on all inputs
- **CORS Configuration**: Restricted to allowed origins

### HIPAA Considerations
- **Medical Advice**: Always recommends consulting healthcare providers
- **Data Privacy**: No sensitive health data stored permanently
- **Disclaimer**: Clear guidance on AI limitations

## 📊 Monitoring & Analytics

### Health Checks
- **Backend Health**: Database connection, API status
- **LLM Integration**: OpenAI API availability
- **Error Tracking**: Comprehensive error logging

### User Analytics
- **Mood Tracking**: Emotional state over time
- **Usage Patterns**: Popular features and modules
- **Success Metrics**: Help requests resolved

## 🧪 Development

### Local Development
```bash
# Backend (Terminal 1)
cd sona-ai-backend
python main.py

# Frontend (Terminal 2)
cd frontend
npm run dev
```

### Testing
```bash
# Backend tests
cd sona-ai-backend
pytest

# Frontend tests
cd frontend
npm test
```

### Environment Variables
```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URL=mongodb://127.0.0.1:27017/sona_ai

# Optional
JWT_SECRET=your_jwt_secret
DEBUG=True
HOST=0.0.0.0
PORT=8000
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 🚀 Deployment

### Production Considerations
- **Environment Variables**: Use secure secrets management
- **Database**: Use MongoDB Atlas for production
- **Scaling**: Load balancer for multiple API instances
- **Monitoring**: Error tracking and performance monitoring

### Docker Deployment
```dockerfile
# Backend Dockerfile example
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

## 🤝 Contributing

### Code Structure
```
sona-ai-backend/
├── ai/
│   ├── orchestrator.py      # Smart routing system
│   ├── llm_integration.py  # OpenAI API integration
│   └── modules/            # Specialized AI modules
├── models/
│   ├── database.py         # MongoDB operations
│   └── schemas.py          # Pydantic models
├── routes/
│   └── chat.py             # API endpoints
└── main.py                # FastAPI application
```

### Development Guidelines
- **Modular Design**: Each AI module is self-contained
- **Error Handling**: Graceful degradation and fallbacks
- **Documentation**: Comprehensive docstrings and comments
- **Testing**: Unit tests for all critical functions

## 📞 Troubleshooting

### Common Issues
1. **MongoDB Connection**: Check connection string and network
2. **OpenAI API**: Verify API key and rate limits
3. **CORS Errors**: Ensure frontend URL is in allowed origins
4. **Module Import**: Check Python path and dependencies

### Debug Mode
```bash
# Enable debug logging
export DEBUG=True
python main.py
```

## 🎯 Future Enhancements

### Planned Features
- **Real Audio Analysis**: ML-powered cry analysis
- **Vector Memory**: Long-term conversation context
- **Multi-language Support**: International expansion
- **Mobile App**: Native iOS/Android applications
- **Professional Network**: Connect mothers with opportunities

### AI Improvements
- **Custom Models**: Fine-tuned models for maternal health
- **Sentiment Analysis**: More nuanced emotion detection
- **Predictive Insights**: Proactive mental health support
- **Personalization**: Adaptive responses based on user history

---

## 📞 Support

For questions, issues, or contributions:
- **Documentation**: Check this README and code comments
- **Issues**: Create detailed bug reports
- **Features**: Submit enhancement requests
- **Community**: Join our maternal health tech community

---

**Built with ❤️ for maternal health support**
