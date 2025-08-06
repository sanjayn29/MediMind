import { useState, useEffect } from 'react';
import { Search, AlertCircle, CheckCircle, Info, Loader2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { SymptomSuggestions } from './SymptomSuggestions';

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

export const DiseasePredictor = () => {
  const [symptoms, setSymptoms] = useState<string>('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [diseaseData, setDiseaseData] = useState<DiseaseData[]>([]);
  const [diseaseDescriptions, setDiseaseDescriptions] = useState<DiseaseDescription[]>([]);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { toast } = useToast();

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
        description: `Loaded ${parsedDiseaseData.length} disease records and ${parsedDescriptions.length} descriptions.`
      });
    } catch (error) {
      console.error('Error loading dataset:', error);
      toast({
        title: "Dataset Error",
        description: "Failed to load disease dataset. Please check if the dataset files are available.",
        variant: "destructive"
      });
    }
  };

  const predictDisease = () => {
    if (!symptoms.trim()) {
      toast({
        title: "No Symptoms",
        description: "Please enter symptoms to predict disease.",
        variant: "destructive"
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
    setIsLoading(false);
    
    if (results.length > 0) {
      toast({
        title: "Prediction Complete",
        description: `Found ${results.length} potential diseases with highest confidence: ${results[0].confidence}%`
      });
    } else {
      toast({
        title: "No Matches",
        description: "No diseases found matching the provided symptoms.",
        variant: "destructive"
      });
    }
  };

  const clearResults = () => {
    setPredictions([]);
    setSymptoms('');
    setSelectedSymptoms([]);
  };

  const handleSymptomSelect = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
      setSymptoms(prev => prev ? `${prev}, ${symptom}` : symptom);
    }
  };

  const removeSymptom = (symptomToRemove: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptomToRemove));
    setSymptoms(selectedSymptoms.filter(s => s !== symptomToRemove).join(', '));
  };

  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-primary rounded-lg">
          <Search className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Disease Predictor</h3>
          <p className="text-sm text-muted-foreground">Enter symptoms to predict possible diseases</p>
        </div>
      </div>

      {!isDataLoaded && (
        <Alert className="mb-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            Loading disease dataset...
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Enter Symptoms
          </label>
          <Input
            placeholder="e.g., fever, cough, headache, fatigue"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="bg-muted/50"
          />
          <p className="text-xs text-muted-foreground">
            Type symptoms or use the symptom browser below. The system will match against a database of 41 diseases.
          </p>
        </div>

        {/* Symptom Suggestions */}
        <SymptomSuggestions onSymptomSelect={handleSymptomSelect} />

        {/* Selected Symptoms Display */}
        {selectedSymptoms.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Selected Symptoms:
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map((symptom, index) => (
                <Badge
                  key={index}
                  variant="default"
                  className="py-1 px-3 bg-primary/10 border-primary/20"
                >
                  {symptom}
                  <button
                    onClick={() => removeSymptom(symptom)}
                    className="ml-2 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Button
            onClick={predictDisease}
            variant="medical"
            className="flex-1"
            disabled={!isDataLoaded || isLoading || !symptoms.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            {isLoading ? 'Analyzing...' : 'Predict Disease'}
          </Button>
          {predictions.length > 0 && (
            <Button
              onClick={clearResults}
              variant="outline"
              size="sm"
            >
              Clear
            </Button>
          )}
        </div>

        {predictions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <h4 className="font-medium text-foreground">Prediction Results</h4>
            </div>
            
            <div className="space-y-3">
              {predictions.map((prediction, index) => (
                <Card key={index} className="p-4 border-l-4 border-l-primary">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="font-semibold text-foreground">
                        {prediction.disease}
                      </h5>
                      <Badge 
                        variant={prediction.confidence > 70 ? "default" : "secondary"}
                        className="mt-1"
                      >
                        {prediction.confidence}% Confidence
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {prediction.description}
                  </p>
                  
                  {prediction.matchingSymptoms.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-foreground mb-1">
                        Matching Symptoms:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {prediction.matchingSymptoms.map((symptom, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
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
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Dataset contains 41 diseases with symptom mappings. 
              This is for educational purposes only and should not replace professional medical advice.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
}; 