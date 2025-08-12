import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
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
      icon: <MessageSquare className="h-6 w-6 text-black" />,
      title: "Symptom Collector Agent",
      description: "Intelligent collection of patient symptoms through text and voice input with natural language processing.",
      color: "bg-blue-300 border-blue-800"
    },
    {
      icon: <Database className="h-6 w-6 text-black" />,
      title: "Medical Database Agent",
      description: "Comprehensive medical knowledge base querying for accurate disease information and symptom correlation.",
      color: "bg-green-300 border-green-800"
    },
    {
      icon: <Brain className="h-6 w-6 text-black" />,
      title: "Diagnosis Agent",
      description: "AI-powered differential diagnosis matching using advanced machine learning algorithms and medical expertise.",
      color: "bg-blue-300 border-blue-800"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-black" />,
      title: "Risk Rank Agent",
      description: "Intelligent risk assessment and urgency ranking with personalized recommendations for next steps.",
      color: "bg-green-300 border-green-800"
    }
  ];

  const benefits = [
    {
      icon: <Zap className="h-6 w-6 text-black" />,
      title: "Instant Analysis",
      description: "Get AI-powered diagnosis results in seconds"
    },
    {
      icon: <Lock className="h-6 w-6 text-black" />,
      title: "Secure & Private",
      description: "HIPAA-compliant data protection and encryption"
    },
    {
      icon: <Users className="h-6 w-6 text-black" />,
      title: "User-Friendly",
      description: "Intuitive interface for both doctors and patients"
    },
    {
      icon: <Activity className="h-6 w-6 text-black" />,
      title: "Real-time Chat",
      description: "Interactive AI consultation with follow-up questions"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#000000] shadow-sm border-b-[#E0E0E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-10 w-10 text-[#43A047]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#FFFFFF]">MediMind</h1>
                <p className="text-xs font-bold text-[#B0B0B0]">AI-Powered Healthcare</p>
              </div>
            </div>
            <Button
  onClick={() => navigate('/dashboard')}
  variant="outline"
  className="flex items-center space-x-2 border-blue-800 bg-white text-black rounded-full hover:bg-white hover:text-black"
>
  <ArrowLeft className="h-4 w-4 text-black" />
  <span>Back to Dashboard</span>
</Button>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 animate-fade-in">How Our AI Medical Assistant Works</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our advanced AI system combines multiple specialized agents to provide accurate, 
            comprehensive medical diagnosis and consultation in real-time.
          </p>
        </div>

        {/* AI Agents Flow */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">AI Agent Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className={`${feature.color} border-2 shadow-xl rounded-xl transform hover:scale-105 hover:shadow-2xl transition-all duration-300`}>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-3 p-3 bg-white/20 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg text-black">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-black">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Process Flow */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Diagnosis Process Flow</h2>
          <div className="bg-white rounded-xl shadow-xl p-8 border border-blue-800/50">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              <div className="text-center">
                <div className="bg-blue-300 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-black">1</span>
                </div>
                <p className="text-sm font-medium text-gray-900">Symptom Input</p>
                <p className="text-xs text-gray-600">Text or voice</p>
              </div>
              <div className="text-center">
                <div className="text-black">→</div>
              </div>
              <div className="text-center">
                <div className="bg-green-300 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-black">2</span>
                </div>
                <p className="text-sm font-medium text-gray-900">AI Analysis</p>
                <p className="text-xs text-gray-600">Pattern matching</p>
              </div>
              <div className="text-center">
                <div className="text-black">→</div>
              </div>
              <div className="text-center">
                <div className="bg-blue-300 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-black">3</span>
                </div>
                <p className="text-sm font-medium text-gray-900">Results</p>
                <p className="text-xs text-gray-600">Diagnosis & recommendations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center shadow-xl border-blue-800/50 bg-white hover:bg-gray-100 transition-all duration-300 rounded-xl">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 p-3 bg-blue-300/20 rounded-full w-fit">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-white border-blue-800 shadow-2xl rounded-xl">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
              <p className="text-gray-600 mb-6">
                Experience the future of medical diagnosis with our AI-powered assistant.
              </p>
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-400 hover:bg-blue-300 px-8 py-3 text-white font-semibold transform hover:scale-105 transition-all duration-300 rounded-full"
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