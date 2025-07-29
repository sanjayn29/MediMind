import { Activity, Shield, Users } from 'lucide-react';

export const MedicalHeader = () => {
  return (
    <header className="bg-gradient-background border-b border-border shadow-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-medical">
              <Activity className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground font-medical">
                Medical Diagnosis Assistant
              </h1>
              <p className="text-sm text-muted-foreground">
                AI-Powered Clinical Decision Support
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>For Medical Professionals Only</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};