import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Menu, X, Settings, BarChart3, Calendar, Users, Upload, MessageCircle, CheckSquare } from 'lucide-react';
import ContentEngineLogo from '@/components/ContentEngineLogo';

interface User {
  email: string;
  role: 'admin' | 'client' | 'editor' | 'social_media_manager';
}

const TopNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('contentEngineUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('contentEngineUser');
    setCurrentUser(null);
    navigate('/login');
  };

  const getRoleButtons = (role: string) => {
    switch (role) {
      case 'admin':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: BarChart3 },
          { label: 'Campaigns', path: '/campaigns', icon: Upload },
          { label: 'Builder', path: '/campaign-builder', icon: Upload },
          { label: 'QC Panel', path: '/qc-panel', icon: CheckSquare },
          { label: 'Analytics', path: '/performance', icon: BarChart3 },
          { label: 'Settings', path: '/user-management', icon: Settings }
        ];
      case 'client':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: BarChart3 },
          { label: 'Campaigns', path: '/campaigns', icon: Upload },
          { label: 'Builder', path: '/campaign-builder', icon: Upload }
        ];
      case 'editor':
        return [
          { label: 'Campaigns', path: '/campaigns', icon: Upload },
          { label: 'Assigned', path: '/editor-dashboard', icon: CheckSquare },
          { label: 'QC Review', path: '/qc-panel', icon: CheckSquare },
          { label: 'Chat', path: '/dashboard', icon: MessageCircle }
        ];
      case 'social_media_manager':
        return [
          { label: 'Campaigns', path: '/campaigns', icon: Upload },
          { label: 'Schedule', path: '/social/calendar', icon: Calendar },
          { label: 'Calendar', path: '/calendar', icon: Calendar },
          { label: 'Approvals', path: '/qc-panel', icon: CheckSquare }
        ];
      default:
        return [
          { label: 'Dashboard', path: '/dashboard', icon: BarChart3 },
          { label: 'Campaigns', path: '/campaigns', icon: Upload }
        ];
    }
  };

  const isActivePath = (path: string) => {
    return location.pathname === path || 
           (path === '/dashboard' && location.pathname === '/') ||
           (path === '/campaign-builder' && location.pathname.startsWith('/campaign-builder'));
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'client':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'editor':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'social_media_manager':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-border';
    }
  };

  const formatRoleName = (role: string) => {
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (!currentUser) {
    return null;
  }

  const buttons = getRoleButtons(currentUser.role);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between h-12">
          {/* Left side - Logo */}
          <div className="flex items-center gap-4">
            <ContentEngineLogo size="small" />
            <h1 
              className="text-xl font-bold text-foreground cursor-pointer hover:text-muted-foreground transition-colors"
              onClick={() => navigate('/dashboard')}
            >
              Content Engine
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {buttons.map((button) => {
              const Icon = button.icon;
              return (
                <Button
                  key={button.label}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(button.path)}
                  className={`nav-button ${isActivePath(button.path) ? 'nav-button-active' : ''}`}
                >
                  <Icon className="h-4 w-4" />
                  {button.label}
                </Button>
              );
            })}
          </div>

          {/* Right side - User info and logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarFallback className="text-xs font-semibold bg-secondary text-foreground">
                  {getInitials(currentUser.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  {currentUser.email}
                </span>
                <Badge 
                  variant="outline" 
                  className={`text-xs px-2 py-0 ${getRoleColor(currentUser.role)}`}
                >
                  {formatRoleName(currentUser.role)}
                </Badge>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Logout</span>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border shadow-lg">
          <div className="px-6 py-4 space-y-2">
            {/* Mobile user info */}
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarFallback className="text-xs font-semibold bg-secondary text-foreground">
                  {getInitials(currentUser.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  {currentUser.email}
                </span>
                <Badge 
                  variant="outline" 
                  className={`text-xs px-2 py-0 w-fit ${getRoleColor(currentUser.role)}`}
                >
                  {formatRoleName(currentUser.role)}
                </Badge>
              </div>
            </div>

            {/* Mobile navigation buttons */}
            {buttons.map((button) => {
              const Icon = button.icon;
              return (
                <Button
                  key={button.label}
                  variant="ghost"
                  onClick={() => {
                    navigate(button.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full justify-start nav-button ${
                    isActivePath(button.path) ? 'nav-button-active' : ''
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {button.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNavBar;
