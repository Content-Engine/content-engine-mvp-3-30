
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import ProgressBar from "@/components/ProgressBar";
import { ArrowLeft, Check, TrendingUp, Users, Zap, Star, MessageCircle, Play } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface TierAddOn {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface Tier {
  id: string;
  name: string;
  price: number;
  accounts: string;
  platforms: string[];
  features: string[];
  gradient: string;
  popular: boolean;
  estimated: {
    views: string;
    engagement: string;
    bestPlatform: string;
  };
  platformBreakdown: {
    tiktok: number;
    instagram: number;
    youtube: number;
    facebook: number;
  };
}

const addOns: TierAddOn[] = [
  { id: "reposting", name: "Reposting Rotation", price: 19, description: "Auto-repost content for maximum reach" },
  { id: "speed", name: "Speed Priority", price: 29, description: "24hr faster content processing" },
  { id: "headlines", name: "Headline Optimizer", price: 15, description: "AI-powered caption enhancement" }
];

const tiers: Tier[] = [
  {
    id: "basic",
    name: "Basic",
    price: 99,
    accounts: "5 accounts",
    platforms: ["TikTok", "Instagram", "Facebook"],
    features: [
      "5 syndication accounts",
      "Basic analytics dashboard",
      "48-hour posting window",
      "Standard captions",
      "Email support"
    ],
    gradient: "from-blue-500/80 to-blue-600/80",
    popular: false,
    estimated: {
      views: "5K–12K",
      engagement: "4.2%",
      bestPlatform: "TikTok"
    },
    platformBreakdown: {
      tiktok: 2,
      instagram: 2,
      youtube: 0,
      facebook: 1
    }
  },
  {
    id: "pro",
    name: "Pro",
    price: 299,
    accounts: "15 accounts",
    platforms: ["TikTok", "Instagram", "YouTube", "Facebook"],
    features: [
      "15 syndication accounts",
      "Advanced analytics dashboard",
      "AI-optimized captions",
      "24-hour turnaround",
      "Custom hashtag sets",
      "Priority support",
      "Performance insights"
    ],
    gradient: "from-purple-500/80 to-pink-600/80",
    popular: true,
    estimated: {
      views: "18K–35K",
      engagement: "6.8%",
      bestPlatform: "Instagram"
    },
    platformBreakdown: {
      tiktok: 4,
      instagram: 4,
      youtube: 3,
      facebook: 4
    }
  },
  {
    id: "max",
    name: "Max",
    price: 599,
    accounts: "30+ accounts",
    platforms: ["TikTok", "Instagram", "YouTube", "Facebook"],
    features: [
      "30+ syndication accounts",
      "Real-time analytics",
      "Instant posting",
      "Dedicated account manager",
      "Premium caption optimizer",
      "Syndication reporting dashboard",
      "Custom integrations",
      "White-label options"
    ],
    gradient: "from-orange-500/80 to-red-600/80",
    popular: false,
    estimated: {
      views: "45K–80K",
      engagement: "8.4%",
      bestPlatform: "YouTube"
    },
    platformBreakdown: {
      tiktok: 8,
      instagram: 8,
      youtube: 6,
      facebook: 8
    }
  }
];

const CampaignBuilderStep3 = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<string>("");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTier, setPreviewTier] = useState<string>("");

  const selectedTierData = tiers.find(tier => tier.id === selectedTier);
  const totalAddOnCost = selectedAddOns.reduce((total, addOnId) => {
    const addOn = addOns.find(a => a.id === addOnId);
    return total + (addOn?.price || 0);
  }, 0);

  const handleTierSelect = (tierId: string) => {
    setSelectedTier(tierId);
    localStorage.setItem('campaignTier', JSON.stringify({
      tier: tierId,
      addOns: selectedAddOns,
      totalCost: (tiers.find(t => t.id === tierId)?.price || 0) + totalAddOnCost
    }));
  };

  const handleAddOnToggle = (addOnId: string) => {
    const newAddOns = selectedAddOns.includes(addOnId)
      ? selectedAddOns.filter(id => id !== addOnId)
      : [...selectedAddOns, addOnId];
    setSelectedAddOns(newAddOns);
    
    if (selectedTier) {
      localStorage.setItem('campaignTier', JSON.stringify({
        tier: selectedTier,
        addOns: newAddOns,
        totalCost: (tiers.find(t => t.id === selectedTier)?.price || 0) + 
          newAddOns.reduce((total, addOnId) => {
            const addOn = addOns.find(a => a.id === addOnId);
            return total + (addOn?.price || 0);
          }, 0)
      }));
    }
  };

  const handleNext = () => {
    if (!selectedTier) return;
    navigate('/campaign-builder/step-4');
  };

  const openPreview = (tierId: string) => {
    setPreviewTier(tierId);
    setShowPreview(true);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-pink-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-600/5 rounded-full blur-2xl animate-float"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/campaign-builder/step-2')}
            className="glass-button text-white hover:bg-white/15 mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="glass-card-strong p-4 animate-fade-in">
            <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
              Campaign Builder
            </h1>
            <div className="h-1 w-full bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 rounded-full mt-2 animate-shimmer"></div>
          </div>
        </div>

        <ProgressBar currentStep={3} totalSteps={5} />

        {/* Step Title */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Choose Your Syndication Tier 🚀
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Scale your reach across platforms with our content distribution network
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="flex-1">
            {/* Tier Selection Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {tiers.map((tier) => (
                <Card
                  key={tier.id}
                  className={`glass-card cursor-pointer transition-all duration-500 hover:scale-105 hover-glow relative group ${
                    selectedTier === tier.id ? 'ring-2 ring-purple-400 scale-105 glow-strong' : ''
                  }`}
                  onClick={() => handleTierSelect(tier.id)}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                        <Star className="h-4 w-4" />
                        🔥 MOST POPULAR
                      </div>
                    </div>
                  )}
                  
                  <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} opacity-10 rounded-3xl group-hover:opacity-20 transition-opacity`}></div>
                  
                  <CardContent className="p-6 text-center relative z-10">
                    <h3 className="text-3xl font-bold text-white mb-2">{tier.name}</h3>
                    <div className="flex items-baseline justify-center mb-1">
                      <span className="text-4xl font-bold text-white">${tier.price}</span>
                      <span className="text-white/60 ml-1">/month</span>
                    </div>
                    <p className="text-white/80 mb-6">{tier.accounts}</p>
                    
                    {/* Platform Icons */}
                    <div className="flex justify-center gap-2 mb-6 flex-wrap">
                      {tier.platforms.map((platform) => (
                        <div key={platform} className="glass-subtle rounded-full px-3 py-1 text-xs text-white font-medium">
                          {platform}
                        </div>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="space-y-3 text-left mb-6">
                      {tier.features.map((feature, index) => (
                        <div key={index} className="flex items-start text-white/90">
                          <Check className="h-4 w-4 mr-3 mt-0.5 text-green-400 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Preview Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openPreview(tier.id);
                      }}
                      className="glass-button w-full mb-4"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Preview Syndication
                    </Button>

                    {selectedTier === tier.id && (
                      <div className="glass-strong rounded-lg p-3 animate-scale-in">
                        <div className="flex items-center justify-center gap-2 text-white font-bold">
                          <Check className="h-5 w-5 text-green-400" />
                          Selected!
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add-On Toggles */}
            {selectedTier && (
              <Card className="glass-card mb-8 animate-fade-in">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Zap className="h-6 w-6 text-yellow-400" />
                    Power-Up Your Plan
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {addOns.map((addOn) => (
                      <div key={addOn.id} className="glass-subtle rounded-xl p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-semibold">{addOn.name}</h4>
                            <span className="text-purple-400 font-bold">+${addOn.price}</span>
                          </div>
                          <p className="text-white/70 text-sm">{addOn.description}</p>
                        </div>
                        <Switch
                          checked={selectedAddOns.includes(addOn.id)}
                          onCheckedChange={() => handleAddOnToggle(addOn.id)}
                          className="ml-4"
                        />
                      </div>
                    ))}
                  </div>
                  
                  {(selectedTierData && totalAddOnCost > 0) && (
                    <div className="mt-6 p-4 glass-strong rounded-xl">
                      <div className="flex justify-between items-center text-white">
                        <span className="text-lg">Monthly Total:</span>
                        <span className="text-2xl font-bold text-purple-400">
                          ${selectedTierData.price + totalAddOnCost}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Platform Breakdown Table */}
            <Card className="glass-card mb-8">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  Platform Coverage Breakdown 📊
                </h3>
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-4 gap-4 min-w-full">
                    {/* Header */}
                    <div className="text-white/80 font-semibold">Platform</div>
                    <div className="text-center text-white/80 font-semibold">Basic</div>
                    <div className="text-center text-white/80 font-semibold">Pro</div>
                    <div className="text-center text-white/80 font-semibold">Max</div>
                    
                    {/* TikTok Row */}
                    <div className="flex items-center gap-2 text-white">
                      <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded"></div>
                      TikTok
                    </div>
                    <div className="text-center text-white">{tiers[0].platformBreakdown.tiktok}</div>
                    <div className="text-center text-white">{tiers[1].platformBreakdown.tiktok}</div>
                    <div className="text-center text-white">{tiers[2].platformBreakdown.tiktok}</div>
                    
                    {/* Instagram Row */}
                    <div className="flex items-center gap-2 text-white">
                      <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded"></div>
                      Instagram
                    </div>
                    <div className="text-center text-white">{tiers[0].platformBreakdown.instagram}</div>
                    <div className="text-center text-white">{tiers[1].platformBreakdown.instagram}</div>
                    <div className="text-center text-white">{tiers[2].platformBreakdown.instagram}</div>
                    
                    {/* YouTube Row */}
                    <div className="flex items-center gap-2 text-white">
                      <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded"></div>
                      YouTube
                    </div>
                    <div className="text-center text-white/60">—</div>
                    <div className="text-center text-white">{tiers[1].platformBreakdown.youtube}</div>
                    <div className="text-center text-white">{tiers[2].platformBreakdown.youtube}</div>
                    
                    {/* Facebook Row */}
                    <div className="flex items-center gap-2 text-white">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
                      Facebook
                    </div>
                    <div className="text-center text-white">{tiers[0].platformBreakdown.facebook}</div>
                    <div className="text-center text-white">{tiers[1].platformBreakdown.facebook}</div>
                    <div className="text-center text-white">{tiers[2].platformBreakdown.facebook}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live KPI Estimator Sidebar */}
          {selectedTierData && (
            <div className="lg:w-80 space-y-6">
              <Card className="glass-card animate-fade-in sticky top-8">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    Performance Estimate
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="glass-subtle rounded-lg p-4">
                      <div className="text-white/70 text-sm mb-1">Estimated Views</div>
                      <div className="text-2xl font-bold text-purple-400">{selectedTierData.estimated.views}</div>
                    </div>
                    
                    <div className="glass-subtle rounded-lg p-4">
                      <div className="text-white/70 text-sm mb-1">Avg Engagement Rate</div>
                      <div className="text-2xl font-bold text-green-400">{selectedTierData.estimated.engagement}</div>
                    </div>
                    
                    <div className="glass-subtle rounded-lg p-4">
                      <div className="text-white/70 text-sm mb-1">Best Platform Match</div>
                      <div className="text-lg font-bold text-blue-400">{selectedTierData.estimated.bestPlatform}</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 glass-strong rounded-lg border border-yellow-400/30">
                    <div className="text-center">
                      <div className="text-yellow-400 font-semibold mb-2">💡 Pro Tip</div>
                      <div className="text-white/80 text-sm">
                        Need More Reach? Add a Boost in Step 4
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between max-w-4xl mx-auto mt-8">
          <Button
            variant="outline"
            onClick={() => navigate('/campaign-builder/step-2')}
            className="glass-button text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!selectedTier}
            className="glass-button-primary text-white font-bold px-8"
          >
            Next: Add Boost Options
          </Button>
        </div>

        {/* Help Button */}
        <Button
          className="fixed bottom-6 right-6 glass-button rounded-full p-4 hover:scale-110 transition-all duration-300"
          onClick={() => window.open('https://discord.gg/contentengine', '_blank')}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>

        {/* Floating decorative elements */}
        <div className="fixed top-20 right-20 w-4 h-4 bg-purple-400/30 rounded-full blur-sm animate-float"></div>
        <div className="fixed bottom-20 left-20 w-6 h-6 bg-blue-400/20 rounded-full blur-sm animate-float delay-500"></div>
        <div className="fixed top-1/2 right-10 w-3 h-3 bg-pink-400/25 rounded-full blur-sm animate-float delay-1000"></div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="glass-modal max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Syndication Preview</h3>
                <Button
                  variant="ghost"
                  onClick={() => setShowPreview(false)}
                  className="text-white hover:bg-white/10"
                >
                  ✕
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Mock platform previews */}
                <div className="glass-subtle rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded"></div>
                    TikTok Preview
                  </h4>
                  <div className="bg-black/50 rounded-lg aspect-[9/16] max-h-40 flex items-center justify-center">
                    <Play className="h-8 w-8 text-white/60" />
                  </div>
                </div>
                
                <div className="glass-subtle rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded"></div>
                    Instagram Preview
                  </h4>
                  <div className="bg-black/50 rounded-lg aspect-square max-h-40 flex items-center justify-center">
                    <Users className="h-8 w-8 text-white/60" />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-white/80">
                  Your content will be automatically optimized for each platform's best practices
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CampaignBuilderStep3;
