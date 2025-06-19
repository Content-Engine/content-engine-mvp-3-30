
import { useState } from "react";
import { Bell, Menu, X, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import NotificationCenter from "./NotificationCenter";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface TopNavBarProps {
  onMenuToggle?: () => void;
  title?: string;
}

const TopNavBar = ({ onMenuToggle, title = "Dashboard" }: TopNavBarProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signOut, userRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'social_media_manager': return 'Social Media Manager';
      case 'content_editor': return 'Content Editor';
      case 'client': return 'Client';
      default: return 'User';
    }
  };

  const isManagerOrAdmin = () => {
    if (!userRole) return false;
    const allowedRoles = ['admin', 'social_media_manager'];
    return allowedRoles.includes(userRole);
  };

  const isClientRole = () => {
    return userRole === 'client';
  };

  return (
    <div className="bg-card-bg border-b border-border-color px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Menu and Title */}
        <div className="flex items-center gap-4">
          {onMenuToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="text-text-muted hover:text-text-main"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-xl font-semibold text-text-main">{title}</h1>
        </div>

        {/* Right side - Notifications and User Menu */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          {isManagerOrAdmin() && (
            <Popover open={showNotifications} onOpenChange={setShowNotifications}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative text-text-muted hover:text-text-main"
                >
                  <Bell className="h-5 w-5" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    3
                  </Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <NotificationCenter />
              </PopoverContent>
            </Popover>
          )}

          {/* User Menu */}
          <Popover open={showUserMenu} onOpenChange={setShowUserMenu}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-text-muted hover:text-text-main"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:inline text-sm">
                  {user?.email?.split('@')[0] || 'User'}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64">
              <div className="space-y-4">
                <div className="border-b border-border-color pb-3">
                  <p className="font-medium text-text-main">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-sm text-text-muted">{user?.email}</p>
                  {userRole && (
                    <Badge variant="secondary" className="mt-1">
                      {getRoleDisplayName(userRole)}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-text-muted hover:text-text-main"
                    onClick={() => navigate('/profile')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default TopNavBar;
