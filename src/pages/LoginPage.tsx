
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import ContentEngineLogo from '@/components/ContentEngineLogo';

type UserRole = 'admin' | 'client' | 'editor' | 'social_media_manager';

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const [loading, setLoading] = useState(false);

  const roleOptions = [
    { value: 'admin', label: 'Admin', description: 'Full access to all features' },
    { value: 'client', label: 'Client', description: 'Upload content and manage campaigns' },
    { value: 'editor', label: 'Editor', description: 'Review and edit content' },
    { value: 'social_media_manager', label: 'Social Media Manager', description: 'Schedule and manage posts' }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !role) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulate login delay
    setTimeout(() => {
      const user = { email, role };
      localStorage.setItem('contentEngineUser', JSON.stringify(user));
      
      console.log('User logged in:', user);
      
      toast({
        title: "Login Successful",
        description: `Welcome back! Logged in as ${role.replace('_', ' ')}`,
      });

      // Navigate to appropriate dashboard based on role
      switch (role) {
        case 'admin':
          navigate('/dashboard');
          break;
        case 'client':
          navigate('/dashboard');
          break;
        case 'editor':
          navigate('/editor-dashboard');
          break;
        case 'social_media_manager':
          navigate('/social/calendar');
          break;
        default:
          navigate('/dashboard');
      }
      
      setLoading(false);
    }, 1000);
  };

  const handleDemoLogin = (demoRole: UserRole, demoEmail: string) => {
    setEmail(demoEmail);
    setRole(demoRole);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/50 via-transparent to-neutral-800/50"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-neutral-700/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-neutral-600/10 rounded-full blur-3xl"></div>
      
      <Card className="card-secondary w-full max-w-md relative z-10 shadow-xl">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-4">
            <ContentEngineLogo size="large" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-neutral-700 via-neutral-800 to-neutral-900 bg-clip-text text-transparent">
            Content Engine
          </CardTitle>
          <p className="text-neutral-600 mt-2">
            Sign in to access your dashboard
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-700 font-medium text-sm">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@company.com"
                className="h-11 border-neutral-300 focus:border-neutral-500 focus:ring-neutral-500 bg-white text-black"
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role" className="text-neutral-700 font-medium text-sm">Select Your Role</Label>
              <Select value={role} onValueChange={(value: UserRole) => setRole(value)} disabled={loading}>
                <SelectTrigger className="h-11 border-neutral-300 focus:border-neutral-500 focus:ring-neutral-500 bg-white text-black">
                  <SelectValue placeholder="Choose your role..." />
                </SelectTrigger>
                <SelectContent className="bg-white border-neutral-300">
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-black">
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-neutral-500">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full h-11 btn-primary font-semibold text-base transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Demo accounts section */}
          <div className="border-t border-neutral-200 pt-6">
            <p className="text-sm text-neutral-600 mb-4 text-center font-medium">Quick Demo Access:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('admin', 'admin@contentengine.com')}
                className="text-xs py-2 hover:bg-red-50 hover:border-red-300 border-neutral-300 text-neutral-700"
                disabled={loading}
              >
                Demo Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('client', 'client@contentengine.com')}
                className="text-xs py-2 hover:bg-blue-50 hover:border-blue-300 border-neutral-300 text-neutral-700"
                disabled={loading}
              >
                Demo Client
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('editor', 'editor@contentengine.com')}
                className="text-xs py-2 hover:bg-green-50 hover:border-green-300 border-neutral-300 text-neutral-700"
                disabled={loading}
              >
                Demo Editor
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('social_media_manager', 'smm@contentengine.com')}
                className="text-xs py-2 hover:bg-purple-50 hover:border-purple-300 border-neutral-300 text-neutral-700"
                disabled={loading}
              >
                Demo SMM
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
