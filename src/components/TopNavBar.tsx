
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings,
  LogOut,
  User,
  CreditCard
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptionTier } from '@/hooks/useSubscriptionTier';
import NotificationCenter from '@/components/NotificationCenter';
import ContentEngineLogo from '@/components/ContentEngineLogo';
import RoleBasedAccess from '@/components/RoleBasedAccess';

const TopNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, userRole } = useAuth();
  const { tier } = useSubscriptionTier();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const menuItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: Home,
      allowedRoles: ['user', 'admin', 'social_media_manager', 'editor']
    },
    { 
      label: 'Social Manager', 
      path: '/social-manager-dashboard', 
      icon: Calendar,
      allowedRoles: ['social_media_manager', 'admin']
    },
    { 
      label: 'Campaigns', 
      path: '/campaigns', 
      icon: BarChart3,
      allowedRoles: ['user', 'admin', 'social_media_manager']
    },
    { 
      label: 'Performance', 
      path: '/performance', 
      icon: BarChart3,
      allowedRoles: ['admin', 'social_media_manager']
    },
    { 
      label: 'User Management', 
      path: '/user-management', 
      icon: Users,
      allowedRoles: ['admin']
    },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <ContentEngineLogo />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white">Content Engine</h1>
              {tier !== 'free' && (
                <Badge className="text-xs bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30">
                  {tier.toUpperCase()}
                </Badge>
              )}
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <RoleBasedAccess key={item.path} allowedRoles={item.allowedRoles}>
                <Button
                  variant={isActivePath(item.path) ? "secondary" : "ghost"}
                  onClick={() => navigate(item.path)}
                  className={`
                    text-white/80 hover:text-white hover:bg-white/10
                    ${isActivePath(item.path) ? 'bg-white/20 text-white' : ''}
                  `}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              </RoleBasedAccess>
            ))}
          </div>

          {/* Right side - Notifications and User Menu */}
          <div className="flex items-center space-x-2">
            {/* Notification Center */}
            <NotificationCenter />

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => navigate('/payment-tiers')}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {tier === 'free' ? 'Upgrade' : 'Billing'}
              </Button>

              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white/80 hover:text-white"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/30 backdrop-blur-lg border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <RoleBasedAccess key={item.path} allowedRoles={item.allowedRoles}>
                <Button
                  variant={isActivePath(item.path) ? "secondary" : "ghost"}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className={`
                    w-full justify-start text-white/80 hover:text-white hover:bg-white/10
                    ${isActivePath(item.path) ? 'bg-white/20 text-white' : ''}
                  `}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              </RoleBasedAccess>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNavBar;
