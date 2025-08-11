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
        style: { background: '#86EFAC', color: '#000000' } // Light Green (bg-green-300)
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Login Failed",
        description: result.error,
        variant: "destructive",
        style: { background: '#F3F4F6', color: '#000000' } // Light Gray (bg-gray-100)
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
        style: { background: '#F3F4F6', color: '#000000' } // Light Gray (bg-gray-100)
      });
      setIsLoading(false);
      return;
    }

    const result = await signUp(signupData.email, signupData.password);
    
    if (result.success) {
      toast({
        title: "Account Created",
        description: "Welcome to Medical Diagnosis Assistant",
        style: { background: '#86EFAC', color: '#000000' } // Light Green (bg-green-300)
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Signup Failed",
        description: result.error,
        variant: "destructive",
        style: { background: '#F3F4F6', color: '#000000' } // Light Gray (bg-gray-100)
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Stethoscope className="h-12 w-12 text-green-600" /> {/* Light Green */}
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            MediMind
          </h1>
          <p className="text-gray-600">
            AI-powered healthcare diagnosis and consultation
          </p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-xl border-blue-800/50 bg-white rounded-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900">
              Welcome
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-50 rounded-full">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-green-300 data-[state=active]:text-black rounded-full"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="data-[state=active]:bg-green-300 data-[state=active]:text-black rounded-full"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-gray-900 font-medium">
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      className="border-blue-800/50 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-gray-900 font-medium">
                      Password
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      className="border-blue-800/50 rounded-xl"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-green-300 text-black hover:bg-blue-300 rounded-full transform hover:scale-105 transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-gray-900 font-medium">
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                      className="border-blue-800/50 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-gray-900 font-medium">
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                      className="border-blue-800/50 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password" className="text-gray-900 font-medium">
                      Confirm Password
                    </Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      required
                      className="border-blue-800/50 rounded-xl"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-green-300 text-black hover:bg-blue-300 rounded-full transform hover:scale-105 transition-all duration-300"
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
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>Secure • HIPAA Compliant • AI-Powered</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;