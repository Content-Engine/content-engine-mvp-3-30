
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Users, Calendar, BarChart3, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user, userRole, loading } = useAuth();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!loading && user && !hasRedirected) {
      console.log('User authenticated, redirecting based on role:', userRole);
      setHasRedirected(true);

      setTimeout(() => {
        switch (userRole) {
          case 'admin':
            navigate('/dashboard');
            break;
          case 'social_media_manager':
            navigate('/social-manager');
            break;
          case 'editor':
            navigate('/editor');
            break;
          default:
            navigate('/dashboard');
        }
      }, 100);
    }
  }, [user, userRole, loading, navigate, hasRedirected]);

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-dark flex items-center justify-center">
        <div className="text-theme-light text-xl">Loading...</div>
      </div>
    );
  }

  if (user && !hasRedirected) {
    return (
      <div className="min-h-screen bg-theme-dark flex items-center justify-center">
        <div className="text-theme-light text-xl">Redirecting...</div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-theme-dark text-theme-light">
      {/* Ambient background effects using theme colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-theme-blue/10 via-theme-purple/5 to-theme-beige/10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-theme-blue/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-theme-purple/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <nav className="py-6 flex items-center justify-between">
          <div className="text-2xl font-bold text-theme-light">Content Engine</div>
          <Button 
            onClick={() => navigate('/auth')} 
            className="bg-theme-blue hover:bg-theme-blue/80 text-white border-none"
          >
            Sign In
          </Button>
        </nav>

        {/* Hero Section */}
        <div className="py-20 text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-theme-blue via-theme-purple to-theme-light bg-clip-text text-transparent">
            Content Syndication Platform
          </h1>
          <p className="text-xl text-theme-beige mb-8 max-w-2xl mx-auto">
            Streamline your content creation workflow with automated syndication, 
            quality control, and performance analytics.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate('/auth')} 
              size="lg" 
              className="bg-theme-blue hover:bg-theme-blue/80 text-white shadow-lg border-none"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-20 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-theme-dark/50 border-theme-beige/30 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-theme-light">
                <Users className="h-5 w-5 text-theme-blue" />
                Team Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-theme-beige">
                Manage editors, social media managers, and content workflows.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-theme-dark/50 border-theme-beige/30 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-theme-light">
                <Calendar className="h-5 w-5 text-theme-purple" />
                Content Scheduling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-theme-beige">
                Schedule and syndicate content across multiple platforms.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-theme-dark/50 border-theme-beige/30 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-theme-light">
                <BarChart3 className="h-5 w-5 text-theme-light" />
                Analytics Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-theme-beige">
                Track performance metrics and optimize your content strategy.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-theme-dark/50 border-theme-beige/30 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-theme-light">
                <Zap className="h-5 w-5 text-theme-beige" />
                Boost Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-theme-beige">
                Amplify your best content with intelligent boost recommendations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
