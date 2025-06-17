
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const platforms = [
  { id: "tiktok", name: "TikTok", icon: "🎵", premium: false },
  { id: "instagram", name: "Instagram", icon: "📷", premium: false },
  { id: "youtube_shorts", name: "YouTube Shorts", icon: "▶️", premium: false },
  { id: "facebook_reels", name: "Facebook Reels", icon: "👥", premium: false },
  { id: "twitter", name: "X (Twitter)", icon: "🐦", premium: false },
  { id: "rednote", name: "RedNote", icon: "📝", premium: true },
  { id: "vevo", name: "VEVO", icon: "🎶", premium: true },
];

interface CampaignBuilderStep4Props {
  campaignData: any;
  updateCampaignData: (updates: any) => void;
  onNext: () => void;
  onPrevious?: () => void;
}

const CampaignBuilderStep4 = ({ campaignData, updateCampaignData, onNext, onPrevious }: CampaignBuilderStep4Props) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(campaignData.selectedPlatforms || []);
  const { toast } = useToast();

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const triggerWebhookSync = async (platforms: string[]) => {
    try {
      const premiumFlags = {
        rednote: platforms.includes('rednote'),
        vevo: platforms.includes('vevo'),
        global_accounts: campaignData.accountType === 'global'
      };

      const payload = {
        campaign_id: campaignData.id || 'draft',
        user_id: campaignData.user_id || 'unknown',
        selected_platforms: platforms,
        premium_flags: premiumFlags,
        timestamp: new Date().toISOString()
      };

      await fetch('https://api.contentengine.io/hooks/platforms-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });

      console.log('Platform sync webhook triggered:', payload);
    } catch (error) {
      console.error('Failed to trigger platform sync webhook:', error);
    }
  };

  useEffect(() => {
    if (selectedPlatforms.length > 0) {
      triggerWebhookSync(selectedPlatforms);
    }
  }, [selectedPlatforms]);

  const handleSubmit = async () => {
    if (selectedPlatforms.length === 0) {
      toast({
        title: "Platform Required",
        description: "Please select at least one platform to continue",
        variant: "destructive",
      });
      return;
    }

    const premiumPlatforms = selectedPlatforms.some(id => 
      platforms.find(p => p.id === id)?.premium || campaignData.accountType === "global"
    );

    const data = {
      selectedPlatforms,
      premiumPlatforms
    };

    updateCampaignData(data);
    onNext();
  };

  const hasPremiumSelection = selectedPlatforms.some(id => 
    platforms.find(p => p.id === id)?.premium
  ) || campaignData.accountType === "global";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="glass-card-strong p-8 mb-6 inline-block">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              🎯 Platform Syndication Setup
            </h2>
            <div className="h-1 w-full bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 rounded-full"></div>
          </div>
          <p className="text-lg text-gray-300 glass-card-strong p-4 inline-block">
            Choose the platforms where your content will be published. Content Engine will dynamically assign accounts and extract campaign data to optimize distribution.
          </p>
        </div>

        {/* Smart Explanation Block */}
        <Card className="frosted-glass bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-0">
          <CardContent className="pt-6">
            <p className="text-gray-300 italic max-w-xl mx-auto text-center">
              Content Engine uses short-form syndication only. Your platform selection will determine the distribution algorithm, targeting model, and account assignment logic. Premium options will be flagged in real-time for budget routing.
            </p>
          </CardContent>
        </Card>

        {/* Platform Selector */}
        <Card className="frosted-glass bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-0">
          <CardHeader>
            <CardTitle className="text-white">🌐 Select the platforms you'd like to syndicate on:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => handlePlatformToggle(platform.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    selectedPlatforms.includes(platform.id)
                      ? 'border-blue-400 bg-blue-500/20 text-white'
                      : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-2">{platform.icon}</div>
                  <div className="font-medium text-sm">{platform.name}</div>
                  {platform.premium && (
                    <Badge className="mt-2 bg-yellow-500/20 text-yellow-400 text-xs">
                      🔒 Premium
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Premium Tier Explanation */}
        {hasPremiumSelection && (
          <Card className="frosted-glass bg-gradient-to-br from-yellow-500/10 to-orange-600/10 border-yellow-500/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-yellow-200">
                  💎 You've selected premium platforms. Your campaign will be automatically routed through our high-impact placement workflow. Billing will adjust accordingly.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6">
          <Button
            variant="outline"
            onClick={onPrevious}
            className="text-white border-white/20 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            ← Back to Syndication
          </Button>
          
          <Button 
            onClick={handleSubmit}
            size="lg" 
            className={`px-8 py-3 text-lg font-semibold rounded-2xl transition-all duration-300 ${
              selectedPlatforms.length > 0
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl" 
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
            disabled={selectedPlatforms.length === 0}
          >
            Continue to Scheduling →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilderStep4;
