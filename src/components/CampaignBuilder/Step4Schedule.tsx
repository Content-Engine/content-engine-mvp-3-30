
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const boostOptions = [
  {
    id: "echoClone",
    name: "Echo Clone Generator",
    description: "Creates viral content variants with optimized captions",
    impact: "+45% reach",
    cost: "$25",
    gradient: "from-blue-500/80 to-cyan-600/80"
  },
  {
    id: "commentSeeding",
    name: "Comment Seeding",
    description: "Authentic engagement boost with strategic comments",
    impact: "+30% engagement",
    cost: "$15",
    gradient: "from-green-500/80 to-emerald-600/80"
  }
];

interface Step4ScheduleProps {
  boosts: {
    echoClone: boolean;
    commentSeeding: boolean;
  };
  onBoostToggle: (boostId: string, enabled: boolean) => void;
  onNext: () => void;
}

const Step4Schedule = ({ boosts, onBoostToggle, onNext }: Step4ScheduleProps) => {
  return (
    <div className="space-y-8">
      {/* Step Title */}
      <div className="text-center">
        <div className="glass-card-strong p-8 mb-6 inline-block">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Boost Options ⚡
          </h2>
          <div className="h-1 w-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full"></div>
        </div>
        <p className="text-lg text-white/90 glass-card-strong p-4 inline-block">
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
                <CardTitle className="text-white text-xl">
                  {boost.name}
                </CardTitle>
                <Switch
                  checked={boosts?.[boost.id as keyof typeof boosts] || false}
                  onCheckedChange={(checked) => onBoostToggle(boost.id, checked)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/90">{boost.description}</p>
              <div className="flex items-center justify-between">
                <Badge className="bg-green-500/20 text-green-200">
                  {boost.impact}
                </Badge>
                <span className="text-white font-bold">{boost.cost}</span>
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

export default Step4Schedule;
