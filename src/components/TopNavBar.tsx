
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Menu, X } from 'lucide-react';
import { usePayments } from '@/hooks/usePayments';
import RoleBasedNavigation from '@/components/RoleBasedNavigation';

const TopNavBar = () => {
  const { user, signOut, userRole } = useAuth();
  const { paymentTier } = usePayments();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getTierBadgeStyle = (tier: string | null) => {
    switch (tier) {
      case 'basic': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pro': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'executive': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRoleDisplay = (role: string | null) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'editor': return 'Editor';
      case 'social_media_manager': return 'Social Manager';
      case 'client': return 'Client';
      default: return 'User';
    }
  };

  return (
    <nav className="bg-card-bg/95 backdrop-blur-md border-b border-border-color sticky top-0 z-50">
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="text-text-main font-bold text-xl hover:text-accent transition-colors"
            >
              Content Engine
            </button>
          </div>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                {/* Role Badge */}
                <span className="status-active">
                  {getRoleDisplay(userRole)}
                </span>
                
                {/* Payment Tier Badge */}
                <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getTierBadgeStyle(paymentTier)}`}>
                  {paymentTier || 'free'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 text-text-muted">
                <User className="h-4 w-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-text-muted hover:text-text-main"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          )}

          {/* Auth Button for non-authenticated users */}
          {!user && (
            <div className="hidden md:block">
              <Button
                onClick={() => navigate('/auth')}
                className="btn-primary"
              >
                Sign In
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-text-main"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border-color">
          <div className="container-main py-4 space-y-4">
            {user ? (
              <>
                {/* User Info */}
                <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-text-muted" />
                    <div>
                      <div className="text-text-main text-sm font-medium">{user.email}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="status-active text-xs">
                          {getRoleDisplay(userRole)}
                        </span>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getTierBadgeStyle(paymentTier)}`}>
                          {paymentTier || 'free'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Items */}
                <RoleBasedNavigation />

                {/* Sign Out */}
                <div className="pt-4 border-t border-border-subtle">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start text-text-muted hover:text-text-main"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <Button
                onClick={() => {
                  navigate('/auth');
                  setIsMenuOpen(false);
                }}
                className="btn-primary w-full"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNavBar;
