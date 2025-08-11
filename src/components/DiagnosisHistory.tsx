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
          variant: "destructive",
          style: { background: '#E53935', color: '#FFFFFF' } // Warning/Alert Red
        });
      }
    } catch (error) {
      console.error('Error loading diagnosis history:', error);
      toast({
        title: "Error",
        description: "Failed to load diagnosis history",
        variant: "destructive",
        style: { background: '#E53935', color: '#FFFFFF' } // Warning/Alert Red
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'critical':
        return 'bg-[#E53935] text-[#FFFFFF] border-[#E53935]/50'; // Warning/Alert Red
      case 'high':
        return 'bg-[#FF8A65] text-[#FFFFFF] border-[#FF8A65]/50'; // Lighter red-orange for high risk
      case 'medium':
        return 'bg-[#4CAF50]/20 text-[#4CAF50] border-[#4CAF50]/50'; // Success Green (lighter)
      case 'low':
        return 'bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/30'; // Success Green (very light)
      default:
        return 'bg-[#F5F9FC] text-[#616161] border-[#E0E0E0]'; // Light Background
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
      <Card className="shadow-xl border-[#E0E0E0] bg-[#FFFFFF] rounded-2xl">
        <CardHeader className="bg-[#F5F9FC] rounded-t-2xl">
          <CardTitle className="flex items-center space-x-2 text-[#212121]">
            <div className="p-2.5 bg-[#F5F9FC] rounded-lg">
              <History className="h-5 w-5 text-[#1E88E5]" />
            </div>
            <span className="text-lg font-semibold">Diagnosis History</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2 text-[#616161]">
            <Loader2 className="h-5 w-5 animate-spin text-[#1E88E5]" />
            <span className="text-base">Loading history...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-[#E0E0E0] bg-[#FFFFFF] rounded-2xl">
      <CardHeader className="bg-[#F5F9FC] rounded-t-2xl">
        <CardTitle className="flex items-center space-x-2 text-[#212121]">
          <div className="p-2.5 bg-[#F5F9FC] rounded-lg">
            <History className="h-5 w-5 text-[#1E88E5]" />
          </div>
          <span className="text-lg font-semibold">Diagnosis History</span>
        </CardTitle>
        <CardDescription className="text-[#616161]">
          Your previous diagnoses and medical consultations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {diagnoses.length === 0 ? (
          <div className="text-center py-8 text-[#616161]">
            <History className="h-12 w-12 mx-auto mb-4 text-[#1E88E5] opacity-70" />
            <p className="font-medium text-[#212121] text-base">No diagnosis history</p>
            <p className="text-sm mt-2">Your diagnoses will appear here after you complete your first assessment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {diagnoses.map((diagnosis) => (
              <div
                key={diagnosis.id}
                className="border border-[#E0E0E0] rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-[#616161]" />
                    <span className="text-sm text-[#616161]">
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
                  <h4 className="font-medium text-sm text-[#212121] mb-2">Symptoms:</h4>
                  <div className="flex flex-wrap gap-1">
                    {diagnosis.symptoms.map((symptom, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-[#F5F9FC] text-[#212121] border-[#E0E0E0]">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Diagnoses */}
                <div className="mb-3">
                  <h4 className="font-medium text-sm text-[#212121] mb-2">Diagnoses:</h4>
                  <div className="space-y-2">
                    {diagnosis.diagnoses.slice(0, 3).map((diag, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-[#F5F9FC] rounded-lg border-[#E0E0E0]">
                        <span className="text-sm font-medium text-[#212121]">{diag.name}</span>
                        <Badge variant="outline" className="text-xs bg-[#F5F9FC] text-[#616161] border-[#E0E0E0]">
                          {diag.probability}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                {diagnosis.recommendations.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-medium text-sm text-[#212121] mb-2">Recommendations:</h4>
                    <ul className="text-sm text-[#616161] space-y-1">
                      {diagnosis.recommendations.slice(0, 2).map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-[#4CAF50] mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Confidence Score */}
                <div className="flex items-center justify-between pt-2 border-t border-[#E0E0E0]">
                  <span className="text-xs text-[#616161]">Confidence Score</span>
                  <Badge variant="outline" className="text-xs bg-[#F5F9FC] text-[#616161] border-[#E0E0E0]">
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
            className="w-full border-[#E0E0E0] text-[#1E88E5] hover:bg-[#F5F9FC] hover:text-[#43A047] rounded-lg shadow-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin text-[#1E88E5]" />
                Refreshing...
              </>
            ) : (
              <>
                <History className="h-4 w-4 mr-2 text-[#1E88E5]" />
                Refresh History
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};