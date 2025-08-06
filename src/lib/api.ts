const API_BASE_URL = 'http://localhost:8000';

export interface SymptomRequest {
  symptoms: string[];
  patient_age?: number;
  patient_gender?: string;
  medical_history?: string[];
}

export interface Diagnosis {
  name: string;
  probability: number;
  symptoms: string[];
  differentials: string[];
}

export interface DiagnosisResponse {
  diagnoses: Diagnosis[];
  risk_level: string;
  recommendations: string[];
  confidence_score: number;
}

export interface ChatMessage {
  message: string;
  context?: string;
}

export interface ChatResponse {
  response: string;
  suggestions: string[];
  confidence: number;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async diagnoseSymptoms(data: SymptomRequest): Promise<DiagnosisResponse> {
    return this.request<DiagnosisResponse>('/api/diagnose', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async medicalChat(data: ChatMessage): Promise<ChatResponse> {
    return this.request<ChatResponse>('/api/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async healthCheck(): Promise<{ status: string; groq_api: string }> {
    return this.request<{ status: string; groq_api: string }>('/api/health');
  }
}

export const apiService = new ApiService(); 