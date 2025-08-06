import { useState, useEffect } from 'react';
import { Search, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SymptomSuggestionsProps {
  onSymptomSelect: (symptom: string) => void;
}

export const SymptomSuggestions = ({ onSymptomSelect }: SymptomSuggestionsProps) => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [filteredSymptoms, setFilteredSymptoms] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSymptoms();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = symptoms.filter(symptom =>
        symptom.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSymptoms(filtered);
    } else {
      setFilteredSymptoms(symptoms);
    }
  }, [searchTerm, symptoms]);

  const loadSymptoms = async () => {
    try {
      const response = await fetch('/dataset.csv');
      const text = await response.text();
      const rows = text.split('\n').slice(1); // Skip header
      
      const allSymptoms = new Set<string>();
      
      rows.forEach(row => {
        if (row.trim()) {
          const columns = row.split(',');
          // Extract symptoms from columns 1-17
          for (let i = 1; i <= 17; i++) {
            const symptom = columns[i]?.trim();
            if (symptom && symptom !== '') {
              allSymptoms.add(symptom);
            }
          }
        }
      });
      
      const sortedSymptoms = Array.from(allSymptoms).sort();
      setSymptoms(sortedSymptoms);
      setFilteredSymptoms(sortedSymptoms);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading symptoms:', error);
      setIsLoading(false);
    }
  };

  const handleSymptomClick = (symptom: string) => {
    onSymptomSelect(symptom);
  };

  return (
    <Card className="p-4 shadow-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <span>Browse Available Symptoms</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {symptoms.length} symptoms available
            </span>
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {isLoading ? (
              <div className="text-center py-4 text-muted-foreground">
                Loading symptoms...
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {filteredSymptoms.slice(0, 100).map((symptom, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => handleSymptomClick(symptom)}
                    >
                      {symptom}
                    </Badge>
                  ))}
                  {filteredSymptoms.length > 100 && (
                    <Badge variant="secondary" className="text-xs">
                      +{filteredSymptoms.length - 100} more
                    </Badge>
                  )}
                </div>
                
                {filteredSymptoms.length === 0 && searchTerm && (
                  <div className="text-center py-4 text-muted-foreground">
                    No symptoms found matching "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}; 