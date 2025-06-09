
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Zap, Users, TrendingUp } from "lucide-react";
import BoostSettings from "@/components/upload/BoostSettings";

const tiers = [
  {
    id: "basic",
    name: "Basic",
    price: 99,
    accounts: 5,
    features: [
      "5 syndication accounts",
      "Basic analytics",
      "Standard support",
      "Manual content approval"
    ],
    avgViews: "10K-25K",
    engagement: "2-4%",
    gradient: "from-gray-500/80 to-gray-600/80"
  },
  {
    id: "pro", 
    name: "Pro",
    price: 299,
    accounts: 15,
    features: [
      "15 syndication accounts",
      "Advanced analytics",
      "Priority support", 
      "Auto-approval rules",
      "Comment seeding boost"
    ],
    avgViews: "25K-75K",
    engagement: "4-8%",
    gradient: "from-blue-500/80 to-purple-600/80",
    popular: true
  },
  {
    id: "max",
    name: "Max",
    price: 599,
    accounts: 30,
    features: [
      "30+ syndication accounts",
      "Real-time analytics",
      "Dedicated support",
      "AI-powered optimization",
      "All boost features",
      "Custom integrations"
    ],
    avgViews: "75K-200K+",
    engagement: "8-15%",
    gradient: "from-purple-500/80 to-pink-600/80"
  }
];

interface CampaignBuilderStep3Props {
  campaignData: any;
  updateCampaignData: (updates: any) => void;
  onNext: () => void;
}

const CampaignBuilderStep3 = ({ campaignData, updateCampaignData, onNext }: CampaignBuilderStep3Props) => {
  const [showBoostSettings, setShowBoostSettings] = useState(false);

  const handleTierSelect = (tierId: string) => {
    updateCampaignData({ syndicationTier: tierId });
    setShowBoostSettings(true);
  };

  const handleEchoPlatformsChange = (platforms: number) => {
    updateCampaignData({ echo_boost_platforms: platforms });
  };

  const handleAutoFillToggle = (enabled: boolean) => {
    updateCampaignData({ auto_fill_lookalike: enabled });
  };

  const handleCommentTemplatesChange = (templates: string[]) => {
    updateCampaignData({ comment_templates: templates });
  };

  const handleContinue = () => {
    if (showBoostSettings) {
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      {/* Step Title */}
      <div className="text-center">
        <div className="glass-card-strong p-8 mb-6 inline-block">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Choose Your Syndication Tier 🚀
          </h2>
          <div className="h-1 w-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full"></div>
        </div>
        <p className="text-lg text-white/90 glass-card-strong p-4 inline-block">
          Scale your content distribution across platforms
        </p>
      </div>

      {!showBoostSettings ? (
        <>
          {/* Tier Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {tiers.map((tier) => (
              <Card
                key={tier.id}
                className={`frosted-glass bg-gradient-to-br ${tier.gradient} border-0 cursor-pointer hover:scale-105 transition-all duration-500 relative overflow-hidden group ${
                  campaignData.syndicationTier === tier.id ? 'ring-4 ring-white/50 scale-105 glow-strong' : ''
                } ${tier.popular ? 'ring-2 ring-yellow-400/50' : ''}`}
                onClick={() => handleTierSelect(tier.id)}
              >
                {tier.popular && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                    {tier.name}
                  </CardTitle>
                  <div className="text-4xl font-bold text-white">
                    ${tier.price}
                    <span className="text-lg font-normal text-white/80">/month</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="glass-card-subtle p-3 rounded-lg">
                      <Users className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                      <div className="text-sm text-white/80">Accounts</div>
                      <div className="font-bold text-white">{tier.accounts}</div>
                    </div>
                    <div className="glass-card-subtle p-3 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-400 mx-auto mb-1" />
                      <div className="text-sm text-white/80">Avg Views</div>
                      <div className="font-bold text-white text-xs">{tier.avgViews}</div>
                    </div>
                  </div>

                  <div className="text-center glass-card-subtle p-3 rounded-lg">
                    <Zap className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
                    <div className="text-sm text-white/80">Engagement Rate</div>
                    <div className="font-bold text-white">{tier.engagement}</div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-white/90">
                        <Check className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {campaignData.syndicationTier === tier.id && (
                    <div className="text-center">
                      <div className="text-green-400 font-semibold text-sm">
                        ✨ Selected! Configure boost settings below...
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Help Text */}
          <div className="text-center">
            <div className="glass-card-strong p-4 inline-block">
              <p className="text-white/80 font-medium">
                💡 Click any tier to select and configure boost options
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Boost Settings */}
          <BoostSettings
            echoPlatforms={campaignData.echo_boost_platforms || 1}
            autoFillLookalike={campaignData.auto_fill_lookalike || false}
            commentTemplates={campaignData.comment_templates || []}
            onEchoPlatformsChange={handleEchoPlatformsChange}
            onAutoFillToggle={handleAutoFillToggle}
            onCommentTemplatesChange={handleCommentTemplatesChange}
          />

          {/* Continue Button */}
          <div className="text-center">
            <Button onClick={handleContinue} size="lg" className="glass-button-primary">
              Continue to Platform Targets
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CampaignBuilderStep3;
