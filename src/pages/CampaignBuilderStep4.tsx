
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface CampaignBuilderStep4Props {
  campaignData: any;
  updateCampaignData: (updates: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const boostOptions = [
  {
    id: "echoClone",
    name: "Echo Clone Generator",
    description: "Creates viral content variants with optimized captions and hashtags",
    impact: "+45% reach",
    cost: "$25",
    gradient: "from-blue-500/10 to-cyan-600/10"
  },
  {
    id: "commentSeeding",
    name: "Comment Seeding",
    description: "Authentic engagement boost with strategic comments and interactions",
    impact: "+30% engagement",
    cost: "$15",
    gradient: "from-green-500/10 to-emerald-600/10"
  }
];

const CampaignBuilderStep4 = ({ campaignData, updateCampaignData, onNext }: CampaignBuilderStep4Props) => {
  const handleBoostToggle = (boostId: string, enabled: boolean) => {
    updateCampaignData({
      boosts: {
        ...campaignData.boosts,
        [boostId]: enabled
      }
    });
  };

  return (
    <div className="animate-fade-in spacing-content">
      {/* Step Header */}
      <div className="text-center space-y-4">
        <div className="card-glass p-8 inline-block">
          <h2 className="text-display bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent mb-4">
            Boost Options ⚡
          </h2>
          <div className="h-1 w-full bg-gradient-to-r from-accent to-accent/80 rounded-full"></div>
        </div>
        <p className="text-body text-text-muted card-glass p-4 inline-block max-w-2xl">
          Enhance your campaign performance with AI-powered engagement boosts
        </p>
      </div>

      {/* Boost Options Grid */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {boostOptions.map((boost) => (
          <Card
            key={boost.id}
            className="card-glass hover:scale-105 transition-all duration-300 relative overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${boost.gradient}`} />
            
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-heading-4 text-text-main">
                  {boost.name}
                </CardTitle>
                <Switch
                  checked={campaignData.boosts?.[boost.id] || false}
                  onCheckedChange={(checked) => handleBoostToggle(boost.id, checked)}
                />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4 relative z-10">
              <p className="text-body-sm text-text-muted">{boost.description}</p>
              
              <div className="flex items-center justify-between">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  {boost.impact}
                </Badge>
                <span className="text-heading-4 text-text-main font-bold">{boost.cost}</span>
              </div>
              
              {campaignData.boosts?.[boost.id] && (
                <div className="status-active w-fit">
                  ✨ Enabled
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Continue Button */}
      <div className="text-center">
        <Button 
          onClick={onNext} 
          size="lg" 
          className="btn-primary"
        >
          Continue to Schedule
        </Button>
      </div>

      {/* Summary */}
      <div className="text-center">
        <div className="card-surface p-4 inline-block">
          <p className="text-caption text-text-muted">
            {Object.values(campaignData.boosts || {}).filter(Boolean).length} boost{Object.values(campaignData.boosts || {}).filter(Boolean).length !== 1 ? 's' : ''} selected
          </p>
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilderStep4;
