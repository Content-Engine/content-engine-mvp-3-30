
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Zap, Users, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const tiers = [
  {
    id: "basic",
    name: "Basic",
    price: 99,
    accounts: 5,
    features: ["5 syndication accounts", "Basic analytics", "Standard support"],
    avgViews: "10K-25K",
    engagement: "2-4%",
    gradient: "from-gray-500/20 to-gray-600/20",
    border: "border-gray-500/30"
  },
  {
    id: "pro", 
    name: "Pro",
    price: 299,
    accounts: 15,
    features: ["15 syndication accounts", "Advanced analytics", "Priority support", "Comment seeding boost"],
    avgViews: "25K-75K",
    engagement: "4-8%",
    gradient: "from-blue-500/20 to-purple-600/20",
    border: "border-blue-500/30",
    popular: true
  },
  {
    id: "max",
    name: "Max",
    price: 599,
    accounts: 30,
    features: ["30+ syndication accounts", "Real-time analytics", "AI optimization", "All boost features"],
    avgViews: "75K-200K+",
    engagement: "8-15%",
    gradient: "from-purple-500/20 to-pink-600/20",
    border: "border-purple-500/30"
  }
];

interface Step3BoostProps {
  syndicationTier: string;
  echoPlatforms: number;
  autoFillLookalike: boolean;
  commentTemplates: string[];
  onTierSelect: (tierId: string) => void;
  onEchoPlatformsChange: (platforms: number) => void;
  onAutoFillToggle: (enabled: boolean) => void;
  onCommentTemplatesChange: (templates: string[]) => void;
  onNext: () => void;
}

const Step3Boost = ({ 
  syndicationTier, 
  echoPlatforms,
  autoFillLookalike,
  commentTemplates,
  onTierSelect,
  onEchoPlatformsChange,
  onAutoFillToggle,
  onCommentTemplatesChange,
  onNext 
}: Step3BoostProps) => {
  const [showBoostSettings, setShowBoostSettings] = useState(!!syndicationTier);
  const { toast } = useToast();

  const handleTierSelect = (tierId: string) => {
    onTierSelect(tierId);
    setShowBoostSettings(true);
    toast({
      title: "Tier Selected",
      description: `${tiers.find(t => t.id === tierId)?.name} tier selected`,
    });
  };

  const selectedTier = tiers.find(t => t.id === syndicationTier);
  const basePlatforms = 2;
  const extraPlatforms = Math.max(0, echoPlatforms - basePlatforms);
  const extraCost = extraPlatforms * 20;
  const estimatedReach = echoPlatforms * 15000; // Rough estimate

  const handleContinue = () => {
    if (!syndicationTier) {
      toast({
        title: "Selection Required",
        description: "Please select a syndication tier to continue",
        variant: "destructive",
      });
      return;
    }
    onNext();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
          Choose Your Syndication Tier
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Scale your content distribution across platforms with AI-powered boosts
        </p>
      </div>

      {!showBoostSettings ? (
        <>
          {/* Tier Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <Card
                key={tier.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl relative ${
                  syndicationTier === tier.id 
                    ? `ring-2 ring-blue-500 shadow-lg bg-gradient-to-br ${tier.gradient} ${tier.border}` 
                    : 'hover:shadow-md border-gray-200'
                } ${tier.popular ? 'ring-2 ring-yellow-400' : ''}`}
                onClick={() => handleTierSelect(tier.id)}
              >
                {tier.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    ${tier.price}
                    <span className="text-base font-normal text-gray-600">/month</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white/50 p-3 rounded-xl">
                      <Users className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                      <div className="text-sm text-gray-600">Accounts</div>
                      <div className="font-bold">{tier.accounts}</div>
                    </div>
                    <div className="bg-white/50 p-3 rounded-xl">
                      <TrendingUp className="h-5 w-5 text-green-500 mx-auto mb-1" />
                      <div className="text-sm text-gray-600">Avg Views</div>
                      <div className="font-bold text-xs">{tier.avgViews}</div>
                    </div>
                  </div>

                  <div className="text-center bg-white/50 p-3 rounded-xl">
                    <Zap className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
                    <div className="text-sm text-gray-600">Engagement Rate</div>
                    <div className="font-bold">{tier.engagement}</div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {syndicationTier === tier.id && (
                    <Badge className="w-full justify-center bg-blue-500 text-white">
                      ✓ Selected
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Boost Settings */}
          <div className="space-y-6">
            {/* Echo Boost Platforms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Echo Boost Platforms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Platforms: {echoPlatforms}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={extraCost > 0 ? "destructive" : "secondary"}>
                        {extraCost > 0 ? `+$${extraCost}` : 'Included'}
                      </Badge>
                      <Badge variant="outline">
                        Est. Reach: {estimatedReach.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                  
                  <Slider
                    value={[echoPlatforms]}
                    onValueChange={(value) => onEchoPlatformsChange(value[0])}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>1 platform</span>
                    <span>5 platforms</span>
                  </div>
                </div>
                
                {extraCost > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center text-yellow-800 mb-2">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span className="font-medium">Additional Cost</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      ${extraCost} for {extraPlatforms} extra platform{extraPlatforms !== 1 ? 's' : ''} beyond your plan limit
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Auto-Fill Lookalike */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Auto-Fill Lookalike Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Enable Auto-Fill</p>
                    <p className="text-sm text-gray-600">
                      Automatically post trending-style content when you're inactive
                    </p>
                  </div>
                  <Switch
                    checked={autoFillLookalike}
                    onCheckedChange={onAutoFillToggle}
                  />
                </div>
                
                {autoFillLookalike && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      ✨ Our AI will analyze trending content and create similar posts to maintain your posting schedule
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <Button
          variant="outline"
          onClick={() => setShowBoostSettings(false)}
          className="px-6 py-2"
          disabled={!showBoostSettings}
        >
          ← Back to Tiers
        </Button>
        
        <Button 
          onClick={handleContinue}
          size="lg" 
          className={`px-8 py-3 text-lg font-semibold rounded-2xl transition-all duration-300 ${
            syndicationTier
              ? "bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!syndicationTier}
        >
          Continue to Schedule →
        </Button>
      </div>
    </div>
  );
};

export default Step3Boost;
