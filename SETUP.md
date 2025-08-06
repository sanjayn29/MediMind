# Medical Diagnosis Assistant - Setup Guide

This guide will help you set up the complete Medical Diagnosis Assistant with Firebase integration, Groq API, and all necessary configurations.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Firebase project with Authentication and Firestore enabled
- Groq API key

## 📋 Step-by-Step Setup

### 1. Firebase Configuration

#### A. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication (Email/Password)
4. Enable Firestore Database
5. Set up Firestore security rules (see below)

#### B. Configure Firebase in Frontend
1. Get your Firebase config from Project Settings > General > Your apps
2. Update `src/lib/firebase.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

#### C. Firestore Security Rules
Add these rules in Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own diagnosis records
    match /diagnoses/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 2. Backend Setup

#### A. Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

**Note:** If you get Rust/Cargo errors, install Rust first:
- Windows: Download from [https://rustup.rs/](https://rustup.rs/)
- Mac/Linux: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

#### B. Configure Environment Variables
1. Copy `env.example` to `.env`:
```bash
cp env.example .env
```

2. Edit `.env` and add your Groq API key:
```env
GROQ_API_KEY=your_actual_groq_api_key_here
HOST=0.0.0.0
PORT=8000
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

#### C. Get Groq API Key
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up and get your API key
3. Add it to the `.env` file

### 3. Frontend Setup

#### A. Install Dependencies
```bash
npm install
```

#### B. Start Development Servers

**Option 1: Manual Start**
```bash
# Terminal 1 - Backend
cd backend
python main.py

# Terminal 2 - Frontend
npm run dev
```

**Option 2: One-Click Start**
- Windows: Double-click `start-dev.bat`
- Mac/Linux: Run `./start-dev.sh`

### 4. Verify Installation

1. **Backend Health Check**: Visit [http://localhost:8000/api/health](http://localhost:8000/api/health)
   - Should return: `{"status": "healthy", "groq_api": "configured"}`

2. **Frontend**: Visit [http://localhost:5173](http://localhost:5173)
   - Should show the authentication page

3. **Test Authentication**:
   - Create an account or sign in
   - Should redirect to dashboard

## 🔧 Configuration Details

### Environment Variables

#### Backend (.env)
```env
# Required
GROQ_API_KEY=your_groq_api_key

# Optional
HOST=0.0.0.0
PORT=8000
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

#### Frontend (src/lib/firebase.js)
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### API Endpoints

- `POST /api/diagnose` - Symptom analysis
- `POST /api/chat` - Medical consultation
- `GET /api/health` - Health check

### Database Schema

#### Firestore Collection: `diagnoses`
```javascript
{
  userId: "string",           // Firebase Auth UID
  symptoms: ["string"],       // Array of symptoms
  diagnoses: [object],        // AI diagnosis results
  riskLevel: "string",        // Low/Medium/High/Critical
  recommendations: ["string"], // AI recommendations
  confidenceScore: number,    // 0-100
  timestamp: Timestamp        // Firestore timestamp
}
```

## 🎯 Features Overview

### 1. Authentication System
- ✅ Email/password signup and login
- ✅ Firebase Authentication integration
- ✅ Protected routes
- ✅ User session management

### 2. Diagnosis System
- ✅ Symptom collection (text + voice demo)
- ✅ AI-powered diagnosis via Groq API
- ✅ Risk level assessment
- ✅ Personalized recommendations
- ✅ Confidence scoring

### 3. Chat Interface
- ✅ Real-time AI medical consultation
- ✅ Suggested follow-up questions
- ✅ Confidence indicators
- ✅ Message history

### 4. Data Management
- ✅ Firestore integration
- ✅ Diagnosis history
- ✅ User-specific data isolation
- ✅ Secure data storage

### 5. User Interface
- ✅ Responsive design
- ✅ Healthcare-appropriate color scheme
- ✅ Modern, clean interface
- ✅ Mobile-friendly

## 🚨 Troubleshooting

### Common Issues

#### 1. Backend Won't Start
```bash
# Error: ModuleNotFoundError: No module named 'fastapi'
pip install -r requirements.txt

# Error: GROQ_API_KEY environment variable is required
# Check your .env file exists and has the correct API key
```

#### 2. Frontend Build Errors
```bash
# Error: Cannot find module 'firebase'
npm install

# Error: Firebase config not found
# Update src/lib/firebase.js with your Firebase config
```

#### 3. Authentication Issues
- Verify Firebase Authentication is enabled
- Check Firebase config in `src/lib/firebase.js`
- Ensure Firestore rules allow user access

#### 4. API Connection Errors
- Verify backend is running on port 8000
- Check CORS settings in backend
- Ensure Groq API key is valid

### Debug Commands

```bash
# Check backend health
curl http://localhost:8000/api/health

# Check frontend build
npm run build

# Check Python dependencies
pip list | grep fastapi

# Check Node dependencies
npm list firebase
```

## 🔒 Security Considerations

1. **Never commit API keys** - Use environment variables
2. **Firestore rules** - Ensure users can only access their data
3. **CORS configuration** - Restrict to your domains
4. **Input validation** - All user inputs are validated
5. **HTTPS in production** - Always use secure connections

## 📱 Production Deployment

### Backend (FastAPI)
- Deploy to platforms like Railway, Render, or Heroku
- Set environment variables in production
- Use production-grade WSGI server

### Frontend (React)
- Build with `npm run build`
- Deploy to Vercel, Netlify, or Firebase Hosting
- Update Firebase config for production domain

### Database (Firestore)
- Configure production security rules
- Set up proper indexes
- Monitor usage and costs

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all environment variables are set
3. Ensure all dependencies are installed
4. Check browser console and terminal logs
5. Create an issue in the repository

## 📄 License

This project is for educational and development purposes. Ensure compliance with medical regulations and data protection laws in your jurisdiction. 