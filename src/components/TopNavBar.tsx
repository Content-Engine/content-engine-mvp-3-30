
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Menu, X, CreditCard, Users, Edit, Calendar, ChevronDown } from 'lucide-react';
import { usePayments } from '@/hooks/usePayments';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NotificationButton from '@/components/NotificationButton';

const TopNavBar = () => {
  const { user, userRole, signOut } = useAuth();
  const { paymentTier } = usePayments();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      // Use window.location for clean navigation after sign out
      window.location.href = '/auth';
    } catch (error) {
      console.error('Sign out error:', error);
      // Fallback to force navigation
      window.location.href = '/auth';
    }
  };

  const handleNavigation = (path: string) => {
    console.log('Navigating to:', path);
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location if navigate fails
      window.location.href = path;
    }
  };

  const handleContentEngineClick = () => {
    // Always go to dashboard for the Content Engine button
    console.log('Content Engine clicked, navigating to dashboard');
    handleNavigation('/dashboard');
  };

  const getTierBadgeColor = (tier: string | null) => {
    switch (tier) {
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'pro': return 'bg-purple-100 text-purple-800';
      case 'executive': return 'bg-gold-100 text-gold-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleBasedNavItems = () => {
    const items = [];
    
    // Admin can see everything
    if (userRole === 'admin') {
      items.push(
        { path: '/social-manager/calendar', label: 'Social Media Manager', icon: Calendar },
        { path: '/client portal', label: 'Client Portal', icon: Edit },
        { path: '/user-management', label: 'User Management', icon: Users },
        { path: '/campaign-builder', label: 'Campaign Builder', icon: Edit }
      );
    }
    
    // Social Media Manager
    if (userRole === 'social_media_manager') {
      items.push(
        { path: '/social-manager/calendar', label: 'Social Media Manager', icon: Calendar }
      );
    }
    
    // Editor
    if (userRole === 'editor') {
      items.push(
        { path: '/editor', label: 'Editor Portal', icon: Edit }
      );
    }
    
    // User/Client
    if (userRole === 'user') {
      items.push(
        { path: '/client-portal', label: 'Client Portal', icon: User }
      );
    }

    return items;
  };

  const roleBasedItems = getRoleBasedNavItems();

  return (
    <nav className="bg-theme-dark/90 backdrop-blur-md border-b border-theme-beige/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={handleContentEngineClick}
              className="text-theme-light font-bold text-xl hover:text-theme-blue transition-colors"
            >
              Content Engine
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {user && (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation('/dashboard')}
                    className="text-theme-beige hover:text-theme-light hover:bg-theme-light/10"
                  >
                    Dashboard
                  </Button>
                  
                  {/* Admin Dropdown */}
                  {userRole === 'admin' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="text-theme-beige hover:text-theme-light hover:bg-theme-light/10"
                        >
                          Admin Tools
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-theme-dark/95 backdrop-blur-md border border-theme-beige/20">
                        {roleBasedItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <DropdownMenuItem
                              key={item.path}
                              onClick={() => handleNavigation(item.path)}
                              className="cursor-pointer text-theme-light hover:bg-theme-light/10"
                            >
                              <Icon className="h-4 w-4 mr-2" />
                              {item.label}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  
                  {/* Non-admin role-based navigation items */}
                  {userRole !== 'admin' && roleBasedItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.path}
                        variant="ghost"
                        onClick={() => handleNavigation(item.path)}
                        className="text-theme-beige hover:text-theme-light hover:bg-theme-light/10"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation('/payment-tiers')}
                    className="text-theme-beige hover:text-theme-light hover:bg-theme-light/10"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Plans
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              {user ? (
                <>
                  {/* Payment Tier Badge */}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierBadgeColor(paymentTier)}`}>
                    {paymentTier || 'free'}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-theme-beige" />
                    <span className="text-theme-light text-sm">{user.email}</span>
                  </div>
                  
                  <NotificationButton />
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-theme-beige hover:text-theme-light hover:bg-theme-light/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => handleNavigation('/auth')}
                  className="bg-theme-blue hover:bg-theme-blue/80 text-white border-theme-blue/30"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-theme-light hover:bg-theme-light/10"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-theme-dark/95 backdrop-blur-md">
            {user && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleNavigation('/dashboard');
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-start text-theme-beige hover:text-theme-light hover:bg-theme-light/10"
                >
                  Dashboard
                </Button>
                
                {/* Role-based navigation items for mobile */}
                {roleBasedItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.path}
                      variant="ghost"
                      onClick={() => {
                        handleNavigation(item.path);
                        setIsMenuOpen(false);
                      }}
                      className="w-full justify-start text-theme-beige hover:text-theme-light hover:bg-theme-light/10"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  );
                })}
                
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleNavigation('/payment-tiers');
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-start text-theme-beige hover:text-theme-light hover:bg-theme-light/10"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Plans
                </Button>
                <div className="border-t border-theme-beige/20 pt-3 mt-3">
                  <div className="flex items-center px-3 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierBadgeColor(paymentTier)}`}>
                      {paymentTier || 'free'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start text-theme-beige hover:text-theme-light hover:bg-theme-light/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNavBar;
