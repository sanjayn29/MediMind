import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { signIn, signUp } from '@/lib/auth';
import { Heart, Stethoscope } from 'lucide-react';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn(loginData.email, loginData.password);
    
    if (result.success) {
      toast({
        title: "Login Successful",
        description: "Welcome to Medical Diagnosis Assistant",
        style: { background: '#4CAF50', color: '#FFFFFF' } // Success Green
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Login Failed",
        description: result.error,
        variant: "destructive",
        style: { background: '#E53935', color: '#FFFFFF' } // Warning/Alert Red
      });
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match",
        variant: "destructive",
        style: { background: '#E53935', color: '#FFFFFF' } // Warning/Alert Red
      });
      setIsLoading(false);
      return;
    }

    const result = await signUp(signupData.email, signupData.password);
    
    if (result.success) {
      toast({
        title: "Account Created",
        description: "Welcome to Medical Diagnosis Assistant",
        style: { background: '#4CAF50', color: '#FFFFFF' } // Success Green
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Signup Failed",
        description: result.error,
        variant: "destructive",
        style: { background: '#E53935', color: '#FFFFFF' } // Warning/Alert Red
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F9FC] via-[#FFFFFF] to-[#F5F9FC] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-[#1E88E5]" /> {/* Primary Blue */}
            <Stethoscope className="h-8 w-8 text-[#43A047]" /> {/* Secondary Green */}
          </div>
          <h1 className="text-3xl font-bold text-[#212121] mb-2"> {/* Dark Gray */}
            Medical Diagnosis Assistant
          </h1>
          <p className="text-[#616161]"> {/* Medium Gray */}
            AI-powered healthcare diagnosis and consultation
          </p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-xl border-[#E0E0E0]"> {/* Light Gray */}
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#212121]"> {/* Dark Gray */}
              Welcome
            </CardTitle>
            <CardDescription className="text-[#616161]"> {/* Medium Gray */}
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#F5F9FC]"> {/* Light Background */}
                <TabsTrigger value="login" className="data-[state=active]:bg-[#1E88E5] data-[state=active]:text-[#FFFFFF]">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-[#1E88E5] data-[state=active]:text-[#FFFFFF]">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-[#212121]"> {/* Dark Gray */}
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      className="border-[#E0E0E0]" // Light Gray
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-[#212121]"> {/* Dark Gray */}
                      Password
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      className="border-[#E0E0E0]" // Light Gray
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-[#1E88E5] text-[#FFFFFF] hover:bg-[#43A047]" // Primary Blue, hover Secondary Green
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-[#212121]"> {/* Dark Gray */}
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                      className="border-[#E0E0E0]" // Light Gray
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-[#212121]"> {/* Dark Gray */}
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                      className="border-[#E0E0E0]" // Light Gray
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password" className="text-[#212121]"> {/* Dark Gray */}
                      Confirm Password
                    </Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      required
                      className="border-[#E0E0E0]" // Light Gray
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-[#1E88E5] text-[#FFFFFF] hover:bg-[#43A047]" // Primary Blue, hover Secondary Green
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-[#616161]"> {/* Medium Gray */}
          <p>Secure • HIPAA Compliant • AI-Powered</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;