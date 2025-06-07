
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ContentEngineLogo from "@/components/ContentEngineLogo";
import GoogleSignInButton from "@/components/GoogleSignInButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    try {
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any email/password
      if (email.includes('@') && password.length >= 6) {
        toast({
          title: "Login successful!",
          description: "Welcome to Content Engine",
        });
        navigate('/campaigns-dashboard');
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex animate-fade-in bg-gradient-to-br from-black via-gray-950 to-gray-900">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center items-center relative overflow-hidden">
        {/* Glass background with animated elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl animate-glow"></div>
        
        <div className="relative z-10 text-center text-white max-w-md glass-card p-8">
          <ContentEngineLogo size="large" className="mb-8" />
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Content Engine
          </h1>
          <p className="text-xl mb-8 text-white/90">Powering the Future of Media Syndication</p>
          <div className="text-sm text-white/80 space-y-2">
            <div className="glass rounded-lg p-3 mb-2">
              <p>✓ Used by creators, agencies, and labels worldwide</p>
            </div>
            <div className="glass rounded-lg p-3">
              <p>✓ Secure, reliable, and scalable platform</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md glow-strong">
          <CardHeader className="text-center">
            <div className="lg:hidden mb-4">
              <ContentEngineLogo size="small" className="mx-auto mb-2" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <p className="text-muted-foreground">Sign in to your Content Engine account</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-300 glass rounded-xl border border-red-500/30 bg-red-500/10">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input pl-10 text-white placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input pl-10 pr-10 text-white placeholder:text-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors glass-button p-1 rounded-lg"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="border-white/20"
                  />
                  <Label htmlFor="remember" className="text-sm text-white">Remember me</Label>
                </div>
                <Link to="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="glass px-2 text-muted-foreground rounded-lg">Or continue with</span>
                </div>
              </div>
              
              <GoogleSignInButton />
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                    Sign up here
                  </Link>
                </p>
              </div>
            </form>
            
            {/* Security & Legal Footer */}
            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <div className="flex items-center justify-center mb-2 text-sm text-muted-foreground glass rounded-lg p-2">
                <Lock className="h-3 w-3 mr-1" />
                <span>Secure login</span>
              </div>
              <p className="text-xs text-muted-foreground">
                By logging in, you agree to our{' '}
                <Link to="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">Terms</Link> and{' '}
                <Link to="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">Privacy Policy</Link>.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Need help?{' '}
                <a href="mailto:info@anthemnation.co" className="text-purple-400 hover:text-purple-300 transition-colors">
                  info@anthemnation.co
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
