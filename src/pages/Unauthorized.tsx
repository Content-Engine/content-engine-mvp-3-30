
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { userRole, signOut } = useAuth();

  const handleGoHome = () => {
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
      default:
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-orange-900/20 to-yellow-900/30"></div>
      
      <Card className="glass-card w-full max-w-md relative z-10">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Access Denied
          </CardTitle>
          <p className="text-white/70">
            You don't have permission to access this page
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-white/60 text-sm mb-4">
              Your current role: <span className="font-semibold text-white capitalize">{userRole?.replace('_', ' ')}</span>
            </p>
            <p className="text-white/60 text-xs">
              Contact your administrator if you believe this is an error.
            </p>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleGoHome}
              className="w-full glass-button-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
            
            <Button
              onClick={signOut}
              variant="ghost"
              className="w-full text-white/70 hover:text-white"
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;
