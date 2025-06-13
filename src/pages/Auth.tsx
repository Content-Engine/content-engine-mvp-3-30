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
  const {
    signIn,
    signUp
  } = useAuth();
  const {
    toast
  } = useToast();
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'user' as 'admin' | 'social_media_manager' | 'editor' | 'user'
  });
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('🔐 Attempting login for:', loginForm.email);
      const {
        error
      } = await signIn(loginForm.email, loginForm.password);
      if (error) {
        console.error('❌ Login failed:', error);
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log('✅ Login successful, redirecting to dashboard');
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in."
        });
        // Force page refresh to ensure clean state
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      console.error('❌ Login error:', err);
      toast({
        title: "Login Error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('📝 Attempting signup for:', signupForm.email);
      const {
        error
      } = await signUp(signupForm.email, signupForm.password, signupForm.fullName, signupForm.role);
      if (error) {
        console.error('❌ Signup failed:', error);
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log('✅ Signup successful, user can login immediately');
        toast({
          title: "Account Created!",
          description: "You can now sign in. A confirmation email has been sent to secure your account."
        });
        // Redirect to dashboard since they can login without confirmation
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      console.error('❌ Signup error:', err);
      toast({
        title: "Signup Error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen bg-theme-dark flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-theme-blue/10 via-theme-purple/5 to-theme-beige/10"></div>
      
      <Card className="w-full max-w-md relative z-10 bg-theme-dark/80 border-theme-beige/30 backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-theme-light">
            Content Engine
          </CardTitle>
          <p className="text-theme-beige">Sign in to your account</p>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-theme-dark/50">
              <TabsTrigger value="login" className="data-[state=active]:bg-theme-blue data-[state=active]:text-white">Login</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-theme-purple data-[state=active]:text-white">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-theme-light">Email</Label>
                  <Input id="email" type="email" value={loginForm.email} onChange={e => setLoginForm(prev => ({
                  ...prev,
                  email: e.target.value
                }))} className="bg-theme-dark/50 border-theme-beige/30 text-theme-light placeholder:text-theme-beige/60" required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-theme-light">Password</Label>
                  <Input id="password" type="password" value={loginForm.password} onChange={e => setLoginForm(prev => ({
                  ...prev,
                  password: e.target.value
                }))} className="bg-theme-dark/50 border-theme-beige/30 text-theme-light placeholder:text-theme-beige/60" required disabled={loading} />
                </div>
                <Button type="submit" className="w-full bg-theme-blue hover:bg-theme-blue/80 text-white border-none" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-theme-light">Full Name</Label>
                  <Input id="fullName" type="text" value={signupForm.fullName} onChange={e => setSignupForm(prev => ({
                  ...prev,
                  fullName: e.target.value
                }))} className="bg-theme-dark/50 border-theme-beige/30 text-theme-light placeholder:text-theme-beige/60" required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signupEmail" className="text-theme-light">Email</Label>
                  <Input id="signupEmail" type="email" value={signupForm.email} onChange={e => setSignupForm(prev => ({
                  ...prev,
                  email: e.target.value
                }))} className="bg-theme-dark/50 border-theme-beige/30 text-theme-light placeholder:text-theme-beige/60" required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signupPassword" className="text-theme-light">Password</Label>
                  <Input id="signupPassword" type="password" value={signupForm.password} onChange={e => setSignupForm(prev => ({
                  ...prev,
                  password: e.target.value
                }))} className="bg-theme-dark/50 border-theme-beige/30 text-theme-light placeholder:text-theme-beige/60" required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-theme-light">Role</Label>
                  <Select value={signupForm.role} onValueChange={(value: 'admin' | 'social_media_manager' | 'editor' | 'user') => setSignupForm(prev => ({
                  ...prev,
                  role: value
                }))} disabled={loading}>
                    <SelectTrigger className="bg-theme-dark/50 border-theme-beige/30 text-theme-light">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-theme-dark border-theme-beige/30">
                      <SelectItem value="user" className="text-theme-light">User</SelectItem>
                      <SelectItem value="editor" className="text-theme-light">Editor</SelectItem>
                      <SelectItem value="social_media_manager" className="text-theme-light">Social Media Manager</SelectItem>
                      <SelectItem value="admin" className="text-theme-light">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-theme-purple hover:bg-theme-purple/80 text-white border-none" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
                <p className="text-theme-beige/80 text-sm text-center">
                  You can sign in immediately after creating your account. A confirmation email will be sent to secure your account.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>;
};
export default Auth;
