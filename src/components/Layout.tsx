
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, Home, Calendar, CheckSquare, CreditCard, Users, Crown, Edit } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { signOut, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getNavigationItems = () => {
    const baseItems = [];

    if (userRole === 'admin') {
      baseItems.push(
        { path: '/dashboard', label: 'Dashboard', icon: Home },
        { path: '/user-management', label: 'User Management', icon: Users },
        { path: '/calendar', label: 'Calendar', icon: Calendar },
        { path: '/qc-panel', label: 'Quality Control', icon: CheckSquare },
        { path: '/payment-tiers', label: 'Billing', icon: CreditCard },
      );
    } else if (userRole === 'social_media_manager') {
      baseItems.push(
        { path: '/social/calendar', label: 'Calendar', icon: Calendar },
        { path: '/social/performance', label: 'Performance', icon: CheckSquare },
      );
    } else if (userRole === 'editor') {
      baseItems.push(
        { path: '/editor-dashboard', label: 'Editor Dashboard', icon: Edit },
      );
    }

    return baseItems;
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case 'admin':
        return <Crown className="h-4 w-4" />;
      case 'social_media_manager':
        return <Calendar className="h-4 w-4" />;
      case 'editor':
        return <Edit className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getRoleBadgeColor = () => {
    switch (userRole) {
      case 'admin':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'social_media_manager':
        return 'bg-blue-500/20 text-blue-400';
      case 'editor':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900">
      {/* Header */}
      <header className="glass-card-strong border-b border-white/10 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent cursor-pointer"
            onClick={() => {
              if (userRole === 'admin') navigate('/dashboard');
              else if (userRole === 'social_media_manager') navigate('/social/calendar');
              else if (userRole === 'editor') navigate('/editor-dashboard');
              else navigate('/');
            }}
          >
            Content Engine
          </h1>

          <div className="flex items-center gap-4">
            {userRole && (
              <Badge className={`flex items-center gap-1 ${getRoleBadgeColor()}`}>
                {getRoleIcon()}
                {userRole.replace('_', ' ')}
              </Badge>
            )}
            
            <Button variant="ghost" onClick={signOut} className="text-white/90 hover:text-white">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Navigation Toolbar */}
      {navigationItems.length > 0 && (
        <div className="container mx-auto px-4 py-4">
          <Card>
            <CardContent className="p-4">
              <nav className="flex flex-wrap gap-4 items-center justify-center">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Button
                      key={item.path}
                      variant={isActive ? "secondary" : "ghost"}
                      onClick={() => navigate(item.path)}
                      className="text-white/90 hover:text-white"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
