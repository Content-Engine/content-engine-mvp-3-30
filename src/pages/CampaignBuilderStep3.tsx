
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Target, Zap } from "lucide-react";

interface CampaignBuilderStep3Props {
  campaignData: any;
  updateCampaignData: (updates: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const syndicationTiers = [
  {
    id: "basic",
    name: "Basic Syndication",
    price: "$49",
    description: "Essential distribution across 3-5 platforms",
    features: [
      "Instagram, TikTok, YouTube",
      "Basic hashtag optimization",
      "Standard posting schedule",
      "Basic analytics"
    ],
    platforms: 3,
    reach: "10K-50K",
    gradient: "from-blue-500/10 to-cyan-500/10"
  },
  {
    id: "pro",
    name: "Pro Syndication",
    price: "$99",
    description: "Advanced distribution with boost options",
    features: [
      "All Basic platforms + Twitter, LinkedIn",
      "AI-powered hashtag optimization",
      "Prime-time posting optimization",
      "Advanced analytics & insights",
      "Echo clone generation"
    ],
    platforms: 5,
    reach: "50K-200K",
    gradient: "from-purple-500/10 to-violet-500/10",
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise Syndication",
    price: "$199",
    description: "Maximum reach with premium features",
    features: [
      "All platforms + custom channels",
      "AI content optimization",
      "24/7 performance monitoring",
      "Dedicated account manager",
      "Custom boost strategies",
      "Real-time optimization"
    ],
    platforms: 8,
    reach: "200K+",
    gradient: "from-yellow-500/10 to-orange-500/10"
  }
];

const CampaignBuilderStep3 = ({ campaignData, updateCampaignData, onNext, onPrevious }: CampaignBuilderStep3Props) => {
  const handleTierSelect = (tierId: string) => {
    updateCampaignData({ syndicationTier: tierId });
  };

  const canContinue = !!campaignData.syndicationTier;

  return (
    <div className="animate-fade-in spacing-content">
      {/* Step Header */}
      <div className="text-center space-y-4">
        <div className="card-glass p-8 inline-block">
          <h2 className="text-display bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent mb-4">
            Choose Syndication 🚀
          </h2>
          <div className="h-1 w-full bg-gradient-to-r from-accent to-accent/80 rounded-full"></div>
        </div>
        <p className="text-body text-text-muted card-glass p-4 inline-block max-w-2xl">
          Select your distribution strategy to maximize reach and engagement
        </p>
      </div>

      {/* Syndication Tiers Grid */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {syndicationTiers.map((tier) => (
          <Card
            key={tier.id}
            className={`card-glass cursor-pointer hover:scale-105 transition-all duration-300 relative overflow-hidden border-2 ${
              campaignData.syndicationTier === tier.id 
                ? 'border-accent shadow-lg shadow-accent/20 scale-105' 
                : 'border-border-color hover:border-accent/50'
            }`}
            onClick={() => handleTierSelect(tier.id)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient}`} />
            
            {tier.popular && (
              <div className="absolute top-4 right-4 z-20">
                <Badge className="bg-accent text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-heading-3 text-text-main">
                  {tier.name}
                </CardTitle>
                {campaignData.syndicationTier === tier.id && (
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <p className="text-body-sm text-text-muted">{tier.description}</p>
              <div className="text-heading-1 text-text-main font-bold">{tier.price}</div>
            </CardHeader>
            
            <CardContent className="space-y-4 relative z-10">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 card-surface rounded-lg">
                  <Target className="w-5 h-5 text-accent mx-auto mb-1" />
                  <p className="text-caption text-text-muted">Platforms</p>
                  <p className="text-body font-bold text-text-main">{tier.platforms}+</p>
                </div>
                <div className="text-center p-3 card-surface rounded-lg">
                  <Zap className="w-5 h-5 text-accent mx-auto mb-1" />
                  <p className="text-caption text-text-muted">Reach</p>
                  <p className="text-body font-bold text-text-main">{tier.reach}</p>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2">
                {tier.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-body-sm text-text-main">{feature}</span>
                  </div>
                ))}
              </div>

              {campaignData.syndicationTier === tier.id && (
                <div className="status-active w-fit mt-4">
                  ✨ Selected
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={onPrevious}
          className="text-text-muted hover:text-text-main"
        >
          Previous
        </Button>
        
        <Button 
          onClick={onNext}
          disabled={!canContinue}
          className={canContinue ? "btn-primary" : "btn-secondary"}
        >
          {canContinue ? "Continue to Boosts" : "Select a tier to continue"}
        </Button>
      </div>

      {/* Selected Summary */}
      {campaignData.syndicationTier && (
        <div className="text-center">
          <div className="card-surface p-4 inline-block">
            <p className="text-caption text-green-400">
              ✅ Tier selected: <span className="font-medium text-text-main">
                {syndicationTiers.find(t => t.id === campaignData.syndicationTier)?.name}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignBuilderStep3;
