import { useState } from 'react';
import { MessageSquare, Mic, Send, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export const SymptomCollector = () => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const addSymptom = () => {
    if (currentSymptom.trim()) {
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

  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-primary rounded-lg">
          <MessageSquare className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Symptom Collector Agent</h3>
          <p className="text-sm text-muted-foreground">Collect symptoms from patient chat or voice input</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-2">
          <Textarea
            placeholder="Describe patient symptoms (e.g., 'Severe headache for 3 days, nausea, sensitivity to light')"
            value={currentSymptom}
            onChange={(e) => setCurrentSymptom(e.target.value)}
            className="flex-1 min-h-[80px] bg-muted/50"
          />
          <div className="flex flex-col space-y-2">
            <Button
              onClick={addSymptom}
              variant="medical"
              size="icon"
              disabled={!currentSymptom.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              onClick={toggleVoiceRecording}
              variant={isListening ? "warning" : "accent"}
              size="icon"
            >
              <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
            </Button>
          </div>
        </div>

        {symptoms.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Recorded Symptoms:</h4>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((symptom, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="py-1 px-3 bg-secondary/50 border-primary/20"
                >
                  {symptom}
                  <button
                    onClick={() => removeSymptom(index)}
                    className="ml-2 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Button variant="medical" className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Process Symptoms ({symptoms.length})
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};