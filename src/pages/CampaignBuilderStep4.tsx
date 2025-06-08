
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
    description: "Creates viral content variants with optimized captions",
    impact: "+45% reach",
    cost: "$25",
    gradient: "from-blue-500/20 to-cyan-600/20"
  },
  {
    id: "commentSeeding",
    name: "Comment Seeding",
    description: "Authentic engagement boost with strategic comments",
    impact: "+30% engagement",
    cost: "$15",
    gradient: "from-green-500/20 to-emerald-600/20"
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
    <div className="space-y-8">
      {/* Step Title */}
      <div className="text-center">
        <div className="glass-card-strong p-8 mb-6 inline-block">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-accent via-accent/80 to-accent bg-clip-text text-transparent mb-4">
            Boost Options ⚡
          </h2>
          <div className="h-1 w-full bg-gradient-to-r from-accent via-accent/80 to-accent rounded-full"></div>
        </div>
        <p className="text-lg text-foreground/90 glass-card-strong p-4 inline-block">
          Enhance your campaign performance with AI-powered boosts
        </p>
      </div>

      {/* Boost Options */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {boostOptions.map((boost) => (
          <Card
            key={boost.id}
            className={`frosted-glass bg-gradient-to-br ${boost.gradient} border-0 hover:scale-105 transition-all duration-500 relative overflow-hidden`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground text-xl">
                  {boost.name}
                </CardTitle>
                <Switch
                  checked={campaignData.boosts?.[boost.id] || false}
                  onCheckedChange={(checked) => handleBoostToggle(boost.id, checked)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90">{boost.description}</p>
              <div className="flex items-center justify-between">
                <Badge className="bg-green-500/20 text-green-200">
                  {boost.impact}
                </Badge>
                <span className="text-foreground font-bold">{boost.cost}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Continue Button */}
      <div className="text-center">
        <Button onClick={onNext} size="lg" className="glass-button-primary">
          Continue to Schedule
        </Button>
      </div>
    </div>
  );
};

export default CampaignBuilderStep4;
