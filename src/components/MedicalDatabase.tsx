import { useState } from 'react';
import { Database, Search, BookOpen, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface DatabaseResult {
  id: string;
  name: string;
  category: string;
  relevance: number;
  description: string;
}

export const MedicalDatabase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<DatabaseResult[]>([
    {
      id: '1',
      name: 'Migraine with Aura',
      category: 'Neurological',
      relevance: 92,
      description: 'Recurrent headache disorder with visual or sensory disturbances'
    },
    {
      id: '2',
      name: 'Tension-Type Headache',
      category: 'Neurological',
      relevance: 78,
      description: 'Most common primary headache disorder'
    },
    {
      id: '3',
      name: 'Cluster Headache',
      category: 'Neurological',
      relevance: 65,
      description: 'Severe unilateral headache with autonomic symptoms'
    }
  ]);

  const searchDatabase = async () => {
    setIsSearching(true);
    // Simulate database search
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Neurological': 'bg-blue-100 text-blue-800',
      'Cardiovascular': 'bg-red-100 text-red-800',
      'Respiratory': 'bg-green-100 text-green-800',
      'Gastrointestinal': 'bg-yellow-100 text-yellow-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-accent rounded-lg">
          <Database className="h-5 w-5 text-accent-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Medical Database Agent</h3>
          <p className="text-sm text-muted-foreground">Query comprehensive disease databases and medical literature</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Search medical conditions, symptoms, or diseases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-muted/50"
          />
          <Button
            onClick={searchDatabase}
            variant="accent"
            disabled={isSearching}
          >
            <Search className="h-4 w-4 mr-2" />
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-3 w-3 mr-1" />
            ICD-10
          </Button>
          <Button variant="outline" size="sm">
            <BookOpen className="h-3 w-3 mr-1" />
            Guidelines
          </Button>
        </div>

        {isSearching && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Searching medical databases...</p>
            <Progress value={65} className="w-full" />
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Database Results:</h4>
          {results.map((result) => (
            <div
              key={result.id}
              className="p-4 border border-border rounded-lg bg-card hover:shadow-card transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h5 className="font-medium text-foreground">{result.name}</h5>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{result.relevance}% match</span>
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${result.relevance}%` }}
                    />
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{result.description}</p>
              <Badge className={getCategoryColor(result.category)}>
                {result.category}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};