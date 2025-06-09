
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DEV_MODE } from "@/config/dev";

const goals = [
  {
    id: "awareness",
    title: "📢 Brand Awareness",
    description: "Increase visibility and reach new audiences",
    gradient: "from-blue-500/80 via-cyan-500/70 to-indigo-600/80"
  },
  {
    id: "retention", 
    title: "🔄 Audience Retention",
    description: "Keep existing fans engaged and active",
    gradient: "from-green-500/80 via-emerald-500/70 to-teal-600/80"
  },
  {
    id: "conversion",
    title: "💰 Drive Conversions",
    description: "Convert viewers into customers or subscribers",
    gradient: "from-purple-500/80 via-violet-500/70 to-fuchsia-600/80"
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
  console.log('onNext function exists:', !!onNext);
  console.log('DEV_MODE.DISABLE_AUTH:', DEV_MODE.DISABLE_AUTH);

  const handleGoalSelect = (goalId: string) => {
    console.log('=== GOAL SELECTION ===');
    console.log('Goal selected:', goalId);
    console.log('Updating campaign data with goal:', goalId);
    
    updateCampaignData({ goal: goalId });
    
    console.log('Campaign data after update should have goal:', goalId);
  };

  const handleContinue = () => {
    console.log('=== CONTINUE BUTTON CLICKED ===');
    console.log('Current goal in campaignData:', campaignData.goal);
    console.log('DEV_MODE bypass active:', DEV_MODE.DISABLE_AUTH);
    console.log('onNext function exists:', !!onNext);
    
    // In dev mode, allow bypassing validation
    const canProceed = DEV_MODE.DISABLE_AUTH || campaignData.goal;
    
    if (canProceed && onNext) {
      console.log('✅ Proceeding to next step');
      console.log('Calling onNext() now...');
      onNext();
      console.log('✅ onNext() called successfully');
    } else {
      console.log('❌ Cannot continue');
      if (!campaignData.goal && !DEV_MODE.DISABLE_AUTH) {
        console.log('Reason: No goal selected and not in dev mode');
      }
      if (!onNext) {
        console.log('Reason: onNext function missing');
      }
    }
  };

  // Determine if we can continue
  const canContinue = DEV_MODE.DISABLE_AUTH || !!campaignData.goal;
  
  console.log('=== VALIDATION STATE ===');
  console.log('Can continue:', canContinue);
  console.log('Reason: Dev mode bypass =', DEV_MODE.DISABLE_AUTH, '|| Goal selected =', !!campaignData.goal);

  return (
    <div className="space-y-8">
      {/* Step Title */}
      <div className="text-center">
        <div className="glass-card-strong p-8 mb-6 inline-block">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Choose Your Campaign Goal 🎯
          </h2>
          <div className="h-1 w-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full"></div>
        </div>
        <p className="text-lg text-white/90 glass-card-strong p-4 inline-block">
          Select your primary objective to optimize content distribution
        </p>
      </div>

      {/* Goal Selection */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {goals.map((goal, index) => (
          <Card
            key={goal.id}
            className={`frosted-glass bg-gradient-to-br ${goal.gradient} border-0 cursor-pointer hover:scale-105 transition-all duration-500 relative overflow-hidden group ${
              campaignData.goal === goal.id ? 'ring-4 ring-white/50 scale-105 glow-strong' : ''
            }`}
            onClick={() => handleGoalSelect(goal.id)}
          >
            <CardContent className="p-6 text-center relative z-10">
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">
                {goal.title}
              </h3>
              <p className="text-white/95 font-medium">
                {goal.description}
              </p>
              {campaignData.goal === goal.id && (
                <div className="mt-4 text-white text-sm font-semibold">
                  ✨ Selected!
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Continue Button - Enhanced for debugging */}
      <div className="text-center">
        <Button 
          onClick={handleContinue}
          size="lg" 
          className={canContinue ? "glass-button-primary" : "glass-button-secondary"}
          disabled={!canContinue}
        >
          {canContinue ? 
            "Continue to Upload Content →" : 
            "Select a goal to continue"
          }
        </Button>
        
        {/* Status info */}
        <div className="mt-4 space-y-2">
          {campaignData.goal && (
            <p className="text-green-400 text-sm">
              ✅ Goal selected: {campaignData.goal}
            </p>
          )}
          
          {DEV_MODE.DISABLE_AUTH && (
            <p className="text-yellow-400 text-sm">
              🔧 Dev Mode: Can bypass validation
            </p>
          )}
        </div>
      </div>

      {/* Enhanced Debug Panel */}
      <div className="text-center">
        <div className="glass-card-strong p-4 inline-block">
          <div className="text-white/80 text-sm space-y-1">
            <p>🔍 Step 1 Debug Info:</p>
            <p>Selected Goal: "{campaignData.goal || 'none'}"</p>
            <p>Can Continue: {canContinue ? '✅' : '❌'}</p>
            <p>Dev Mode: {DEV_MODE.DISABLE_AUTH ? '🔧 Active' : '❌ Disabled'}</p>
            <p>onNext Available: {!!onNext ? '✅' : '❌'}</p>
            <p>Button Enabled: {canContinue ? '✅' : '❌'}</p>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="text-center">
        <div className="glass-card-strong p-4 inline-block">
          <p className="text-white/80 font-medium">
            💡 Each goal optimizes content distribution and boost strategies differently
          </p>
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilderStep1;
