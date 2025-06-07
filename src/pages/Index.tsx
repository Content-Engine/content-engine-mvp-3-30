
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Zap, Users, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Index = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect authenticated users to their appropriate dashboard
    if (!loading && user && userRole) {
      switch (userRole) {
        case 'admin':
          navigate('/dashboard');
          break;
        case 'social_media_manager':
          navigate('/social/calendar');
          break;
        case 'editor':
          navigate('/editor-dashboard');
          break;
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

  // Show landing page for unauthenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30"></div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent mb-6">
              Content Engine
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Streamline your content creation workflow with role-based access, powerful analytics, and collaborative tools.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => navigate('/login')} 
                size="lg"
                className="glass-button-primary"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-400" />
                  Role-Based Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">
                  Secure access control for Admins, Social Media Managers, and Editors with tailored dashboards.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-green-400" />
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">
                  Track engagement, reach, and ROI across all your content campaigns with real-time insights.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-6 w-6 text-yellow-400" />
                  Boost & Syndication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">
                  Amplify your content with intelligent boost triggers and multi-platform syndication.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="glass-card max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to Transform Your Content Strategy?
                </h2>
                <p className="text-white/70 mb-6">
                  Join thousands of creators and marketers who trust Content Engine for their workflow management.
                </p>
                <Button 
                  onClick={() => navigate('/login')} 
                  size="lg"
                  className="glass-button-primary"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // If user is authenticated but we're still here, show loading
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 flex items-center justify-center">
      <div className="text-white text-xl">Redirecting...</div>
    </div>
  );
};

export default Index;
