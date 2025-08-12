import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { onAuthStateChange, logOut } from '@/lib/auth';
import { DiagnosisForm } from '@/components/DiagnosisForm';
import { ChatSection } from '@/components/ChatSection';
import { DiagnosisHistory } from '@/components/DiagnosisHistory';
import { DiseasePredictionInput } from '@/components/DiseasePredictionInput';
import { 
  LogOut, 
  User,
  Stethoscope, 
  Shield, 
  Activity,
  Menu,
  X,
  Info
} from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDiagnosis, setCurrentDiagnosis] = useState(null);
  const [activeTab, setActiveTab] = useState('diagnosis');
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
        description: "You have been successfully logged out",
        style: { background: '#4CAF50', color: '#FFFFFF' }
      });
      navigate('/auth');
    } else {
      toast({
        title: "Logout Failed",
        description: result.error,
        variant: "destructive",
        style: { background: '#E53935', color: '#FFFFFF' }
      });
    }
  };

  const handleDiagnosisComplete = (diagnosis) => {
    setCurrentDiagnosis(diagnosis);
    toast({
      title: "Diagnosis Complete",
      description: "Your diagnosis has been saved to your history",
      style: { background: '#4CAF50', color: '#FFFFFF' }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F9FC] via-[#FFFFFF] to-[#F5F9FC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E88E5] mx-auto mb-4"></div>
          <p className="text-[#616161]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F9FC] via-[#FFFFFF] to-[#F5F9FC]">
      {/* Header */}
      <header className="bg-[#000000] shadow-sm border-b-[#E0E0E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-10 w-10 text-[#43A047]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#FFFFFF]">MediMind</h1>
                <p className="text-xs font-bold text-[#B0B0B0]">AI-Powered Healthcare</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-8sm text-[#B0B0B0]">
                <User className="h-5 w-6 font-bold text-[#1E88E5]" />
                <span>{user?.email}</span>
              </div>
              <Button
                onClick={() => navigate('/about')}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 bg-[#FFFFFF] text-[#212121] border-[#E0E0E0] hover:bg-[#FFFFFF] hover:text-[#212121] active:bg-[#FFFFFF] focus:bg-[#FFFFFF] transition-none"
              >
                <Info className="h-6 w-6" />
                <span>About</span>
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 bg-[#FFFFFF] text-[#212121] border-[#E0E0E0] hover:bg-[#FFFFFF] hover:text-[#212121] active:bg-[#FFFFFF] focus:bg-[#FFFFFF] transition-none"
              >
                <LogOut className="h-6 w-6" />
                <span>Logout</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="bg-[#FFFFFF] text-[#212121] border-[#E0E0E0] hover:bg-[#FFFFFF] hover:text-[#212121] active:bg-[#FFFFFF] focus:bg-[#FFFFFF] transition-none"
              >
                {isMobileMenuOpen ? <X className="h-4 w-4 text-[#1E88E5]" /> : <Menu className="h-4 w-4 text-[#1E88E5]" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t-[#E0E0E0] bg-[#000000]">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2 text-sm text-[#B0B0B0]">
                  <User className="h-4 w-4 text-[#1E88E5]" />
                  <span>{user?.email}</span>
                </div>
                <Button
                  onClick={() => navigate('/about')}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 bg-[#FFFFFF] text-[#212121] border-[#E0E0E0] hover:bg-[#FFFFFF] hover:text-[#212121] active:bg-[#FFFFFF] focus:bg-[#FFFFFF] transition-none"
                >
                  <Info className="h-4 w-4 text-[#1E88E5]" />
                  <span>About</span>
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 bg-[#FFFFFF] text-[#212121] border-[#E0E0E0] hover:bg-[#FFFFFF] hover:text-[#212121] active:bg-[#FFFFFF] focus:bg-[#FFFFFF] transition-none"
                >
                  <LogOut className="h-4 w-4 text-[#1E88E5]" />
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
            <div className="flex space-x-1 bg-[#F5F9FC] p-1 rounded-lg">
              <Button
                variant={activeTab === 'diagnosis' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('diagnosis')}
                className={`flex-1 ${activeTab === 'diagnosis' ? 'bg-[#1E88E5] text-[#FFFFFF]' : 'text-[#212121] hover:bg-[#E0E0E0]'}`}
              >
                <Activity className="h-4 w-4 mr-2 text-[#43A047]" />
                New Diagnosis
              </Button>
              <Button
                variant={activeTab === 'history' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('history')}
                className={`flex-1 ${activeTab === 'history' ? 'bg-[#1E88E5] text-[#FFFFFF]' : 'text-[#212121] hover:bg-[#E0E0E0]'}`}
              >
                <Shield className="h-4 w-4 mr-2 text-[#43A047]" />
                History
              </Button>
            </div>

            {/* Tab Content */}
            <div className="h-full overflow-y-auto">
              {activeTab === 'diagnosis' ? (
                <div className="space-y-6">
                  <DiagnosisForm 
                    userId={user?.uid} 
                    onDiagnosisComplete={handleDiagnosisComplete}
                  />
                  <DiseasePredictionInput />
                </div>
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
      </main>
    </div>
  );
};

export default Dashboard;