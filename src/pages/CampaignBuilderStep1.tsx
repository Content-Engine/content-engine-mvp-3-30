
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import ProgressBar from "@/components/ProgressBar";
import { ArrowLeft } from "lucide-react";

const goals = [
  {
    id: "streams",
    title: "🎧 Boost Streams",
    description: "Drive music streaming and playlist adds",
    gradient: "from-green-500 to-emerald-600"
  },
  {
    id: "awareness",
    title: "📢 Brand Awareness",
    description: "Increase visibility and reach",
    gradient: "from-blue-500 to-cyan-600"
  },
  {
    id: "sales",
    title: "💰 Drive Sales",
    description: "Convert viewers to customers",
    gradient: "from-purple-500 to-pink-600"
  },
  {
    id: "leads",
    title: "📈 Generate Leads",
    description: "Capture emails and contacts",
    gradient: "from-orange-500 to-red-600"
  }
];

const CampaignBuilderStep1 = () => {
  const navigate = useNavigate();
  const [selectedGoal, setSelectedGoal] = useState<string>("");

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId);
    // Save to localStorage (would be Airtable in production)
    localStorage.setItem('campaignGoal', goalId);
    
    // Auto-advance after selection
    setTimeout(() => {
      navigate('/campaign-builder/step-2');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10 mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-white">Campaign Builder</h1>
        </div>

        <ProgressBar currentStep={1} totalSteps={5} />

        {/* Step Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
            What's Your Goal? 🎯
          </h2>
          <p className="text-xl text-white/80">
            Select your primary campaign objective to optimize content syndication
          </p>
        </div>

        {/* Goal Selection */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {goals.map((goal) => (
            <Card
              key={goal.id}
              className={`bg-gradient-to-br ${goal.gradient} border-0 cursor-pointer hover:scale-105 transition-all duration-300 ${
                selectedGoal === goal.id ? 'ring-4 ring-white/50 scale-105' : ''
              }`}
              onClick={() => handleGoalSelect(goal.id)}
            >
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-3">{goal.title}</h3>
                <p className="text-white/90 text-lg">{goal.description}</p>
                {selectedGoal === goal.id && (
                  <div className="mt-4 text-white text-sm animate-fade-in">
                    ✨ Selected! Advancing to next step...
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Text */}
        <div className="text-center mt-12">
          <p className="text-white/60">
            💡 Pro tip: Each goal optimizes content distribution and boosting strategies
          </p>
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilderStep1;
