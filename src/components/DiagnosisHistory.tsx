import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getDiagnosisHistory } from '@/lib/firestore';
import { History, Calendar, AlertTriangle, CheckCircle, Clock, Loader2 } from 'lucide-react';

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
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading diagnosis history:', error);
      toast({
        title: "Error",
        description: "Failed to load diagnosis history",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
      case 'low':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <History className="h-5 w-5 text-green-600" />
            </div>
            <span>Diagnosis History</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-green-600" />
            <span>Loading history...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="p-2 bg-green-100 rounded-lg">
            <History className="h-5 w-5 text-green-600" />
          </div>
          <span>Diagnosis History</span>
        </CardTitle>
        <CardDescription>
          Your previous diagnoses and medical consultations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {diagnoses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No diagnosis history</p>
            <p className="text-sm mt-2">Your diagnoses will appear here after you complete your first assessment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {diagnoses.map((diagnosis) => (
              <div
                key={diagnosis.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
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
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Symptoms:</h4>
                  <div className="flex flex-wrap gap-1">
                    {diagnosis.symptoms.map((symptom, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Diagnoses */}
                <div className="mb-3">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Diagnoses:</h4>
                  <div className="space-y-2">
                    {diagnosis.diagnoses.slice(0, 3).map((diag, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{diag.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {diag.probability}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                {diagnosis.recommendations.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Recommendations:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {diagnosis.recommendations.slice(0, 2).map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Confidence Score */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-gray-500">Confidence Score</span>
                  <Badge variant="outline" className="text-xs">
                    {diagnosis.confidenceScore.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {diagnoses.length > 0 && (
          <Button
            onClick={loadDiagnosisHistory}
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <History className="h-4 w-4 mr-2" />
                Refresh History
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}; 