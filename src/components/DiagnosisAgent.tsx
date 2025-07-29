import { useState } from 'react';
import { Brain, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface Diagnosis {
  id: string;
  name: string;
  probability: number;
  confidence: string;
  symptoms: string[];
  differentials: string[];
}

export const DiagnosisAgent = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([
    {
      id: '1',
      name: 'Migraine with Aura',
      probability: 89,
      confidence: 'High',
      symptoms: ['Unilateral headache', 'Visual disturbances', 'Nausea', 'Photophobia'],
      differentials: ['Tension headache', 'Cluster headache', 'Intracranial lesion']
    },
    {
      id: '2',
      name: 'Tension-Type Headache',
      probability: 67,
      confidence: 'Moderate',
      symptoms: ['Bilateral headache', 'Pressure sensation', 'Mild to moderate intensity'],
      differentials: ['Migraine', 'Cervicogenic headache']
    },
    {
      id: '3',
      name: 'Secondary Headache',
      probability: 23,
      confidence: 'Low',
      symptoms: ['Recent onset', 'Pattern change'],
      differentials: ['Primary headache disorders']
    }
  ]);

  const runDiagnosisAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  const getConfidenceColor = (confidence: string) => {
    const colors: { [key: string]: string } = {
      'High': 'bg-green-100 text-green-800',
      'Moderate': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-red-100 text-red-800',
    };
    return colors[confidence] || 'bg-gray-100 text-gray-800';
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'bg-green-500';
    if (probability >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-primary rounded-lg">
          <Brain className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">Diagnosis Agent</h3>
          <p className="text-sm text-muted-foreground">AI-powered differential diagnosis matching</p>
        </div>
        <Button
          onClick={runDiagnosisAnalysis}
          variant="medical"
          disabled={isAnalyzing}
        >
          <Target className="h-4 w-4 mr-2" />
          {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
        </Button>
      </div>

      {isAnalyzing && (
        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            <Brain className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium">AI Analysis in Progress</span>
          </div>
          <Progress value={75} className="w-full mb-2" />
          <p className="text-xs text-muted-foreground">
            Correlating symptoms with medical knowledge base...
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-foreground">Differential Diagnoses:</h4>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>Ranked by probability</span>
          </div>
        </div>

        {diagnoses.map((diagnosis, index) => (
          <div
            key={diagnosis.id}
            className="p-4 border border-border rounded-lg bg-card hover:shadow-card transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <h5 className="font-medium text-foreground">{diagnosis.name}</h5>
                {diagnosis.probability >= 80 && (
                  <AlertTriangle className="h-4 w-4 text-warning" />
                )}
              </div>
              <Badge className={getConfidenceColor(diagnosis.confidence)}>
                {diagnosis.confidence} Confidence
              </Badge>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Probability</span>
                <span className="text-sm font-medium">{diagnosis.probability}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${getProbabilityColor(diagnosis.probability)}`}
                  style={{ width: `${diagnosis.probability}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Supporting Symptoms:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {diagnosis.symptoms.map((symptom, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs bg-primary/5">
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Consider Also:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {diagnosis.differentials.map((diff, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs bg-muted/50">
                      {diff}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};