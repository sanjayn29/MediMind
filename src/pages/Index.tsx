import { MedicalHeader } from '@/components/MedicalHeader';
import { SymptomCollector } from '@/components/SymptomCollector';
import { MedicalDatabase } from '@/components/MedicalDatabase';
import { DiagnosisAgent } from '@/components/DiagnosisAgent';
import { RiskRankAgent } from '@/components/RiskRankAgent';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-background font-medical">
      <MedicalHeader />
      
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <SymptomCollector />
            <MedicalDatabase />
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <DiagnosisAgent />
            <RiskRankAgent />
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
