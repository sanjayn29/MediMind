import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getDiagnosisHistory } from '@/lib/firestore';
import { History, Calendar, AlertTriangle, CheckCircle, Clock, Loader2, PlusCircle } from 'lucide-react';

interface DiagnosisRecord {
  id: string;
  symptoms: string[];
  diagnoses: any[];
  riskLevel: string;
  recommendations: string[];
  confidenceScore: number;
  timestamp: Date;
}

interface DiagnosisHistoryProps {
  userId: string;
}

export const DiagnosisHistory = ({ userId }: DiagnosisHistoryProps) => {
  const [diagnoses, setDiagnoses] = useState<DiagnosisRecord[]>([]);
  const [visibleDiagnoses, setVisibleDiagnoses] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDiagnosisHistory();
  }, [userId]);

  const loadDiagnosisHistory = async () => {
    setIsLoading(true);
    try {
      const result = await getDiagnosisHistory(userId);
      if (result.success) {
        setDiagnoses(result.diagnoses);
      } else {
        toast({
          title: "Failed to Load History",
          description: result.error,
          variant: "destructive",
          style: { background: '#F3F4F6', color: '#000000' } // Light Gray (bg-gray-100)
        });
      }
    } catch (error) {
      console.error('Error loading diagnosis history:', error);
      toast({
        title: "Error",
        description: "Failed to load diagnosis history",
        variant: "destructive",
        style: { background: '#F3F4F6', color: '#000000' } // Light Gray (bg-gray-100)
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    setVisibleDiagnoses((prev) => prev + 3);
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'critical':
        return 'bg-blue-300 text-black border-blue-800/50';
      case 'high':
        return 'bg-blue-300/50 text-black border-blue-800/50';
      case 'medium':
        return 'bg-green-300/50 text-black border-green-800/50';
      case 'low':
        return 'bg-green-300/20 text-black border-green-800/30';
      default:
        return 'bg-gray-50 text-gray-600 border-blue-800/50';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-black" />;
      case 'medium':
      case 'low':
        return <CheckCircle className="h-4 w-4 text-black" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <Card className="shadow-xl border-blue-800/50 bg-white rounded-2xl">
        <CardHeader className="bg-black rounded-t-2xl">
          <CardTitle className="flex items-center space-x-2 text-white font-bold">
            <div className="p-2.5 bg-black rounded-lg">
              <History className="h-5 w-5 text-blue-300" />
            </div>
            <span className="text-lg font-bold">Diagnosis History</span>
          </CardTitle>
          <CardDescription className="text-white font-bold">
            Your previous diagnoses and medical consultations
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin text-blue-300" />
            <span className="text-base">Loading history...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-blue-800/50 bg-white rounded-2xl">
      <CardHeader className="bg-black rounded-t-2xl">
        <CardTitle className="flex items-center space-x-2 text-white font-bold">
          <div className="p-2.5 bg-black rounded-lg">
            <History className="h-5 w-5 text-blue-300" />
          </div>
          <span className="text-lg font-bold">Diagnosis History</span>
        </CardTitle>
        <CardDescription className="text-white font-bold">
          Your previous diagnoses and medical consultations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {diagnoses.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <History className="h-12 w-12 mx-auto mb-4 text-blue-300 opacity-70" />
            <p className="font-medium text-gray-900 text-base">No diagnosis history</p>
            <p className="text-sm mt-2">Your diagnoses will appear here after you complete your first assessment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {diagnoses.slice(0, visibleDiagnoses).map((diagnosis) => (
              <div
                key={diagnosis.id}
                className="border border-blue-800/50 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 bg-white"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">
                      {formatDate(diagnosis.timestamp)}
                    </span>
                  </div>
                  <Badge className={getRiskLevelColor(diagnosis.riskLevel)}>
                    <div className="flex items-center space-x-1">
                      {getRiskIcon(diagnosis.riskLevel)}
                      <span>{diagnosis.riskLevel}</span>
                    </div>
                  </Badge>
                </div>

                {/* Symptoms */}
                <div className="mb-3">
                  <h4 className="font-medium text-sm text-gray-900 mb-2">Symptoms:</h4>
                  <div className="flex flex-wrap gap-1">
                    {diagnosis.symptoms.map((symptom, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-white text-gray-900 border-blue-800/50">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Diagnoses */}
                <div className="mb-3">
                  <h4 className="font-medium text-sm text-gray-900 mb-2">Diagnoses:</h4>
                  <div className="space-y-2">
                    {diagnosis.diagnoses.slice(0, 3).map((diag, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg border-blue-800/50">
                        <span className="text-sm font-medium text-gray-900">{diag.name}</span>
                        <Badge variant="outline" className="text-xs bg-white text-gray-600 border-blue-800/50">
                          {diag.probability}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                {diagnosis.recommendations.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Recommendations:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {diagnosis.recommendations.slice(0, 2).map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-green-300 mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Confidence Score */}
                <div className="flex items-center justify-between pt-2 border-t border-blue-800/50">
                  <span className="text-xs text-gray-600">Confidence Score</span>
                  <Badge variant="outline" className="text-xs bg-white text-gray-600 border-blue-800/50">
                    {diagnosis.confidenceScore.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {diagnoses.length > visibleDiagnoses && (
          <Button
            onClick={handleLoadMore}
            className="w-full bg-blue-300 text-black hover:bg-blue-400 rounded-lg shadow-sm"
          >
            Load More
          </Button>
        )}
      </CardContent>
    </Card>
  );
};