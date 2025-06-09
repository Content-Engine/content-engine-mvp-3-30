
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ 
    email: '', 
    password: '', 
    fullName: '', 
    role: 'user' as 'admin' | 'social_media_manager' | 'editor' | 'user'
  });
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    {
      email: 'admin@demo.com',
      password: 'demo123',
      role: 'admin',
      label: 'Admin Demo',
      description: 'Full access to all features',
      color: 'hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400'
    },
    {
      email: 'editor@demo.com',
      password: 'demo123',
      role: 'editor',
      label: 'Editor Demo',
      description: 'Content editing and review',
      color: 'hover:bg-green-500/10 hover:border-green-500/50 hover:text-green-400'
    },
    {
      email: 'smm@demo.com',
      password: 'demo123',
      role: 'social_media_manager',
      label: 'Social Manager Demo',
      description: 'Social media management',
      color: 'hover:bg-purple-500/10 hover:border-purple-500/50 hover:text-purple-400'
    },
    {
      email: 'client@demo.com',
      password: 'demo123',
      role: 'user',
      label: 'Client Demo',
      description: 'Campaign creation and monitoring',
      color: 'hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-400'
    }
  ];

  const handleDemoLogin = async (demoAccount: typeof demoAccounts[0]) => {
    setLoading(true);
    
    try {
      const { error } = await signIn(demoAccount.email, demoAccount.password);
      
      if (error) {
        toast({
          title: "Demo Login Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Demo Login Successful",
          description: `Logged in as ${demoAccount.role.replace('_', ' ')}`,
        });
        navigate('/dashboard');
      }
    } catch (err: any) {
      toast({
        title: "Demo Login Error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await signIn(loginForm.email, loginForm.password);
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in.",
        });
        navigate('/dashboard');
      }
    } catch (err: any) {
      toast({
        title: "Login Error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await signUp(
        signupForm.email, 
        signupForm.password, 
        signupForm.fullName,
        signupForm.role
      );
      
      if (error) {
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Signup Error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-card/20 via-transparent to-secondary/20"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
      
      <Card className="w-full max-w-md relative z-10 card-primary shadow-xl">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
            Content Engine
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Sign in to your account
          </p>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="demo" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="demo">Demo</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="demo" className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">
                  Try different user roles with our demo accounts
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {demoAccounts.map((account) => (
                  <Card key={account.role} className="card-surface">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{account.label}</h3>
                        <span className="text-xs text-muted-foreground capitalize">
                          {account.role.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {account.description}
                      </p>
                      <Button
                        onClick={() => handleDemoLogin(account)}
                        disabled={loading}
                        size="sm"
                        className={`w-full transition-all duration-200 ${account.color}`}
                        variant="outline"
                      >
                        {loading ? 'Signing in...' : `Login as ${account.role.replace('_', ' ')}`}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    className="input-primary"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    className="input-primary"
                    required
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full btn-primary" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={signupForm.fullName}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, fullName: e.target.value }))}
                    className="input-primary"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signupEmail" className="text-foreground">Email</Label>
                  <Input
                    id="signupEmail"
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                    className="input-primary"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signupPassword" className="text-foreground">Password</Label>
                  <Input
                    id="signupPassword"
                    type="password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                    className="input-primary"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-foreground">Role</Label>
                  <Select 
                    value={signupForm.role} 
                    onValueChange={(value: 'admin' | 'social_media_manager' | 'editor' | 'user') => 
                      setSignupForm(prev => ({ ...prev, role: value }))
                    }
                    disabled={loading}
                  >
                    <SelectTrigger className="input-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="social_media_manager">Social Media Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full btn-primary" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
