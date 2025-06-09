
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { user, userRole, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'social_media_manager':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'editor':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-pink-900/20"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Navigation Header */}
      <nav className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div 
            className="text-2xl font-bold text-white cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            Content Engine
          </div>
          
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-white/70" />
                <span className="text-white/90 text-sm">{user.email}</span>
              </div>
              
              {userRole && (
                <Badge className={getRoleColor(userRole)}>
                  {userRole.replace('_', ' ')}
                </Badge>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-white/70 hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
