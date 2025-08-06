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
      icon: <MessageSquare className="h-6 w-6 text-blue-600" />,
      title: "Symptom Collector Agent",
      description: "Intelligent collection of patient symptoms through text and voice input with natural language processing.",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <Database className="h-6 w-6 text-green-600" />,
      title: "Medical Database Agent",
      description: "Comprehensive medical knowledge base querying for accurate disease information and symptom correlation.",
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <Brain className="h-6 w-6 text-purple-600" />,
      title: "Diagnosis Agent",
      description: "AI-powered differential diagnosis matching using advanced machine learning algorithms and medical expertise.",
      color: "bg-purple-50 border-purple-200"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-orange-600" />,
      title: "Risk Rank Agent",
      description: "Intelligent risk assessment and urgency ranking with personalized recommendations for next steps.",
      color: "bg-orange-50 border-orange-200"
    }
  ];

  const benefits = [
    {
      icon: <Zap className="h-5 w-5 text-yellow-600" />,
      title: "Instant Analysis",
      description: "Get AI-powered diagnosis results in seconds"
    },
    {
      icon: <Lock className="h-5 w-5 text-green-600" />,
      title: "Secure & Private",
      description: "HIPAA-compliant data protection and encryption"
    },
    {
      icon: <Users className="h-5 w-5 text-blue-600" />,
      title: "User-Friendly",
      description: "Intuitive interface for both doctors and patients"
    },
    {
      icon: <Activity className="h-5 w-5 text-purple-600" />,
      title: "Real-time Chat",
      description: "Interactive AI consultation with follow-up questions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How Our AI Medical Assistant Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our advanced AI system combines multiple specialized agents to provide accurate, 
            comprehensive medical diagnosis and consultation in real-time.
          </p>
        </div>

        {/* AI Agents Flow */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            AI Agent Architecture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className={`${feature.color} border-2 shadow-lg`}>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-3 p-3 bg-white rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Process Flow */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Diagnosis Process Flow
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-blue-600">1</span>
                </div>
                <p className="text-sm font-medium">Symptom Input</p>
                <p className="text-xs text-gray-500">Text or voice</p>
              </div>
              <div className="text-center">
                <div className="text-gray-400">→</div>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-green-600">2</span>
                </div>
                <p className="text-sm font-medium">AI Analysis</p>
                <p className="text-xs text-gray-500">Pattern matching</p>
              </div>
              <div className="text-center">
                <div className="text-gray-400">→</div>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-purple-600">3</span>
                </div>
                <p className="text-sm font-medium">Results</p>
                <p className="text-xs text-gray-500">Diagnosis & recommendations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Key Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center shadow-lg border-0">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 p-3 bg-gray-100 rounded-full w-fit">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Technology Stack
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="font-semibold mb-4">Frontend</h3>
                <div className="space-y-2">
                  <Badge variant="outline">React 18</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                  <Badge variant="outline">Tailwind CSS</Badge>
                  <Badge variant="outline">Shadcn/ui</Badge>
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-4">Backend</h3>
                <div className="space-y-2">
                  <Badge variant="outline">FastAPI</Badge>
                  <Badge variant="outline">Python</Badge>
                  <Badge variant="outline">Groq API</Badge>
                  <Badge variant="outline">Firebase</Badge>
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-4">AI & Security</h3>
                <div className="space-y-2">
                  <Badge variant="outline">LLaMA 3</Badge>
                  <Badge variant="outline">HIPAA Compliant</Badge>
                  <Badge variant="outline">Firestore</Badge>
                  <Badge variant="outline">Authentication</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-0 shadow-lg">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-gray-600 mb-6">
                Experience the future of medical diagnosis with our AI-powered assistant.
              </p>
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
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