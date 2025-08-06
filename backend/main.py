from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from fastapi.responses import JSONResponse
from fastapi.requests import Request
import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Medical Diagnosis Assistant API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class SymptomRequest(BaseModel):
    symptoms: List[str]
    patient_age: Optional[int] = None
    patient_gender: Optional[str] = None
    medical_history: Optional[List[str]] = None

class DiagnosisResponse(BaseModel):
    diagnoses: List[dict]
    risk_level: str
    recommendations: List[str]
    confidence_score: float

class ChatMessage(BaseModel):
    message: str
    context: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    suggestions: List[str]
    confidence: float

# Groq API configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


@app.options("/{rest_of_path:path}")
async def preflight_handler(request: Request, rest_of_path: str = ""):
    return JSONResponse(status_code=200, content={"message": "CORS preflight OK"})

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY environment variable is required")

def call_groq_api(messages: List[dict], model: str = "llama3-8b-8192") -> str:
    """Call Groq API with the given messages"""
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": model,
        "messages": messages,
        "temperature": 0.3,
        "max_tokens": 2048
    }
    
    try:
        response = requests.post(GROQ_API_URL, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        return result["choices"][0]["message"]["content"]
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Groq API error: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Medical Diagnosis Assistant API is running"}

@app.post("/api/diagnose", response_model=DiagnosisResponse)
async def diagnose_symptoms(request: SymptomRequest):
    """Analyze symptoms and provide differential diagnosis"""
    
    # Create medical context for the AI
    symptoms_text = ", ".join(request.symptoms)
    context = f"""
    You are a medical AI assistant. Analyze the following symptoms and provide a differential diagnosis.
    
    Symptoms: {symptoms_text}
    Age: {request.patient_age or 'Not specified'}
    Gender: {request.patient_gender or 'Not specified'}
    Medical History: {', '.join(request.medical_history) if request.medical_history else 'Not specified'}
    
    Please provide:
    1. Top 3-5 most likely diagnoses with probability percentages
    2. Risk level (Low/Medium/High/Critical)
    3. Immediate recommendations
    4. Confidence score (0-100)
    
    Format your response as JSON with the following structure:
    {{
        "diagnoses": [
            {{
                "name": "Diagnosis name",
                "probability": 85,
                "symptoms": ["symptom1", "symptom2"],
                "differentials": ["diff1", "diff2"]
            }}
        ],
        "risk_level": "Medium",
        "recommendations": ["rec1", "rec2"],
        "confidence_score": 78.5
    }}
    """
    
    messages = [
        {"role": "system", "content": "You are a medical AI assistant specialized in differential diagnosis. Always respond with valid JSON."},
        {"role": "user", "content": context}
    ]
    
    try:
        response = call_groq_api(messages)
        # Parse the JSON response
        diagnosis_data = json.loads(response)
        return DiagnosisResponse(**diagnosis_data)
    except json.JSONDecodeError:
        # Fallback response if JSON parsing fails
        return DiagnosisResponse(
            diagnoses=[
                {
                    "name": "Symptom Analysis Required",
                    "probability": 50,
                    "symptoms": request.symptoms,
                    "differentials": ["Further evaluation needed"]
                }
            ],
            risk_level="Medium",
            recommendations=["Please consult with a healthcare provider for proper evaluation"],
            confidence_score=30.0
        )

@app.post("/api/chat", response_model=ChatResponse)
async def medical_chat(message: ChatMessage):
    """Handle medical chat conversations"""
    
    context = f"""
    You are a medical AI assistant. A patient is asking: "{message.message}"
    
    Context: {message.context or 'General medical inquiry'}
    
    Provide a helpful, professional response that:
    1. Addresses their question appropriately
    2. Suggests 2-3 follow-up questions to gather more information
    3. Includes a confidence level (0-100) in your response
    
    Format your response as JSON:
    {{
        "response": "Your detailed response here",
        "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
        "confidence": 85.5
    }}
    """
    
    messages = [
        {"role": "system", "content": "You are a medical AI assistant. Always respond with valid JSON."},
        {"role": "user", "content": context}
    ]
    
    try:
        response = call_groq_api(messages)
        chat_data = json.loads(response)
        return ChatResponse(**chat_data)
    except json.JSONDecodeError:
        return ChatResponse(
            response="I understand your question. To provide better assistance, could you provide more details about your symptoms?",
            suggestions=["What symptoms are you experiencing?", "How long have you had these symptoms?", "Have you had similar symptoms before?"],
            confidence=40.0
        )

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "groq_api": "configured"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
