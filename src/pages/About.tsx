import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Heart, 
  Stethoscope, 
  Brain, 
  Shield, 
  MessageSquare, 
  Database, 
  TrendingUp,
  Zap,
  Lock,
  Users,
  Activity
} from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MessageSquare className="h-6 w-6 text-[#1E88E5]" />, // Primary Blue
      title: "Symptom Collector Agent",
      description: "Intelligent collection of patient symptoms through text and voice input with natural language processing.",
      color: "bg-[#F5F9FC] border-[#E0E0E0]" // Light Background, Light Gray
    },
    {
      icon: <Database className="h-6 w-6 text-[#43A047]" />, // Secondary Green
      title: "Medical Database Agent",
      description: "Comprehensive medical knowledge base querying for accurate disease information and symptom correlation.",
      color: "bg-[#F5F9FC] border-[#E0E0E0]" // Light Background, Light Gray
    },
    {
      icon: <Brain className="h-6 w-6 text-[#1E88E5]" />, // Primary Blue
      title: "Diagnosis Agent",
      description: "AI-powered differential diagnosis matching using advanced machine learning algorithms and medical expertise.",
      color: "bg-[#F5F9FC] border-[#E0E0E0]" // Light Background, Light Gray
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-[#43A047]" />, // Secondary Green
      title: "Risk Rank Agent",
      description: "Intelligent risk assessment and urgency ranking with personalized recommendations for next steps.",
      color: "bg-[#F5F9FC] border-[#E0E0E0]" // Light Background, Light Gray
    }
  ];

  const benefits = [
    {
      icon: <Zap className="h-5 w-5 text-[#00ACC1]" />, // Info Cyan
      title: "Instant Analysis",
      description: "Get AI-powered diagnosis results in seconds"
    },
    {
      icon: <Lock className="h-5 w-5 text-[#43A047]" />, // Secondary Green
      title: "Secure & Private",
      description: "HIPAA-compliant data protection and encryption"
    },
    {
      icon: <Users className="h-5 w-5 text-[#1E88E5]" />, // Primary Blue
      title: "User-Friendly",
      description: "Intuitive interface for both doctors and patients"
    },
    {
      icon: <Activity className="h-5 w-5 text-[#00ACC1]" />, // Info Cyan
      title: "Real-time Chat",
      description: "Interactive AI consultation with follow-up questions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F9FC] via-[#FFFFFF] to-[#F5F9FC]">
      {/* Header */}
      <header className="bg-[#FFFFFF] shadow-sm border-b-[#E0E0E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-[#1E88E5]" /> {/* Primary Blue */}
                <Stethoscope className="h-8 w-8 text-[#43A047]" /> {/* Secondary Green */}
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#212121]"> {/* Dark Gray */}
                  Medical Diagnosis Assistant
                </h1>
                <p className="text-xs text-[#616161]"> {/* Medium Gray */}
                  AI-Powered Healthcare
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="flex items-center space-x-2 border-[#E0E0E0] text-[#212121] hover:bg-[#F5F9FC]" // Light Gray, Dark Gray, Light Background
            >
              <ArrowLeft className="h-4 w-4 text-[#1E88E5]" /> {/* Primary Blue */}
              <span>Back to Dashboard</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#212121] mb-4"> {/* Dark Gray */}
            How Our AI Medical Assistant Works
          </h1>
          <p className="text-xl text-[#616161] max-w-3xl mx-auto"> {/* Medium Gray */}
            Our advanced AI system combines multiple specialized agents to provide accurate, 
            comprehensive medical diagnosis and consultation in real-time.
          </p>
        </div>

        {/* AI Agents Flow */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#212121] mb-8 text-center"> {/* Dark Gray */}
            AI Agent Architecture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className={`${feature.color} border-2 shadow-lg`}>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-3 p-3 bg-[#FFFFFF] rounded-full w-fit"> {/* White */}
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg text-[#212121]"> {/* Dark Gray */}
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-[#616161]"> {/* Medium Gray */}
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Process Flow */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#212121] mb-8 text-center"> {/* Dark Gray */}
            Diagnosis Process Flow
          </h2>
          <div className="bg-[#FFFFFF] rounded-lg shadow-lg p-8 border-[#E0E0E0]"> {/* White, Light Gray */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              <div className="text-center">
                <div className="bg-[#F5F9FC] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2"> {/* Light Background */}
                  <span className="font-bold text-[#1E88E5]">1</span> {/* Primary Blue */}
                </div>
                <p className="text-sm font-medium text-[#212121]">Symptom Input</p> {/* Dark Gray */}
                <p className="text-xs text-[#616161]">Text or voice</p> {/* Medium Gray */}
              </div>
              <div className="text-center">
                <div className="text-[#616161]">→</div> {/* Medium Gray */}
              </div>
              <div className="text-center">
                <div className="bg-[#F5F9FC] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2"> {/* Light Background */}
                  <span className="font-bold text-[#43A047]">2</span> {/* Secondary Green */}
                </div>
                <p className="text-sm font-medium text-[#212121]">AI Analysis</p> {/* Dark Gray */}
                <p className="text-xs text-[#616161]">Pattern matching</p> {/* Medium Gray */}
              </div>
              <div className="text-center">
                <div className="text-[#616161]">→</div> {/* Medium Gray */}
              </div>
              <div className="text-center">
                <div className="bg-[#F5F9FC] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2"> {/* Light Background */}
                  <span className="font-bold text-[#4CAF50]">3</span> {/* Success Green */}
                </div>
                <p className="text-sm font-medium text-[#212121]">Results</p> {/* Dark Gray */}
                <p className="text-xs text-[#616161]">Diagnosis & recommendations</p> {/* Medium Gray */}
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#212121] mb-8 text-center"> {/* Dark Gray */}
            Key Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center shadow-lg border-[#E0E0E0]"> {/* Light Gray */}
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 p-3 bg-[#F5F9FC] rounded-full w-fit"> {/* Light Background */}
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold text-[#212121] mb-2">{benefit.title}</h3> {/* Dark Gray */}
                  <p className="text-sm text-[#616161]">{benefit.description}</p> {/* Medium Gray */}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-[#F5F9FC] to-[#FFFFFF] border-[#E0E0E0] shadow-lg"> {/* Light Background, White, Light Gray */}
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-[#212121] mb-4"> {/* Dark Gray */}
                Ready to Get Started?
              </h3>
              <p className="text-[#616161] mb-6"> {/* Medium Gray */}
                Experience the future of medical diagnosis with our AI-powered assistant.
              </p>
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-[#1E88E5] hover:bg-[#43A047] px-8 py-3 text-[#FFFFFF]" // Primary Blue, Secondary Green, White
                size="lg"
              >
                Start Diagnosis
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default About;