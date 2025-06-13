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

const TopNavBar = () => {
  const { user, userRole, signOut } = useAuth();
  const { paymentTier } = usePayments();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    // Force page refresh to ensure completely clean state
    window.location.href = '/auth';
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
        { path: '/social-manager', label: 'Social Manager', icon: Calendar },
        { path: '/editor', label: 'Editor Portal', icon: Edit },
        { path: '/user-management', label: 'User Management', icon: Users },
        { path: '/campaign-builder', label: 'Campaign Builder', icon: Edit }
      );
    }
    
    // Social Media Manager
    if (userRole === 'social_media_manager') {
      items.push(
        { path: '/social-manager', label: 'Social Manager', icon: Calendar }
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
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="text-white font-bold text-xl hover:text-white/80 transition-colors"
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
                    onClick={() => navigate('/dashboard')}
                    className="text-white/90 hover:text-white hover:bg-white/10"
                  >
                    Dashboard
                  </Button>
                  
                  {/* Admin Dropdown */}
                  {userRole === 'admin' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="text-white/90 hover:text-white hover:bg-white/10"
                        >
                          Admin Tools
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white/95 backdrop-blur-md border border-white/20">
                        {roleBasedItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <DropdownMenuItem
                              key={item.path}
                              onClick={() => navigate(item.path)}
                              className="cursor-pointer"
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
                        onClick={() => navigate(item.path)}
                        className="text-white/90 hover:text-white hover:bg-white/10"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/payment-tiers')}
                    className="text-white/90 hover:text-white hover:bg-white/10"
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
                    <User className="h-4 w-4 text-white/70" />
                    <span className="text-white/90 text-sm">{user.email}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-white/90 hover:text-white hover:bg-white/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => navigate('/auth')}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
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
              className="text-white hover:bg-white/10"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/5 backdrop-blur-md">
            {user && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate('/dashboard');
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10"
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
                        navigate(item.path);
                        setIsMenuOpen(false);
                      }}
                      className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  );
                })}
                
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate('/payment-tiers');
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Plans
                </Button>
                <div className="border-t border-white/20 pt-3 mt-3">
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
                    className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10"
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
