
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DEV_MODE } from "@/config/dev";

const goals = [
  {
    id: "awareness",
    title: "📢 Brand Awareness",
    description: "Increase visibility and reach new audiences",
    gradient: "from-blue-500/10 to-cyan-500/10"
  },
  {
    id: "retention", 
    title: "🔄 Audience Retention",
    description: "Keep existing fans engaged and active",
    gradient: "from-green-500/10 to-emerald-500/10"
  },
  {
    id: "conversion",
    title: "💰 Drive Conversions",
    description: "Convert viewers into customers or subscribers",
    gradient: "from-purple-500/10 to-violet-500/10"
  }
];

interface CampaignBuilderStep1Props {
  campaignData: any;
  updateCampaignData: (updates: any) => void;
  onNext: () => void;
}

const CampaignBuilderStep1 = ({ campaignData, updateCampaignData, onNext }: CampaignBuilderStep1Props) => {
  console.log('=== STEP 1 COMPONENT LOADED ===');
  console.log('Current campaignData:', campaignData);
  console.log('Current goal:', campaignData.goal);

  const handleGoalSelect = (goalId: string) => {
    console.log('Goal selected:', goalId);
    updateCampaignData({ goal: goalId });
  };

  const handleContinue = () => {
    console.log('=== CONTINUE BUTTON CLICKED ===');
    console.log('Current goal in campaignData:', campaignData.goal);
    
    const canProceed = DEV_MODE.DISABLE_AUTH || campaignData.goal;
    
    if (canProceed && onNext) {
      console.log('✅ Proceeding to next step');
      onNext();
    } else {
      console.log('❌ Cannot continue - no goal selected');
    }
  };

  const canContinue = DEV_MODE.DISABLE_AUTH || !!campaignData.goal;

  return (
    <div className="animate-fade-in spacing-content">
      {/* Step Header */}
      <div className="text-center space-y-4">
        <div className="card-glass p-8 inline-block">
          <h2 className="text-display bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent mb-4">
            Choose Your Campaign Goal 🎯
          </h2>
          <div className="h-1 w-full bg-gradient-to-r from-accent to-accent/80 rounded-full"></div>
        </div>
        <p className="text-body text-text-muted card-glass p-4 inline-block max-w-2xl">
          Select your primary objective to optimize content distribution and performance metrics
        </p>
      </div>

      {/* Goal Selection Grid */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {goals.map((goal) => (
          <Card
            key={goal.id}
            className={`card-glass cursor-pointer hover:scale-105 transition-all duration-300 relative overflow-hidden group border-2 ${
              campaignData.goal === goal.id 
                ? 'border-accent shadow-lg shadow-accent/20 scale-105' 
                : 'border-border-color hover:border-accent/50'
            }`}
            onClick={() => handleGoalSelect(goal.id)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${goal.gradient} opacity-50`} />
            
            <CardContent className="p-6 text-center relative z-10">
              <h3 className="text-heading-3 text-text-main mb-3 group-hover:scale-110 transition-transform duration-300">
                {goal.title}
              </h3>
              <p className="text-body-sm text-text-muted">
                {goal.description}
              </p>
              {campaignData.goal === goal.id && (
                <div className="mt-4 flex items-center justify-center">
                  <span className="status-active">
                    ✨ Selected
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Continue Button */}
      <div className="text-center space-y-4">
        <Button 
          onClick={handleContinue}
          size="lg" 
          className={canContinue ? "btn-primary" : "btn-secondary"}
          disabled={!canContinue}
        >
          {canContinue ? 
            "Continue to Upload Content →" : 
            "Select a goal to continue"
          }
        </Button>
        
        {/* Status Feedback */}
        {campaignData.goal && (
          <div className="card-surface p-3 inline-block">
            <p className="text-caption text-green-400">
              ✅ Goal selected: <span className="font-medium">{campaignData.goal}</span>
            </p>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="text-center">
        <div className="card-surface p-4 inline-block max-w-md">
          <p className="text-caption text-text-muted">
            💡 Each goal optimizes content distribution strategies and boost recommendations differently
          </p>
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilderStep1;
