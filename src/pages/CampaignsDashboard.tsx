
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Play, Pause, BarChart3, Edit } from "lucide-react";

interface Campaign {
  id: string;
  goal: string;
  tier: string;
  boosts: string[];
  schedule: {
    startDate: string;
    startTime: string;
  };
  createdAt: string;
  status?: string;
}

const CampaignsDashboard = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const savedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    setCampaigns(savedCampaigns);
  }, []);

  const getStatusBadge = (campaign: Campaign) => {
    const now = new Date();
    const startDateTime = new Date(`${campaign.schedule.startDate}T${campaign.schedule.startTime}`);
    
    if (startDateTime > now) {
      return <Badge className="bg-yellow-500 text-black">Scheduled</Badge>;
    } else {
      return <Badge className="bg-green-500 text-white">Active</Badge>;
    }
  };

  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'basic': return 'from-blue-500 to-blue-600';
      case 'pro': return 'from-purple-500 to-pink-600';
      case 'max': return 'from-orange-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getGoalEmoji = (goal: string) => {
    switch(goal) {
      case 'streams': return '🎧';
      case 'awareness': return '📢';
      case 'sales': return '💰';
      case 'leads': return '📈';
      default: return '🎯';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/10 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-white">My Campaigns</h1>
          </div>
          
          <Button
            onClick={() => navigate('/campaign-builder/step-1')}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{campaigns.length}</div>
              <div className="text-white/80 text-sm">Total Campaigns</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {campaigns.filter(c => {
                  const now = new Date();
                  const startDateTime = new Date(`${c.schedule.startDate}T${c.schedule.startTime}`);
                  return startDateTime <= now;
                }).length}
              </div>
              <div className="text-white/80 text-sm">Active</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {campaigns.filter(c => {
                  const now = new Date();
                  const startDateTime = new Date(`${c.schedule.startDate}T${c.schedule.startTime}`);
                  return startDateTime > now;
                }).length}
              </div>
              <div className="text-white/80 text-sm">Scheduled</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {campaigns.reduce((total, c) => total + c.boosts.length, 0)}
              </div>
              <div className="text-white/80 text-sm">Total Boosts</div>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns List */}
        {campaigns.length === 0 ? (
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-white mb-4">No Campaigns Yet</h3>
              <p className="text-white/80 mb-6">Create your first viral campaign to get started!</p>
              <Button
                onClick={() => navigate('/campaign-builder/step-1')}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Campaign
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {campaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className={`bg-gradient-to-r ${getTierColor(campaign.tier)} border-0 hover:scale-[1.02] transition-all duration-300`}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{getGoalEmoji(campaign.goal)}</span>
                        <h3 className="text-xl font-bold text-white capitalize">
                          {campaign.goal} Campaign
                        </h3>
                        {getStatusBadge(campaign)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-white/80 text-sm">
                        <span>Tier: {campaign.tier.toUpperCase()}</span>
                        <span>Boosts: {campaign.boosts.length}</span>
                        <span>Start: {new Date(`${campaign.schedule.startDate}T${campaign.schedule.startTime}`).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate('/performance-dashboard')}
                        className="bg-white/20 text-white hover:bg-white/30 border-0"
                      >
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Analytics
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/20 text-white hover:bg-white/30 border-0"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                  
                  {/* Campaign Details */}
                  <div className="grid md:grid-cols-3 gap-4 text-white/90">
                    <div>
                      <h4 className="font-semibold mb-1">Platforms</h4>
                      <div className="flex gap-1">
                        {['TikTok', 'IG', 'YouTube', 'Facebook'].map(platform => (
                          <span key={platform} className="bg-white/20 text-xs px-2 py-1 rounded">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-1">Active Boosts</h4>
                      <div className="flex gap-1">
                        {campaign.boosts.map(boost => (
                          <span key={boost} className="bg-white/20 text-xs px-2 py-1 rounded">
                            {boost.replace('-', ' ')}
                          </span>
                        ))}
                        {campaign.boosts.length === 0 && (
                          <span className="text-white/60 text-xs">No boosts</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-1">Created</h4>
                      <span className="text-sm">
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignsDashboard;
