
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const goals = [
  {
    id: "awareness",
    title: "📢 Brand Awareness",
    description: "Increase visibility and reach new audiences across platforms",
    tooltip: "Best for new brands looking to build recognition",
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30"
  },
  {
    id: "retention", 
    title: "🔄 Audience Retention",
    description: "Keep existing fans engaged and actively participating",
    tooltip: "Perfect for maintaining community engagement",
    gradient: "from-green-500/20 to-emerald-500/20",
    border: "border-green-500/30"
  },
  {
    id: "conversion",
    title: "💰 Drive Conversions",
    description: "Convert viewers into customers or subscribers",
    tooltip: "Ideal for businesses with specific conversion goals",
    gradient: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/30"
  }
];

interface Step1GoalProps {
  selectedGoal: string;
  onGoalSelect: (goal: string) => void;
  onNext: () => void;
}

const Step1Goal = ({ selectedGoal, onGoalSelect, onNext }: Step1GoalProps) => {
  const { toast } = useToast();

  const handleGoalSelect = (goalId: string) => {
    onGoalSelect(goalId);
    toast({
      title: "Goal Selected",
      description: `Campaign goal set to ${goals.find(g => g.id === goalId)?.title}`,
    });
  };

  const handleContinue = () => {
    if (!selectedGoal) {
      toast({
        title: "Selection Required",
        description: "Please select a campaign goal to continue",
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
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Choose Your Campaign Goal
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select your primary objective to optimize content distribution and performance tracking
        </p>
      </div>

      {/* Goal Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <Card
            key={goal.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
              selectedGoal === goal.id 
                ? `ring-2 ring-blue-500 shadow-lg bg-gradient-to-br ${goal.gradient} ${goal.border}` 
                : 'hover:shadow-md border-gray-200'
            }`}
            onClick={() => handleGoalSelect(goal.id)}
          >
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  {goal.title}
                </h3>
                <div className="group relative">
                  <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {goal.tooltip}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-base leading-relaxed">
                {goal.description}
              </p>
              {selectedGoal === goal.id && (
                <Badge className="bg-blue-500 text-white">
                  ✓ Selected
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Continue Button */}
      <div className="flex justify-center pt-6">
        <Button 
          onClick={handleContinue}
          size="lg" 
          className={`px-8 py-3 text-lg font-semibold rounded-2xl transition-all duration-300 ${
            selectedGoal 
              ? "bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!selectedGoal}
        >
          Continue to Upload Content →
        </Button>
      </div>

      {/* Helper Text */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          💡 Each goal optimizes your content distribution strategy and analytics differently
        </p>
      </div>
    </div>
  );
};

export default Step1Goal;
