import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { onAuthStateChange, logOut } from '@/lib/auth';
import { DiagnosisForm } from '@/components/DiagnosisForm';
import { ChatSection } from '@/components/ChatSection';
import { DiagnosisHistory } from '@/components/DiagnosisHistory';
import { 
  LogOut, 
  User, 
  Heart, 
  Stethoscope, 
  Shield, 
  Activity,
  Menu,
  X
} from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDiagnosis, setCurrentDiagnosis] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'history'>('diagnosis');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        setUser(user);
      } else {
        navigate('/auth');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    const result = await logOut();
    if (result.success) {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out"
      });
      navigate('/auth');
    }
  };

  const handleDiagnosisComplete = (diagnosis: any) => {
    setCurrentDiagnosis(diagnosis);
    toast({
      title: "Diagnosis Complete",
      description: "Your diagnosis has been saved to your history"
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-blue-600" />
                <Stethoscope className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Medical Diagnosis Assistant</h1>
                <p className="text-xs text-gray-500">AI-Powered Healthcare</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {/* Left Column - Diagnosis Form & History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <Button
                variant={activeTab === 'diagnosis' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('diagnosis')}
                className="flex-1"
              >
                <Activity className="h-4 w-4 mr-2" />
                New Diagnosis
              </Button>
              <Button
                variant={activeTab === 'history' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('history')}
                className="flex-1"
              >
                <Shield className="h-4 w-4 mr-2" />
                History
              </Button>
            </div>

            {/* Tab Content */}
            <div className="h-full">
              {activeTab === 'diagnosis' ? (
                <DiagnosisForm 
                  userId={user?.uid} 
                  onDiagnosisComplete={handleDiagnosisComplete}
                />
              ) : (
                <DiagnosisHistory userId={user?.uid} />
              )}
            </div>
          </div>

          {/* Right Column - Chat Section */}
          <div className="lg:col-span-1">
            <ChatSection />
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>AI Assistant Ready • Secure Connection • HIPAA Compliant</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 