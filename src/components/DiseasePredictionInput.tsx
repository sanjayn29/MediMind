import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useVoiceInput } from '@/hooks/use-voice-input';
import { Search, AlertCircle, CheckCircle, Info, Loader2, Plus, X, Mic, MicOff } from 'lucide-react';

interface DiseaseData {
  Disease: string;
  Symptom_1: string;
  Symptom_2: string;
  Symptom_3: string;
  Symptom_4: string;
  Symptom_5: string;
  Symptom_6: string;
  Symptom_7: string;
  Symptom_8: string;
  Symptom_9: string;
  Symptom_10: string;
  Symptom_11: string;
  Symptom_12: string;
  Symptom_13: string;
  Symptom_14: string;
  Symptom_15: string;
  Symptom_16: string;
  Symptom_17: string;
}

interface DiseaseDescription {
  Disease: string;
  Description: string;
}

interface PredictionResult {
  disease: string;
  confidence: number;
  matchingSymptoms: string[];
  description: string;
}

export const DiseasePredictionInput = () => {
  const [symptoms, setSymptoms] = useState<string>('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [diseaseData, setDiseaseData] = useState<DiseaseData[]>([]);
  const [diseaseDescriptions, setDiseaseDescriptions] = useState<DiseaseDescription[]>([]);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
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

  // Update symptoms when transcript changes
  useEffect(() => {
    if (transcript) {
      setSymptoms(transcript);
    }
  }, [transcript]);

  // Load dataset on component mount
  useEffect(() => {
    loadDataset();
  }, []);

  const loadDataset = async () => {
    try {
      console.log('Loading dataset...');
      // Load disease data
      const diseaseResponse = await fetch('/dataset.csv');
      console.log('Disease response status:', diseaseResponse.status);
      const diseaseText = await diseaseResponse.text();
      const diseaseRows = diseaseText.split('\n').slice(1); // Skip header
      
      const parsedDiseaseData: DiseaseData[] = diseaseRows
        .filter(row => row.trim())
        .map(row => {
          const columns = row.split(',');
          return {
            Disease: columns[0]?.trim() || '',
            Symptom_1: columns[1]?.trim() || '',
            Symptom_2: columns[2]?.trim() || '',
            Symptom_3: columns[3]?.trim() || '',
            Symptom_4: columns[4]?.trim() || '',
            Symptom_5: columns[5]?.trim() || '',
            Symptom_6: columns[6]?.trim() || '',
            Symptom_7: columns[7]?.trim() || '',
            Symptom_8: columns[8]?.trim() || '',
            Symptom_9: columns[9]?.trim() || '',
            Symptom_10: columns[10]?.trim() || '',
            Symptom_11: columns[11]?.trim() || '',
            Symptom_12: columns[12]?.trim() || '',
            Symptom_13: columns[13]?.trim() || '',
            Symptom_14: columns[14]?.trim() || '',
            Symptom_15: columns[15]?.trim() || '',
            Symptom_16: columns[16]?.trim() || '',
            Symptom_17: columns[17]?.trim() || '',
          };
        });

      // Load disease descriptions
      const descriptionResponse = await fetch('/symptom_Description.csv');
      const descriptionText = await descriptionResponse.text();
      const descriptionRows = descriptionText.split('\n').slice(1); // Skip header
      
      const parsedDescriptions: DiseaseDescription[] = descriptionRows
        .filter(row => row.trim())
        .map(row => {
          const columns = row.split(',');
          return {
            Disease: columns[0]?.trim() || '',
            Description: columns[1]?.trim() || '',
          };
        });

      setDiseaseData(parsedDiseaseData);
      setDiseaseDescriptions(parsedDescriptions);
      setIsDataLoaded(true);
      
      toast({
        title: "Dataset Loaded",
        description: `Loaded ${parsedDiseaseData.length} disease records and ${parsedDescriptions.length} descriptions.`,
        style: { background: '#4CAF50', color: '#FFFFFF' } // Success Green
      });
    } catch (error) {
      console.error('Error loading dataset:', error);
      toast({
        title: "Dataset Error",
        description: "Failed to load disease dataset. Please check if the dataset files are available.",
        variant: "destructive",
        style: { background: '#E53935', color: '#FFFFFF' } // Warning/Alert Red
      });
    }
  };

  const predictDisease = () => {
    if (!symptoms.trim()) {
      toast({
        title: "No Symptoms",
        description: "Please enter symptoms to predict disease.",
        variant: "destructive",
        style: { background: '#E53937', color: '#FFFFFF' } // Warning/Alert Red
      });
      return;
    }

    setIsLoading(true);
    
    // Normalize input symptoms
    const inputSymptoms = symptoms.toLowerCase().split(',').map(s => s.trim());
    
    // Calculate disease probabilities
    const diseaseScores: { [key: string]: { matches: string[], score: number } } = {};
    
    diseaseData.forEach(record => {
      const recordSymptoms = [
        record.Symptom_1, record.Symptom_2, record.Symptom_3, record.Symptom_4,
        record.Symptom_5, record.Symptom_6, record.Symptom_7, record.Symptom_8,
        record.Symptom_9, record.Symptom_10, record.Symptom_11, record.Symptom_12,
        record.Symptom_13, record.Symptom_14, record.Symptom_15, record.Symptom_16,
        record.Symptom_17
      ].filter(s => s && s.trim());
      
      const matchingSymptoms = inputSymptoms.filter(inputSymptom =>
        recordSymptoms.some(recordSymptom =>
          recordSymptom.toLowerCase().includes(inputSymptom) ||
          inputSymptom.includes(recordSymptom.toLowerCase())
        )
      );
      
      if (matchingSymptoms.length > 0) {
        const score = (matchingSymptoms.length / inputSymptoms.length) * 100;
        if (!diseaseScores[record.Disease]) {
          diseaseScores[record.Disease] = { matches: [], score: 0 };
        }
        diseaseScores[record.Disease].matches.push(...matchingSymptoms);
        diseaseScores[record.Disease].score = Math.max(diseaseScores[record.Disease].score, score);
      }
    });
    
    // Convert to results array and sort by confidence
    const results: PredictionResult[] = Object.entries(diseaseScores)
      .map(([disease, data]) => {
        const description = diseaseDescriptions.find(d => d.Disease === disease)?.Description || 'No description available.';
        return {
          disease,
          confidence: Math.round(data.score),
          matchingSymptoms: [...new Set(data.matches)], // Remove duplicates
          description
        };
      })
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5); // Top 5 predictions
    
    setPredictions(results);
    setSelectedSymptoms(inputSymptoms); // Update selected symptoms
    setIsLoading(false);
    
    if (results.length > 0) {
      toast({
        title: "Prediction Complete",
        description: `Found ${results.length} potential diseases with highest confidence: ${results[0].confidence}%`,
        style: { background: '#4CAF50', color: '#FFFFFF' } // Success Green
      });
    } else {
      toast({
        title: "No Matches",
        description: "No diseases found matching the provided symptoms.",
        variant: "destructive",
        style: { background: '#E53935', color: '#FFFFFF' } // Warning/Alert Red
      });
    }
  };

  const clearResults = () => {
    setPredictions([]);
    setSymptoms('');
    setSelectedSymptoms([]);
    resetTranscript();
  };

  const removeSymptom = (symptomToRemove: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptomToRemove));
    setSymptoms(selectedSymptoms.filter(s => s !== symptomToRemove).join(', '));
  };

  const toggleVoiceInput = async () => {
    try {
      if (isListening) {
        stopListening();
        toast({
          title: "Voice Input Stopped",
          description: "Voice recording has been stopped.",
          style: { background: '#4CAF50', color: '#FFFFFF' } // Success Green
        });
      } else {
        await startListening();
        toast({
          title: "Voice Input Started",
          description: "Start describing your symptoms. Click the microphone again to stop.",
          style: { background: '#00ACC1', color: '#FFFFFF' } // Info Cyan
        });
      }
    } catch (error) {
      console.error('Voice input error:', error);
      toast({
        title: "Voice Input Error",
        description: "Unable to start voice input. Please check your microphone permissions.",
        variant: "destructive",
        style: { background: '#E53935', color: '#FFFFFF' } // Warning/Alert Red
      });
    }
  };

  return (
    <Card className="shadow-xl border-[#E0E0E0] bg-[#FFFFFF] rounded-2xl">
      <CardHeader className="bg-[#F5F9FC] p-6 rounded-t-2xl">
        <CardTitle className="flex items-center space-x-2 text-[#212121]">
          <div className="p-2.5 bg-[#F5F9FC] rounded-lg">
            <Search className="h-5 w-5 text-[#1E88E5]" />
          </div>
          <span className="text-lg font-semibold">Dataset Disease Predictor</span>
        </CardTitle>
        <CardDescription className="text-[#616161]">
          Enter symptoms to predict diseases using our comprehensive medical dataset (41 diseases, 132+ symptoms)
          {isSupported && (
            <span className="block text-xs text-[#1E88E5] mt-1">
              💡 Use the microphone button for voice input
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {!isDataLoaded && (
          <Alert className="border-[#E0E0E0] bg-[#F5F9FC]">
            <Loader2 className="h-4 w-4 animate-spin text-[#1E88E5]" />
            <AlertDescription className="text-[#616161]">
              Loading disease dataset...
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#212121]">
            Enter Symptoms
          </label>
          <div className="flex space-x-3">
            <Input
              placeholder="e.g., fever, cough, headache, fatigue"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="flex-1 bg-[#F5F9FC] border-[#E0E0E0] focus:ring-2 focus:ring-[#1E88E5] text-[#212121] rounded-lg"
            />
            {isSupported && (
              <Button
                onClick={toggleVoiceInput}
                variant={isListening ? "destructive" : "outline"}
                size="icon"
                className={`h-[40px] w-[40px] rounded-lg shadow-sm ${isListening ? 'bg-[#E53935] hover:bg-[#E53935]/90 text-[#FFFFFF]' : 'border-[#E0E0E0] text-[#1E88E5] hover:bg-[#F5F9FC]'}`}
              >
                {isListening ? (
                  <MicOff className="h-5 w-5 animate-pulse" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
          <p className="text-xs text-[#616161]">
            Type symptoms separated by commas. The system will match against a database of 41 diseases.
          </p>
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

        {/* Selected Symptoms Display */}
        {selectedSymptoms.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#212121]">
              Selected Symptoms:
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map((symptom, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="py-1 px-3 bg-[#F5F9FC] text-[#212121] border-[#E0E0E0]"
                >
                  {symptom}
                  <button
                    onClick={() => removeSymptom(symptom)}
                    className="ml-2 text-[#616161] hover:text-[#E53935]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <Button
            onClick={predictDisease}
            variant="default"
            className="flex-1 bg-blue-400 text-black border-blue-400 hover:bg-blue-400 active:bg-blue-400 focus:bg-blue-400 rounded-lg shadow-sm"
            disabled={!isDataLoaded || isLoading || !symptoms.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Predict Disease
              </>
            )}
          </Button>
          {predictions.length > 0 && (
            <Button
              onClick={clearResults}
              variant="outline"
              size="sm"
              className="border-blue-400 text-black hover:bg-blue-400 hover:text-black active:bg-blue-400 focus:bg-blue-400 rounded-lg shadow-sm"
            >
              Clear
            </Button>
          )}
        </div>

        {predictions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-[#4CAF50]" />
              <h4 className="font-medium text-[#212121]">Prediction Results</h4>
            </div>
            
            <div className="space-y-3">
              {predictions.map((prediction, index) => (
                <Card key={index} className="p-4 border-l-4 border-l-[#1E88E5] bg-[#FFFFFF] shadow-sm rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="font-semibold text-[#212121]">
                        {prediction.disease}
                      </h5>
                      <Badge 
                        variant={prediction.confidence > 70 ? "default" : "outline"}
                        className={`mt-1 ${prediction.confidence > 70 ? 'bg-[#1E88E5] text-[#FFFFFF]' : 'bg-[#F5F9FC] text-[#616161] border-[#E0E0E0]'}`}
                      >
                        {prediction.confidence}% Confidence
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-[#616161] mb-3">
                    {prediction.description}
                  </p>
                  
                  {prediction.matchingSymptoms.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-[#212121] mb-1">
                        Matching Symptoms:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {prediction.matchingSymptoms.map((symptom, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-[#F5F9FC] text-[#616161] border-[#E0E0E0]">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {isDataLoaded && (
          <Alert className="border-[#E0E0E0] bg-[#F5F9FC]">
            <Info className="h-4 w-4 text-[#00ACC1]" />
            <AlertDescription className="text-[#616161]">
              Dataset contains 41 diseases with symptom mappings. 
              This is for educational purposes only and should not replace professional medical advice.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};