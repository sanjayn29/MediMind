import { useState } from 'react';
import { AlertTriangle, Clock, ArrowRight, Shield, Phone, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RiskAssessment {
  id: string;
  diagnosis: string;
  urgency: 'Critical' | 'High' | 'Moderate' | 'Low';
  timeframe: string;
  nextSteps: string[];
  riskFactors: string[];
  redFlags: string[];
}

export const RiskRankAgent = () => {
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessments, setAssessments] = useState<RiskAssessment[]>([
    {
      id: '1',
      diagnosis: 'Migraine with Aura',
      urgency: 'Moderate',
      timeframe: '24-48 hours',
      nextSteps: [
        'Neurological examination',
        'Consider imaging if atypical features',
        'Migraine prophylaxis evaluation',
        'Patient education on triggers'
      ],
      riskFactors: ['Family history', 'Female gender', 'Hormonal factors'],
      redFlags: []
    },
    {
      id: '2',
      diagnosis: 'Secondary Headache',
      urgency: 'High',
      timeframe: 'Immediate - 6 hours',
      nextSteps: [
        'Emergency CT/MRI imaging',
        'Complete neurological exam',
        'Vital signs monitoring',
        'Consider lumbar puncture'
      ],
      riskFactors: ['Sudden onset', 'Pattern change', 'Associated symptoms'],
      redFlags: ['Thunderclap onset', 'Fever', 'Altered consciousness']
    }
  ]);

  const runRiskAssessment = async () => {
    setIsAssessing(true);
    setTimeout(() => {
      setIsAssessing(false);
    }, 2500);
  };

  const getUrgencyConfig = (urgency: string) => {
    const configs = {
      'Critical': {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: Zap,
        bgClass: 'bg-red-50 border-red-200'
      },
      'High': {
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: AlertTriangle,
        bgClass: 'bg-orange-50 border-orange-200'
      },
      'Moderate': {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
        bgClass: 'bg-yellow-50 border-yellow-200'
      },
      'Low': {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: Shield,
        bgClass: 'bg-green-50 border-green-200'
      }
    };
    return configs[urgency as keyof typeof configs] || configs.Low;
  };

  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-accent rounded-lg">
          <AlertTriangle className="h-5 w-5 text-accent-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">Risk Rank Agent</h3>
          <p className="text-sm text-muted-foreground">Urgency assessment and clinical decision support</p>
        </div>
        <Button
          onClick={runRiskAssessment}
          variant="warning"
          disabled={isAssessing}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          {isAssessing ? 'Assessing...' : 'Assess Risk'}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-foreground">Risk Stratification:</h4>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Ordered by urgency</span>
          </div>
        </div>

        {assessments.map((assessment, index) => {
          const urgencyConfig = getUrgencyConfig(assessment.urgency);
          const UrgencyIcon = urgencyConfig.icon;

          return (
            <div
              key={assessment.id}
              className={`p-4 border rounded-lg ${urgencyConfig.bgClass} transition-all hover:shadow-card`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <UrgencyIcon className="h-5 w-5 text-current" />
                  <h5 className="font-medium text-foreground">{assessment.diagnosis}</h5>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={urgencyConfig.color}>
                    {assessment.urgency} Priority
                  </Badge>
                  <Badge variant="outline" className="bg-background/50">
                    {assessment.timeframe}
                  </Badge>
                </div>
              </div>

              {assessment.redFlags.length > 0 && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded">
                  <div className="flex items-center space-x-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Red Flags Identified</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {assessment.redFlags.map((flag, idx) => (
                      <Badge key={idx} className="bg-red-100 text-red-800 text-xs">
                        {flag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h6 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Immediate Next Steps:
                  </h6>
                  <ul className="space-y-1">
                    {assessment.nextSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm">
                        <ArrowRight className="h-3 w-3 mt-0.5 text-primary flex-shrink-0" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h6 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Risk Factors:
                  </h6>
                  <div className="flex flex-wrap gap-1">
                    {assessment.riskFactors.map((factor, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-background/30">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {assessment.urgency === 'Critical' || assessment.urgency === 'High' && (
                <div className="mt-3 pt-3 border-t border-current/10">
                  <Button variant="warning" size="sm" className="w-full">
                    <Phone className="h-3 w-3 mr-2" />
                    Contact Emergency Services / Specialist
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <h5 className="font-medium text-foreground mb-2">Clinical Decision Support</h5>
        <p className="text-sm text-muted-foreground">
          This assessment is based on current symptoms and should be combined with clinical judgment. 
          Always consider patient history, physical examination findings, and local protocols.
        </p>
      </div>
    </Card>
  );
};