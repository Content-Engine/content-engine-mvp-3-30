
import { useState, useEffect } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  BarChart3, 
  FolderOpen, 
  GraduationCap, 
  Share2,
  ArrowLeft,
  Bell,
  Search,
  Settings,
  AlertCircle
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
  const { userRole, loading, user } = useAuth();
  const [currentCampaign, setCurrentCampaign] = useState("All Campaigns");

  const sidebarItems = [
    { path: "/social/calendar", label: "Calendar", icon: Calendar },
    { path: "/social/editors", label: "Editors & Schedulers", icon: Users },
    { path: "/social/syndication", label: "Syndication", icon: Share2 },
    { path: "/social/performance", label: "Performance", icon: BarChart3 },
    { path: "/social/assets", label: "Content Library", icon: FolderOpen },
    { path: "/social/training", label: "Training & SOPs", icon: GraduationCap },
  ];

  useEffect(() => {
    if (!loading && userRole && !['admin', 'social_media_manager'].includes(userRole)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the Social Media Manager dashboard.",
        variant: "destructive",
      });
      navigate("/unauthorized");
    }
  }, [userRole, loading, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 loading-skeleton w-48 mb-4 mx-auto"></div>
          <div className="h-4 loading-skeleton w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-text-main mb-2">Authentication Required</h2>
          <p className="text-text-muted mb-4">Please log in to access the Social Manager Dashboard.</p>
          <Button onClick={() => navigate('/login')} className="btn-primary">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (!userRole || !['admin', 'social_media_manager'].includes(userRole)) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-text-main mb-2">Access Denied</h2>
          <p className="text-text-muted mb-4">You don't have permission to access this area.</p>
          <Button onClick={() => navigate('/dashboard')} className="btn-primary">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getCurrentPageTitle = () => {
    const currentItem = sidebarItems.find(item => location.pathname === item.path);
    return currentItem ? currentItem.label : "Social Media Manager";
  };

  return (
    <div className="min-h-screen bg-bg-main text-text-main">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card-bg/50 backdrop-blur-lg border-r border-border-color min-h-screen sticky top-0">
          {/* Header */}
          <div className="p-6 border-b border-border-color">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-text-muted hover:text-text-main"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            <div className="mt-4">
              <h1 className="text-xl font-bold text-text-main">
                Social Manager
              </h1>
              <Badge variant="secondary" className="mt-2 bg-green-500/20 text-green-400">
                {userRole === 'admin' ? 'Admin Access' : 'Manager Access'}
              </Badge>
            </div>
          </div>

          {/* Campaign Selector */}
          <div className="p-4 border-b border-border-color">
            <label className="text-sm text-text-muted mb-2 block">Active Campaign</label>
            <select 
              className="w-full bg-card-bg border border-border-color rounded-lg px-3 py-2 text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
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
                      ? "bg-secondary text-text-main border border-border-color" 
                      : "text-text-muted hover:text-text-main hover:bg-secondary/50"
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
          <div className="bg-card-bg/30 backdrop-blur-lg border-b border-border-color p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-text-main">{getCurrentPageTitle()}</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="input-primary pl-10 pr-4 py-2 w-64"
                  />
                </div>
                <Button variant="ghost" size="sm" className="text-text-muted hover:text-text-main">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-text-muted hover:text-text-main">
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
