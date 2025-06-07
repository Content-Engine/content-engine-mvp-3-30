
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Users, Calendar, BarChart3, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user, userRole, loading } = useAuth();

  useEffect(() => {
    // Redirect authenticated users to appropriate dashboard
    if (!loading && user) {
      switch (userRole) {
        case 'admin':
          navigate('/dashboard');
          break;
        case 'social_media_manager':
          navigate('/social-manager');
          break;
        case 'editor':
          navigate('/editor-dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    }
  }, [user, userRole, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (user) {
    // This will be handled by the useEffect redirect above
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-pink-900/20"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <nav className="py-6 flex items-center justify-between">
          <div className="text-2xl font-bold">Content Engine</div>
          <Button 
            onClick={() => navigate('/auth')}
            className="glass-button-primary"
          >
            Sign In
          </Button>
        </nav>

        {/* Hero Section */}
        <div className="py-20 text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
            Content Syndication Platform
          </h1>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Streamline your content creation workflow with automated syndication, 
            quality control, and performance analytics.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              className="glass-button-primary"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-20 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="h-5 w-5 text-blue-400" />
                Team Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                Manage editors, social media managers, and content workflows.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Calendar className="h-5 w-5 text-green-400" />
                Content Scheduling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                Schedule and syndicate content across multiple platforms.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="h-5 w-5 text-purple-400" />
                Analytics Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                Track performance metrics and optimize your content strategy.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Zap className="h-5 w-5 text-yellow-400" />
                Boost Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
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
