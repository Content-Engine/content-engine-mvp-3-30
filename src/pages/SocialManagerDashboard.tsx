
import { useState, useEffect } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  BarChart3, 
  FolderOpen, 
  GraduationCap, 
  Syndication2,
  ArrowLeft,
  Bell,
  Search,
  Settings
} from "lucide-react";
import SocialCalendarView from "@/components/social-manager/SocialCalendarView";
import EditorsPanel from "@/components/social-manager/EditorsPanel";
import SyndicationView from "@/components/social-manager/SyndicationView";
import PerformanceView from "@/components/social-manager/PerformanceView";
import AssetsLibrary from "@/components/social-manager/AssetsLibrary";
import TrainingView from "@/components/social-manager/TrainingView";

const SocialManagerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCampaign, setCurrentCampaign] = useState("All Campaigns");

  const sidebarItems = [
    { path: "/social/calendar", label: "Calendar", icon: Calendar },
    { path: "/social/editors", label: "Editors & Schedulers", icon: Users },
    { path: "/social/syndication", label: "Syndication", icon: Syndication2 },
    { path: "/social/performance", label: "Performance", icon: BarChart3 },
    { path: "/social/assets", label: "Content Library", icon: FolderOpen },
    { path: "/social/training", label: "Training & SOPs", icon: GraduationCap },
  ];

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Access Denied",
          description: "Please log in to access the Social Media Manager dashboard.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error checking user role:', error);
        toast({
          title: "Error",
          description: "Failed to verify user permissions.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      const hasManagerRole = userRoles?.some(role => 
        role.role === 'admin' || role.role === 'social_media_manager'
      );

      if (!hasManagerRole) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the Social Media Manager dashboard.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAuthorized(true);
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Error",
        description: "Authentication failed.",
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-white/20 rounded w-48 mb-4"></div>
          <div className="h-4 bg-white/20 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  const getCurrentPageTitle = () => {
    const currentItem = sidebarItems.find(item => location.pathname === item.path);
    return currentItem ? currentItem.label : "Social Media Manager";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-black/50 backdrop-blur-lg border-r border-white/10 min-h-screen sticky top-0">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-white/70 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            <div className="mt-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Social Manager
              </h1>
              <Badge variant="secondary" className="mt-2 bg-green-500/20 text-green-400">
                Manager Access
              </Badge>
            </div>
          </div>

          {/* Campaign Selector */}
          <div className="p-4 border-b border-white/10">
            <label className="text-sm text-white/70 mb-2 block">Active Campaign</label>
            <select 
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
              value={currentCampaign}
              onChange={(e) => setCurrentCampaign(e.target.value)}
            >
              <option value="All Campaigns">All Campaigns</option>
              <option value="Summer Boost">Summer Boost</option>
              <option value="Product Launch">Product Launch</option>
            </select>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start text-left ${
                    isActive 
                      ? "bg-white/20 text-white border border-white/30" 
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar */}
          <div className="bg-black/30 backdrop-blur-lg border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">{getCurrentPageTitle()}</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/50 text-sm w-64"
                  />
                </div>
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6">
            <Routes>
              <Route path="/calendar" element={<SocialCalendarView currentCampaign={currentCampaign} />} />
              <Route path="/editors" element={<EditorsPanel currentCampaign={currentCampaign} />} />
              <Route path="/syndication" element={<SyndicationView currentCampaign={currentCampaign} />} />
              <Route path="/performance" element={<PerformanceView currentCampaign={currentCampaign} />} />
              <Route path="/assets" element={<AssetsLibrary currentCampaign={currentCampaign} />} />
              <Route path="/training" element={<TrainingView />} />
              <Route path="/" element={<SocialCalendarView currentCampaign={currentCampaign} />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialManagerDashboard;
