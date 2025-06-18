import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, TrendingUp, Users, Zap, AlertCircle, Crown, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCampaignData } from '@/hooks/useCampaignData';
import { useSubscriptionTier } from '@/hooks/useSubscriptionTier';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import RoleBasedAccess from '@/components/RoleBasedAccess';

const Dashboard = () => {
  const navigate = useNavigate();
  const { campaigns, loading: campaignsLoading, error: campaignsError } = useCampaignData();
  const { loading: authLoading, authError, user, userRole } = useAuth();
  const { tier, hasFeature, canAccessPage } = useSubscriptionTier();
  const [diagnosticInfo, setDiagnosticInfo] = useState<string>('');

  // Add diagnostic logging
  useEffect(() => {
    const info = [
      `🔐 Auth Loading: ${authLoading}`,
      `👤 User Present: ${!!user}`,
      `🎭 Role: ${userRole || 'none'}`,
      `💳 Tier: ${tier}`,
      `⚠️ Auth Error: ${authError || 'none'}`,
      `📊 Campaigns Loading: ${campaignsLoading}`,
      `🚫 Campaigns Error: ${campaignsError || 'none'}`,
      `🕐 Timestamp: ${new Date().toISOString()}`
    ].join('\n');
    
    setDiagnosticInfo(info);
    console.log('📊 Dashboard Diagnostic Info:', info);
  }, [authLoading, user, userRole, authError, campaignsLoading, campaignsError, tier]);

  // Demo data for metrics
  const metrics = {
    totalReach: 125400,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    boostImpact: 87.5,
  };

  // Show auth error state
  if (authError) {
    return (
      <Layout>
        <div className="space-y-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Authentication Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 mb-4">{authError}</p>
              <pre className="text-xs text-white/50 bg-black/20 p-4 rounded overflow-auto">
                {diagnosticInfo}
              </pre>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Show loading state with diagnostic info
  if (authLoading || campaignsLoading) {
    return (
      <Layout>
        <div className="space-y-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Loading Dashboard...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-white/20 rounded w-1/2"></div>
                </div>
                <details className="text-xs">
                  <summary className="text-white/70 cursor-pointer">Show Diagnostic Info</summary>
                  <pre className="text-white/50 bg-black/20 p-4 rounded mt-2 overflow-auto">
                    {diagnosticInfo}
                  </pre>
                </details>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-white">Campaign Dashboard</h1>
              {tier !== 'free' && (
                <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full border border-yellow-500/30">
                  <Crown className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400 text-sm font-medium capitalize">{tier}</span>
                </div>
              )}
            </div>
            <p className="text-white/70">Manage your music content campaigns</p>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-2">
                <summary className="text-xs text-white/50 cursor-pointer">Debug Info</summary>
                <pre className="text-xs text-white/40 mt-1">{diagnosticInfo}</pre>
              </details>
            )}
          </div>
          <div className="flex items-center gap-3">
            {tier === 'free' && (
              <Button
                onClick={() => navigate('/payment-tiers')}
                variant="outline"
                className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                Upgrade Plan
              </Button>
            )}
            <Button
              onClick={() => navigate('/campaign-builder/step/1')}
              size="lg"
              className="glass-button-primary"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Campaign
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Total Reach</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metrics.totalReach.toLocaleString()}</div>
              <p className="text-xs text-white/60">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Active Campaigns</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metrics.activeCampaigns}</div>
              <p className="text-xs text-white/60">Across all platforms</p>
            </CardContent>
          </Card>

          <RoleBasedAccess requiredTier="pro" fallback={
            <Card className="glass-card opacity-50 border-yellow-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/90">Boost Impact</CardTitle>
                <div className="flex items-center gap-1">
                  <Crown className="h-3 w-3 text-yellow-400" />
                  <Zap className="h-4 w-4 text-yellow-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white/50">Pro Only</div>
                <p className="text-xs text-yellow-400">Upgrade to view analytics</p>
              </CardContent>
            </Card>
          }>
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/90">Boost Impact</CardTitle>
                <Zap className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.boostImpact}%</div>
                <p className="text-xs text-white/60">Average engagement increase</p>
              </CardContent>
            </Card>
          </RoleBasedAccess>
        </div>

        {/* Error State */}
        {campaignsError && (
          <Card className="glass-card border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Failed to Load Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 mb-4">{campaignsError}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="border-red-500/50 text-red-400"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Campaigns List */}
        {!campaignsError && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Recent Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              {campaigns.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-white/60 mb-4">No campaigns yet. Create your first campaign to get started!</p>
                  <Button onClick={() => navigate('/campaign-builder/step/1')} variant="secondary">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {campaigns.slice(0, 5).map((campaign) => (
                    <div key={campaign.id} className="glass-card-subtle p-4 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-semibold">{campaign.name}</h3>
                          <p className="text-white/60 text-sm capitalize">
                            Goal: {campaign.goal} • Status: {campaign.status}
                          </p>
                        </div>
                        <RoleBasedAccess allowedRoles={['admin', 'social_media_manager']}>
                          <div className="text-xs text-white/40">
                            ID: {campaign.id.slice(0, 8)}...
                          </div>
                        </RoleBasedAccess>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
