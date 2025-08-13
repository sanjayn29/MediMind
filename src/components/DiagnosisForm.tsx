import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useVoiceInput } from '@/hooks/use-voice-input';
import { apiService } from '@/lib/api';
import { saveDiagnosis } from '@/lib/firestore';
import { Plus, X, Loader2, Mic, MicOff, Send } from 'lucide-react';

interface DiagnosisFormProps {
  userId: string;
  onDiagnosisComplete: (diagnosis: any) => void;
}

export const DiagnosisForm = ({ userId, onDiagnosisComplete }: DiagnosisFormProps) => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  // Voice input hook
  const {
    isListening,
    isSupported,
    startListening,
    stopListening,
    transcript,
    resetTranscript
  } = useVoiceInput();

  // Update current symptom when transcript changes
  useEffect(() => {
    if (transcript) {
      setCurrentSymptom(transcript);
    }
  }, [transcript]);

  const addSymptom = () => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()]);
      setCurrentSymptom('');
      resetTranscript();
      toast({
        title: "Symptom Added",
        description: "Symptom has been recorded successfully.",
        style: { background: '#4CAF50', color: '#FFFFFF' } // Success Green
      });
    }
  };

  const removeSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const toggleVoiceRecording = async () => {
    try {
      if (isListening) {
        stopListening();
        toast({
          title: "Voice Recording Stopped",
          description: "Voice recording has been stopped.",
          style: { background: '#4CAF50', color: '#FFFFFF' } // Success Green
        });
      } else {
        await startListening();
        toast({
          title: "Voice Recording Started",
          description: "Start describing your symptoms. Click the microphone again to stop.",
          style: { background: '#00ACC1', color: '#FFFFFF' } // Info Cyan
        });
      }
    } catch (error) {
      console.error('Voice recording error:', error);
      toast({
        title: "Voice Recording Error",
        description: "Unable to start voice recording. Please check your microphone permissions.",
        variant: "destructive",
        style: { background: '#E53935', color: '#FFFFFF' } // Warning/Alert Red
      });
    }
  };

  const processDiagnosis = async () => {
    if (symptoms.length === 0) {
      toast({
        title: "No Symptoms",
        description: "Please add symptoms before processing.",
        variant: "destructive",
        style: { background: '#E53935', color: '#FFFFFF' } // Warning/Alert Red
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
          description: `Found ${response.diagnoses.length} potential diagnoses with ${response.confidence_score.toFixed(1)}% confidence.`,
          style: { background: '#4CAF50', color: '#FFFFFF' } // Success Green
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
          variant: "destructive",
          style: { background: '#E53935', color: '#FFFFFF' } // Warning/Alert Red
        });
      }
    } catch (error) {
      console.error('Diagnosis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to process symptoms. Please try again.",
        variant: "destructive",
        style: { background: '#E53935', color: '#FFFFFF' } // Warning/Alert Red
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="shadow-xl border-[#E0E0E0] bg-[#FFFFFF] rounded-2xl">
      <CardHeader className="bg-[#F5F9FC] rounded-t-2xl p-6">
        <CardTitle className="flex items-center space-x-2 text-[#212121]">
          <div className="p-2.5 bg-[#F5F9FC] rounded-lg">
            <Plus className="h-5 w-5 text-[#1E88E5]" />
          </div>
          <span className="text-lg font-semibold">Symptom Collector</span>
        </CardTitle>
        <CardDescription className="text-[#616161]">
          Describe your symptoms to get an AI-powered diagnosis
          {isSupported && (
            <span className="block text-xs text-[#1E88E5] mt-1">
              💡 Use the microphone button for voice input
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="flex space-x-3">
          <Textarea
            placeholder="Describe your symptoms (e.g., 'Severe headache for 3 days, nausea, sensitivity to light')"
            value={currentSymptom}
            onChange={(e) => setCurrentSymptom(e.target.value)}
            className="flex-1 min-h-[80px] bg-[#F5F9FC] border-[#E0E0E0] focus:ring-2 focus:ring-[#1E88E5] text-[#212121] rounded-lg"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addSymptom();
              }
            }}
          />
          <div className="flex flex-col space-y-3">
            <Button
              onClick={addSymptom}
              variant="default"
              size="icon"
              disabled={!currentSymptom.trim()}
              className="bg-blue-400 text-black border-blue-400 hover:bg-blue-400 active:bg-blue-400 focus:bg-blue-400 h-[48px] w-[48px] rounded-lg shadow-sm"
            >
              <Plus className="h-5 w-5" />
            </Button>
            {isSupported && (
              <Button
                onClick={toggleVoiceRecording}
                variant={isListening ? "destructive" : "outline"}
                size="icon"
                className={`h-[48px] w-[48px] rounded-lg shadow-sm ${isListening ? 'bg-[#E53935] hover:bg-[#E53935] text-[#FFFFFF]' : 'border-[#E0E0E0] text-[#1E88E5] hover:bg-[#F5F9FC]'}`}
              >
                {isListening ? (
                  <MicOff className="h-5 w-5 animate-pulse" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Voice Input Status */}
        {isListening && (
          <div className="p-3 bg-[#F5F9FC] rounded-lg border border-[#E0E0E0]">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#E53935] rounded-full animate-pulse"></div>
              <span className="text-sm text-[#1E88E5]">
                Listening... {transcript && `"${transcript}"`}
              </span>
            </div>
          </div>
        )}

        {symptoms.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-[#212121]">Recorded Symptoms:</h4>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((symptom, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="py-1 px-3 bg-[#F5F9FC] text-[#212121] border-[#E0E0E0]"
                >
                  {symptom}
                  <button
                    onClick={() => removeSymptom(index)}
                    className="ml-2 text-[#616161] hover:text-[#E53935]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Button 
              onClick={processDiagnosis}
              variant="default"
              className="w-full bg-blue-400 text-black border-blue-400 hover:bg-blue-400 active:bg-blue-400 focus:bg-blue-400 rounded-lg shadow-sm"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing Symptoms...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
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