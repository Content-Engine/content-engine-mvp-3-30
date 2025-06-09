
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
      <div className="absolute inset-0 bg-gradient-to-br from-card/20 via-transparent to-secondary/20"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
      
      <Card className="card-primary w-full max-w-md relative z-10 shadow-xl">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-4">
            <ContentEngineLogo size="large" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
            Content Engine
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Sign in to access your dashboard
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium text-sm">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@company.com"
                className="h-11 focus:ring-accent"
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role" className="text-foreground font-medium text-sm">Select Your Role</Label>
              <Select value={role} onValueChange={(value: UserRole) => setRole(value)} disabled={loading}>
                <SelectTrigger className="h-11 focus:ring-accent bg-input text-foreground">
                  <SelectValue placeholder="Choose your role..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-foreground">
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full h-11 btn-accent font-semibold text-base transition-all duration-200"
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
          <div className="border-t border-border pt-6">
            <p className="text-sm text-muted-foreground mb-4 text-center font-medium">Quick Demo Access:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('admin', 'admin@contentengine.com')}
                className="text-xs py-2 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400"
                disabled={loading}
              >
                Demo Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('client', 'client@contentengine.com')}
                className="text-xs py-2 hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-400"
                disabled={loading}
              >
                Demo Client
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('editor', 'editor@contentengine.com')}
                className="text-xs py-2 hover:bg-green-500/10 hover:border-green-500/50 hover:text-green-400"
                disabled={loading}
              >
                Demo Editor
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('social_media_manager', 'smm@contentengine.com')}
                className="text-xs py-2 hover:bg-purple-500/10 hover:border-purple-500/50 hover:text-purple-400"
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
