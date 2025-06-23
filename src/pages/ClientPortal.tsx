import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useScheduledPosts } from "@/hooks/useScheduledPosts";
import { useCampaignData } from "@/hooks/useCampaignData";
import { usePayments } from "@/hooks/usePayments";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  BarChart3, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  TrendingUp,
  Settings,
  Activity,
  Shield
} from "lucide-react";
import Layout from "@/components/Layout";
import AyrshareApiKeyManager from "@/components/AyrshareApiKeyManager";
import NotificationButton from "@/components/NotificationButton";

const ClientPortal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole, loading, user } = useAuth();
  const { paymentTier } = usePayments();
  const { posts, loading: postsLoading } = useScheduledPosts();
  const { campaigns, loading: campaignsLoading } = useCampaignData();

  // --- Admin Impersonation Toggle ---
  const [impersonating, setImpersonating] = useState(false);
  const effectiveUserRole = impersonating ? 'user' : userRole;
  const effectivePaymentTier = impersonating ? 'pro' : paymentTier;
  const showPremiumButtons =
    effectiveUserRole === 'admin' || (effectiveUserRole === 'user' && effectivePaymentTier === 'pro');

  useEffect(() => {
    if (!loading && (!user || (userRole && userRole === 'user'))) {
      // Allow regular users (clients) to access this portal
    } else if (!loading && userRole && !['user', 'admin'].includes(userRole)) {
      toast({
        title: "Access Denied",
        description: "This portal is for clients only.",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [userRole, loading, navigate, toast, user]);

  if (loading || postsLoading || campaignsLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-bg-main flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-8 w-48 bg-gray-700 rounded mb-4 mx-auto"></div>
            <div className="h-4 w-32 bg-gray-700 rounded mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }

  const userPosts = posts.filter(post => post.user_id === user?.id);
  const userCampaigns = campaigns.filter(campaign => campaign.user_id === user?.id);
  
  const scheduledPosts = userPosts.filter(p => p.status === 'scheduled').length;
  const postedCount = userPosts.filter(p => p.status === 'posted').length;
  const failedCount = userPosts.filter(p => p.status === 'failed').length;
  
  const lastPostDate = userPosts.length > 0 
    ? new Date(Math.max(...userPosts.map(p => new Date(p.schedule_time).getTime())))
    : null;

  const platformsUsed = [...new Set(userPosts.flatMap(p => p.platforms))];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'posted': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-400" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-gray-400" />;
      default: return <Clock className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return 'bg-green-500/20 text-green-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      case 'cancelled': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-yellow-500/20 text-yellow-400';
    }
  };

  const getPlatformEmoji = (platform: string) => {
    switch (platform) {
      case 'tiktok': return '🎵';
      case 'instagram': return '📷';
      case 'youtube': return '📺';
      case 'twitter': return '🐦';
      case 'facebook': return '👥';
      default: return '📱';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-bg-main text-text-main p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* --- Admin-only Impersonation Mode Toggle --- */}
          {userRole === 'admin' && (
            <div className="flex items-center justify-end mb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-blue-500"
                  checked={impersonating}
                  onChange={() => setImpersonating(val => !val)}
                />
                <span className="text-sm text-blue-600 select-none">
                  Impersonate Pro Client
                </span>
              </label>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="text-text-muted hover:text-text-main"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-text-main">Client Portal</h1>
                <p className="text-text-muted">Manage your campaigns and account settings</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <NotificationButton />
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                Client Access
              </Badge>
            </div>
          </div>

          {/* Premium Access Cards */}
          {showPremiumButtons && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-card-bg/50 border-border-color hover:bg-card-bg/70 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <Button
                      onClick={() => navigate('/calendar-overview')}
                      className="w-full h-auto p-0 bg-transparent hover:bg-transparent text-left"
                      variant="ghost"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-6 w-6 text-accent" />
                            <span className="text-lg">📅</span>
                          </div>
                          <h3 className="font-semibold text-text-main">Calendar Overview</h3>
                          <p className="text-sm text-text-muted">View your content calendar</p>
                        </div>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="bg-card-bg/50 border-border-color hover:bg-card-bg/70 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <Button
                      onClick={() => navigate('/performance-dashboard')}
                      className="w-full h-auto p-0 bg-transparent hover:bg-transparent text-left"
                      variant="ghost"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Activity className="h-6 w-6 text-accent" />
                            <span className="text-lg">📊</span>
                          </div>
                          <h3 className="font-semibold text-text-main">Performance Dashboard</h3>
                          <p className="text-sm text-text-muted">Track your analytics</p>
                        </div>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="bg-card-bg/50 border-border-color hover:bg-card-bg/70 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <Button
                      onClick={() => navigate('/quality-control-panel')}
                      className="w-full h-auto p-0 bg-transparent hover:bg-transparent text-left"
                      variant="ghost"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-6 w-6 text-accent" />
                            <span className="text-lg">🛡️</span>
                          </div>
                          <h3 className="font-semibold text-text-main">Quality Control</h3>
                          <p className="text-sm text-text-muted">Review content quality</p>
                        </div>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* --- Pro Features Metrics Panel --- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                {/* Scheduled Posts Card */}
                <div className="p-4 bg-white rounded-lg shadow-md flex flex-col items-center">
                  <div className="text-xs text-muted-foreground font-medium mb-2">Scheduled Posts</div>
                  <div className="text-3xl font-bold text-accent">42</div>
                </div>
                {/* Campaign Performance Card */}
                <div className="p-4 bg-white rounded-lg shadow-md flex flex-col items-center">
                  <div className="text-xs text-muted-foreground font-medium mb-2">Campaign Performance</div>
                  <div className="text-3xl font-bold text-green-500 flex items-center gap-1">+18.2% <span className="ml-1 text-lg">↑</span></div>
                </div>
                {/* QC Flags Card */}
                <div className="p-4 bg-white rounded-lg shadow-md flex flex-col items-center">
                  <div className="text-xs text-muted-foreground font-medium mb-2">QC Flags</div>
                  <div className="text-3xl font-bold text-yellow-600">3</div>
                </div>
              </div>
            </>
          )}

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-card-bg/50">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-card-bg/50 border-border-color">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-text-muted text-sm">Posts Scheduled</p>
                        <p className="text-2xl font-bold text-yellow-400">{scheduledPosts}</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card-bg/50 border-border-color">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-text-muted text-sm">Posts Published</p>
                        <p className="text-2xl font-bold text-green-400">{postedCount}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card-bg/50 border-border-color">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-text-muted text-sm">Active Campaigns</p>
                        <p className="text-2xl font-bold text-text-main">{userCampaigns.length}</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-accent" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card-bg/50 border-border-color">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-text-muted text-sm">Platforms Used</p>
                        <p className="text-2xl font-bold text-text-main">{platformsUsed.length}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-accent" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card className="bg-card-bg/50 border-border-color">
                  <CardHeader>
                    <CardTitle className="text-text-main flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-text-muted">Last Post Date</span>
                        <span className="text-text-main">
                          {lastPostDate ? lastPostDate.toLocaleDateString() : 'No posts yet'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-muted">Failed Posts</span>
                        <span className="text-red-400">{failedCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-muted">Success Rate</span>
                        <span className="text-green-400">
                          {userPosts.length > 0 
                            ? Math.round((postedCount / userPosts.length) * 100) 
                            : 0}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Platform Distribution */}
                <Card className="bg-card-bg/50 border-border-color">
                  <CardHeader>
                    <CardTitle className="text-text-main flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Platform Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {platformsUsed.length > 0 ? (
                        platformsUsed.map((platform) => {
                          const count = userPosts.filter(p => p.platforms.includes(platform)).length;
                          const percentage = Math.round((count / userPosts.length) * 100);
                          return (
                            <div key={platform} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getPlatformEmoji(platform)}</span>
                                <span className="text-text-main capitalize">{platform}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-text-muted text-sm">{count} posts</span>
                                <span className="text-text-main">{percentage}%</span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-text-muted text-center py-4">No platforms used yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="posts" className="space-y-6">
              {/* Scheduled Posts */}
              <Card className="bg-card-bg/50 border-border-color">
                <CardHeader>
                  <CardTitle className="text-text-main flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Your Scheduled Posts
                    <Badge variant="outline" className="border-border-color text-text-muted">
                      {userPosts.length} total
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userPosts.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-text-muted mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-text-main mb-2">No Posts Yet</h3>
                      <p className="text-text-muted">Your scheduled posts will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userPosts.slice(0, 10).map((post) => {
                        const campaign = userCampaigns.find(c => c.id === post.campaign_id);
                        return (
                          <div key={post.id} className="flex items-start justify-between p-4 border border-border-color rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getStatusIcon(post.status)}
                                <Badge className={getStatusColor(post.status)}>
                                  {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                                </Badge>
                                {campaign && (
                                  <Badge variant="outline" className="border-border-color text-text-muted">
                                    {campaign.name}
                                  </Badge>
                                )}
                              </div>
                              
                              <h4 className="font-medium text-text-main mb-1 line-clamp-1">
                                {post.caption}
                              </h4>
                              
                              <div className="flex items-center gap-4 text-sm text-text-muted">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {new Date(post.schedule_time).toLocaleString()}
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  {post.platforms.map((platform, index) => (
                                    <span key={index} className="text-lg">
                                      {getPlatformEmoji(platform)}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {userPosts.length > 10 && (
                        <div className="text-center pt-4">
                          <p className="text-text-muted">
                            Showing 10 of {userPosts.length} posts
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <AyrshareApiKeyManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ClientPortal;
