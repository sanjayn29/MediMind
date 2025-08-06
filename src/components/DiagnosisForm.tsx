import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/lib/api';
import { saveDiagnosis } from '@/lib/firestore';
import { Plus, X, Loader2, Mic, Send } from 'lucide-react';

interface DiagnosisFormProps {
  userId: string;
  onDiagnosisComplete: (diagnosis: any) => void;
}

export const DiagnosisForm = ({ userId, onDiagnosisComplete }: DiagnosisFormProps) => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const addSymptom = () => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()]);
      setCurrentSymptom('');
      toast({
        title: "Symptom Added",
        description: "Symptom has been recorded successfully."
      });
    }
  };

  const removeSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const toggleVoiceRecording = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast({
        title: "Voice Recording",
        description: "Listening for symptoms... (Demo mode)"
      });
    }
  };

  const processDiagnosis = async () => {
    if (symptoms.length === 0) {
      toast({
        title: "No Symptoms",
        description: "Please add symptoms before processing.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Get diagnosis from API
      const response = await apiService.diagnoseSymptoms({
        symptoms: symptoms
      });

      // Save to Firestore
      const saveResult = await saveDiagnosis(userId, {
        symptoms: symptoms,
        diagnoses: response.diagnoses,
        riskLevel: response.risk_level,
        recommendations: response.recommendations,
        confidenceScore: response.confidence_score
      });

      if (saveResult.success) {
        toast({
          title: "Diagnosis Complete",
          description: `Found ${response.diagnoses.length} potential diagnoses with ${response.confidence_score.toFixed(1)}% confidence.`
        });

        // Pass diagnosis data to parent component
        onDiagnosisComplete({
          ...response,
          id: saveResult.id
        });

        // Clear symptoms after successful diagnosis
        setSymptoms([]);
      } else {
        toast({
          title: "Save Failed",
          description: "Diagnosis completed but failed to save to history.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Diagnosis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to process symptoms. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Plus className="h-5 w-5 text-blue-600" />
          </div>
          <span>Symptom Collector</span>
        </CardTitle>
        <CardDescription>
          Describe your symptoms to get an AI-powered diagnosis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Textarea
            placeholder="Describe your symptoms (e.g., 'Severe headache for 3 days, nausea, sensitivity to light')"
            value={currentSymptom}
            onChange={(e) => setCurrentSymptom(e.target.value)}
            className="flex-1 min-h-[80px]"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addSymptom();
              }
            }}
          />
          <div className="flex flex-col space-y-2">
            <Button
              onClick={addSymptom}
              variant="outline"
              size="icon"
              disabled={!currentSymptom.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              onClick={toggleVoiceRecording}
              variant={isListening ? "destructive" : "outline"}
              size="icon"
            >
              <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
            </Button>
          </div>
        </div>

        {symptoms.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-700">Recorded Symptoms:</h4>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((symptom, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="py-1 px-3 bg-blue-50 text-blue-700 border-blue-200"
                >
                  {symptom}
                  <button
                    onClick={() => removeSymptom(index)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Button 
              onClick={processDiagnosis}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing Symptoms...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Get Diagnosis ({symptoms.length} symptoms)
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 