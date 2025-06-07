
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Zap, DollarSign, TrendingUp, History, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BoostPurchaseModal from "@/components/BoostPurchaseModal";

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  totalSpend: number;
  activeBoosts: number;
  performance: number;
}

interface BoostHistory {
  id: string;
  campaignName: string;
  contentTitle: string;
  tier: string;
  amount: number;
  reach: number;
  date: string;
  status: 'active' | 'completed' | 'cancelled';
}

const BoostTriggerConsole = () => {
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any>(null);

  // Mock campaigns data
  const campaigns: Campaign[] = [
    { id: "1", name: "Fitness Q1", status: "active", totalSpend: 1250.00, activeBoosts: 3, performance: 145 },
    { id: "2", name: "Food Content", status: "active", totalSpend: 890.50, activeBoosts: 2, performance: 123 },
    { id: "3", name: "Tech Reviews", status: "paused", totalSpend: 560.00, activeBoosts: 0, performance: 98 },
    { id: "4", name: "Brand Story", status: "active", totalSpend: 2100.00, activeBoosts: 5, performance: 187 },
  ];

  // Mock boost history
  const boostHistory: BoostHistory[] = [
    {
      id: "1",
      campaignName: "Fitness Q1",
      contentTitle: "Morning Workout Routine",
      tier: "Premium",
      amount: 299.00,
      reach: 25000,
      date: "2024-01-15",
      status: "active"
    },
    {
      id: "2",
      campaignName: "Food Content",
      contentTitle: "Healthy Recipe Tutorial",
      tier: "Standard",
      amount: 99.00,
      reach: 12000,
      date: "2024-01-14",
      status: "completed"
    },
    {
      id: "3",
      campaignName: "Brand Story",
      contentTitle: "Behind the Scenes",
      tier: "Enterprise",
      amount: 599.00,
      reach: 45000,
      date: "2024-01-13",
      status: "active"
    },
  ];

  const filteredCampaigns = selectedCampaign === "all" 
    ? campaigns 
    : campaigns.filter(c => c.id === selectedCampaign);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "paused": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Standard": return "text-blue-600 bg-blue-100";
      case "Premium": return "text-purple-600 bg-purple-100";
      case "Enterprise": return "text-orange-600 bg-orange-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const handleBoostCampaign = (campaign: Campaign) => {
    // Mock content for the boost modal
    const mockContent = {
      id: `boost-${campaign.id}`,
      campaignId: campaign.id,
      title: `${campaign.name} Boost`,
      thumbnailUrl: "/placeholder.svg",
      platform: "Multi-Platform",
      accountName: "@contentengine",
      editorName: "System",
      approvalStatus: "approved" as const,
      scheduledDate: new Date().toISOString().split('T')[0],
      autoApproved: true,
      mediaUrl: "/placeholder.svg",
      comments: [],
      boostStatus: "none" as const
    };

    setSelectedContent(mockContent);
    setShowBoostModal(true);
  };

  const handlePauseCampaign = (campaignId: string) => {
    toast({
      title: "Campaign Paused",
      description: "All active boosts for this campaign have been paused.",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Campaign Filter */}
      <div className="flex items-center gap-4">
        <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by Campaign" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            {campaigns.map(campaign => (
              <SelectItem key={campaign.id} value={campaign.id}>
                {campaign.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Campaign Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{campaign.name}</CardTitle>
                <Badge variant="outline" className={getStatusColor(campaign.status)}>
                  {campaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Spend</p>
                  <p className="font-bold text-green-600">
                    {formatCurrency(campaign.totalSpend)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Active Boosts</p>
                  <p className="font-bold text-blue-600">{campaign.activeBoosts}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Performance</p>
                  <p className={`font-bold ${campaign.performance > 120 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {campaign.performance}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">ROI</p>
                  <p className="font-bold text-purple-600">
                    {((campaign.performance - 100) * 0.8).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => handleBoostCampaign(campaign)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  disabled={campaign.status !== 'active'}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Boost Campaign
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handlePauseCampaign(campaign.id)}
                    disabled={campaign.status !== 'active'}
                  >
                    <Pause className="h-3 w-3 mr-1" />
                    Pause
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Spending Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spend</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(campaigns.reduce((sum, c) => sum + c.totalSpend, 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Boosts</p>
                <p className="text-2xl font-bold text-blue-600">
                  {campaigns.reduce((sum, c) => sum + c.activeBoosts, 0)}
                </p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Performance</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(campaigns.reduce((sum, c) => sum + c.performance, 0) / campaigns.length)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(campaigns.reduce((sum, c) => sum + c.totalSpend, 0) * 0.7)}
                </p>
              </div>
              <History className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Boost History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Boost History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {boostHistory.map((boost) => (
              <div key={boost.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{boost.contentTitle}</p>
                    <Badge variant="outline" className={getTierColor(boost.tier)}>
                      {boost.tier}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(boost.status)}>
                      {boost.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{boost.campaignName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatCurrency(boost.amount)}</p>
                  <p className="text-xs text-muted-foreground">
                    {boost.reach.toLocaleString()} reach • {boost.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Boost Purchase Modal */}
      {selectedContent && (
        <BoostPurchaseModal
          isOpen={showBoostModal}
          onClose={() => setShowBoostModal(false)}
          content={selectedContent}
        />
      )}
    </div>
  );
};

export default BoostTriggerConsole;
