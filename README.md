# Medical Diagnosis Assistant

A comprehensive AI-powered medical diagnosis assistant with Firebase authentication, real-time chat, and intelligent symptom analysis. Built for healthcare professionals and patients with a modern, responsive interface.

## 🎯 Features

- **🔐 Secure Authentication** - Firebase Auth with email/password
- **🤖 AI-Powered Diagnosis** - Groq API integration for intelligent symptom analysis
- **🏥 Disease Prediction** - Dataset-based symptom-to-disease mapping with 41 diseases
- **💬 Real-time Chat** - Interactive AI medical consultation
- **📊 Diagnosis History** - Firestore-based patient record management
- **📱 Responsive Design** - Works on desktop, tablet, and mobile
- **🎨 Modern UI** - Healthcare-appropriate design with blue/green color scheme

## 🏗️ System Architecture

### AI Agents
- **Symptom Collector Agent**: Intelligent collection of patient symptoms through text and voice input
- **Medical Database Agent**: Comprehensive medical knowledge base querying
- **Diagnosis Agent**: AI-powered differential diagnosis using Groq API
- **Risk Rank Agent**: Intelligent risk assessment and urgency ranking
- **Chat Assistant**: Real-time AI medical consultation with follow-up suggestions

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Shadcn/ui components
- React Query for state management

### Backend
- FastAPI (Python) with async support
- Groq API for AI-powered medical analysis
- Pydantic for data validation and type safety
- CORS support for frontend integration
- Environment-based configuration

### Database & Auth
- Firebase Authentication (Email/Password)
- Firestore for secure data storage
- User-specific data isolation
- HIPAA-compliant security rules

## Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.8+
- Firebase project with Authentication and Firestore enabled
- Groq API key (get one at [https://console.groq.com/](https://console.groq.com/))

## 🚀 Quick Setup

For detailed setup instructions, see [SETUP.md](./SETUP.md)

### 1. Firebase Setup
1. Create Firebase project and enable Authentication + Firestore
2. Update `src/lib/firebase.js` with your Firebase config
3. Set up Firestore security rules

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp env.example .env
# Edit .env with your Groq API key
python main.py
```

### 3. Frontend Setup
```bash
npm install
npm run dev
```

### 4. One-Click Start
- **Windows**: Double-click `start-dev.bat`
- **Mac/Linux**: Run `./start-dev.sh`

## API Endpoints

### Health Check
- `GET /api/health` - Check API status and Groq connection

### Diagnosis
- `POST /api/diagnose` - Analyze symptoms and provide differential diagnosis
  - Request body: `{ "symptoms": ["symptom1", "symptom2"], "patient_age": 30, "patient_gender": "female", "medical_history": ["condition1"] }`
  - Response: `{ "diagnoses": [...], "risk_level": "Medium", "recommendations": [...], "confidence_score": 85.5 }`

### Chat
- `POST /api/chat` - Medical consultation chat
  - Request body: `{ "message": "I have a headache", "context": "Medical consultation" }`
  - Response: `{ "response": "AI response", "suggestions": [...], "confidence": 85.5 }`

## Usage

### Disease Prediction Feature
1. **Enter Symptoms**: Use the Disease Predictor section to input symptoms
2. **Browse Symptoms**: Use the Symptom Browser to search and select from 132+ available symptoms
3. **Get Predictions**: Click "Predict Disease" to get top 5 disease matches with confidence scores
4. **Review Results**: Each prediction includes disease description and matching symptoms

### AI-Powered Diagnosis
1. **Symptom Collection**: Use the Symptom Collector to input patient symptoms
2. **Diagnosis Analysis**: Click "Run Analysis" in the Diagnosis Agent to get AI-powered differential diagnoses
3. **Medical Chat**: Use the Medical Chat Assistant for interactive consultations
4. **Risk Assessment**: The Risk Rank Agent will help prioritize conditions by urgency

## Disease Prediction Dataset

The system includes a comprehensive dataset with:
- **41 Diseases** including common conditions like Diabetes, Hypertension, Asthma, etc.
- **132+ Symptoms** covering various body systems
- **Disease Descriptions** with detailed medical information
- **Symptom-Disease Mappings** for accurate predictions

**Note**: This feature is for educational purposes only and should not replace professional medical advice.

## Project Structure

```
health-intuition/
├── backend/
│   ├── main.py              # FastAPI server with Groq integration
│   ├── requirements.txt     # Python dependencies
│   └── env.example         # Environment variables template
├── src/
│   ├── components/
│   │   ├── SymptomCollector.tsx    # Symptom input component
│   │   ├── DiagnosisAgent.tsx      # AI diagnosis component
│   │   ├── MedicalChat.tsx         # Chat interface
│   │   ├── MedicalDatabase.tsx     # Database queries
│   │   ├── RiskRankAgent.tsx       # Risk assessment
│   │   └── MedicalHeader.tsx       # Header component
│   ├── lib/
│   │   └── api.ts          # API service for backend communication
│   └── pages/
│       └── Index.tsx       # Main application page
├── package.json
└── README.md
```

## Development

### Adding New Features

1. **Backend**: Add new endpoints in `backend/main.py`
2. **Frontend**: Create new components in `src/components/`
3. **API Integration**: Update `src/lib/api.ts` for new endpoints

### Testing

```bash
# Frontend linting
npm run lint

# Backend (add to requirements.txt)
pip install pytest
pytest backend/
```

## Security Notes

- Never commit your `.env` file with API keys
- The application is configured for development use
- For production, implement proper authentication and authorization
- Consider HIPAA compliance for medical data handling

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend is running and CORS origins are correctly configured
2. **API Connection Failed**: Check your Groq API key and internet connection
3. **Port Conflicts**: Change ports in the configuration if needed

### Debug Mode

Enable debug logging by setting environment variables:

```env
DEBUG=true
LOG_LEVEL=debug
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational and development purposes. Please ensure compliance with medical regulations and data protection laws in your jurisdiction.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Create an issue in the repository
