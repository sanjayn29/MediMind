import { useState, useEffect } from 'react';
import { Brain, Target, TrendingUp, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { apiService, type DiagnosisResponse } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

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
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisResponse | null>(null);
  const [apiConnected, setApiConnected] = useState(false);
  const { toast } = useToast();

  // Check API connection on component mount
  useEffect(() => {
    checkApiConnection();
  }, []);

  const checkApiConnection = async () => {
    try {
      await apiService.healthCheck();
      setApiConnected(true);
    } catch (error) {
      console.error('API connection failed:', error);
      setApiConnected(false);
      toast({
        title: "API Connection Failed",
        description: "Unable to connect to diagnosis service. Using demo data.",
        variant: "destructive"
      });
    }
  };

  const runDiagnosisAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      // For demo purposes, we'll use sample symptoms
      const sampleSymptoms = ['headache', 'nausea', 'sensitivity to light'];
      const response = await apiService.diagnoseSymptoms({
        symptoms: sampleSymptoms
      });
      
      setDiagnosisData(response);
      setDiagnoses(response.diagnoses.map((d, index) => ({
        id: (index + 1).toString(),
        name: d.name,
        probability: d.probability,
        confidence: getConfidenceLevel(d.probability),
        symptoms: d.symptoms,
        differentials: d.differentials
      })));
      
      toast({
        title: "Analysis Complete",
        description: `Found ${response.diagnoses.length} potential diagnoses with ${response.confidence_score.toFixed(1)}% confidence.`
      });
      
    } catch (error) {
      console.error('Diagnosis analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to perform diagnosis analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getConfidenceLevel = (probability: number): string => {
    if (probability >= 80) return 'High';
    if (probability >= 60) return 'Moderate';
    return 'Low';
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
        <div className="flex items-center space-x-2">
          <Button
            onClick={runDiagnosisAnalysis}
            variant="medical"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Target className="h-4 w-4 mr-2" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
          </Button>
          <Button
            onClick={checkApiConnection}
            variant="outline"
            size="icon"
            title="Check API Connection"
          >
            <RefreshCw className={`h-4 w-4 ${apiConnected ? 'text-green-500' : 'text-red-500'}`} />
          </Button>
        </div>
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

        {diagnoses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No diagnoses available. Run analysis to get started.</p>
          </div>
        ) : (
          diagnoses.map((diagnosis, index) => (
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
        ))
        )}
      </div>
    </Card>
  );
};