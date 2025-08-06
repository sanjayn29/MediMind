import { MedicalHeader } from '@/components/MedicalHeader';
import { SymptomCollector } from '@/components/SymptomCollector';
import { MedicalDatabase } from '@/components/MedicalDatabase';
import { DiagnosisAgent } from '@/components/DiagnosisAgent';
import { RiskRankAgent } from '@/components/RiskRankAgent';
import { MedicalChat } from '@/components/MedicalChat';
import { DiseasePredictor } from '@/components/DiseasePredictor';
import { SymptomSuggestions } from '@/components/SymptomSuggestions';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-background font-medical">
      <MedicalHeader />
      
      <main className="container mx-auto px-6 py-8">
        {/* Dataset-Based Disease Prediction Section */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">🏥 Dataset Disease Predictor</h1>
            <p className="text-lg text-muted-foreground">Enter symptoms to predict diseases using our comprehensive medical dataset</p>
          </div>
          <DiseasePredictor />
        </div>
        
        {/* Symptom Browser Section */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-foreground">🔍 Symptom Browser</h2>
            <p className="text-muted-foreground">Browse and search through all available symptoms in our database</p>
          </div>
          <SymptomSuggestions onSymptomSelect={(symptom) => {
            // This will be handled by the DiseasePredictor component
            console.log('Symptom selected:', symptom);
          }} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <SymptomCollector />
            <MedicalDatabase />
          </div>
          
          {/* Middle Column */}
          <div className="space-y-6">
            <DiagnosisAgent />
            <RiskRankAgent />
          </div>

          {/* Right Column - Chat */}
          <div className="space-y-6">
            <MedicalChat />
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground bg-card px-4 py-2 rounded-full shadow-card">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>AI Agents Ready • Secure Medical Environment</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
