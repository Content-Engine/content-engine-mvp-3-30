
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

interface Step1GoalProps {
  selectedGoal: string;
  onGoalSelect: (goalId: string) => void;
  onNext: () => void;
}

const Step1Goal = ({ selectedGoal, onGoalSelect, onNext }: Step1GoalProps) => {
  const canContinue = DEV_MODE.DISABLE_AUTH || !!selectedGoal;

  const handleContinue = () => {
    if (canContinue && onNext) {
      onNext();
    }
  };

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
        {goals.map((goal) => (
          <Card
            key={goal.id}
            className={`frosted-glass bg-gradient-to-br ${goal.gradient} border-0 cursor-pointer hover:scale-105 transition-all duration-500 relative overflow-hidden group ${
              selectedGoal === goal.id ? 'ring-4 ring-white/50 scale-105 glow-strong' : ''
            }`}
            onClick={() => onGoalSelect(goal.id)}
          >
            <CardContent className="p-6 text-center relative z-10">
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">
                {goal.title}
              </h3>
              <p className="text-white/95 font-medium">
                {goal.description}
              </p>
              {selectedGoal === goal.id && (
                <div className="mt-4 text-white text-sm font-semibold">
                  ✨ Selected!
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Continue Button */}
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
        
        {selectedGoal && (
          <p className="text-green-400 text-sm mt-4">
            ✅ Goal selected: {selectedGoal}
          </p>
        )}
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

export default Step1Goal;
