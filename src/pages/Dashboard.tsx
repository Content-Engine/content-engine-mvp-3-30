
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, TrendingUp, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCampaignData } from '@/hooks/useCampaignData';
import Layout from '@/components/Layout';

const Dashboard = () => {
  const navigate = useNavigate();
  const { campaigns, loading } = useCampaignData();

  // Demo data for metrics
  const metrics = {
    totalReach: 125400,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    boostImpact: 87.5,
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-white text-center">Loading campaigns...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Campaign Dashboard</h1>
            <p className="text-white/70">Manage your music content campaigns</p>
          </div>
          <Button
            onClick={() => navigate('/campaigns/new')}
            size="lg"
            className="glass-button-primary"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Campaign
          </Button>
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
        </div>

        {/* Campaigns List */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Recent Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            {campaigns.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/60 mb-4">No campaigns yet. Create your first campaign to get started!</p>
                <Button onClick={() => navigate('/campaigns/new')} variant="secondary">
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
