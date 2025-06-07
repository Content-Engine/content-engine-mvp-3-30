
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
    gradient: "from-emerald-500/80 via-green-500/70 to-teal-600/80"
  },
  {
    id: "awareness",
    title: "📢 Brand Awareness",
    description: "Increase visibility and reach",
    gradient: "from-blue-500/80 via-cyan-500/70 to-indigo-600/80"
  },
  {
    id: "sales",
    title: "💰 Drive Sales",
    description: "Convert viewers to customers",
    gradient: "from-purple-500/80 via-violet-500/70 to-fuchsia-600/80"
  },
  {
    id: "leads",
    title: "📈 Generate Leads",
    description: "Capture emails and contacts",
    gradient: "from-orange-500/80 via-amber-500/70 to-red-600/80"
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
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 relative overflow-hidden">
      {/* Enhanced ambient background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30 animate-float"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/6 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="glass-button text-white hover:bg-white/15 mr-4 backdrop-blur-xl border border-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="glass-card-strong p-4">
            <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
              Campaign Builder
            </h1>
          </div>
        </div>

        <div className="animate-scale-in">
          <ProgressBar currentStep={1} totalSteps={5} />
        </div>

        {/* Enhanced Step Title */}
        <div className="text-center mb-12 animate-fade-in delay-200">
          <div className="glass-card-strong p-8 mb-6 inline-block">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4 drop-shadow-2xl">
              What's Your Goal? 🎯
            </h2>
            <div className="h-1 w-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full animate-shimmer"></div>
          </div>
          <p className="text-xl text-white/90 drop-shadow-lg glass-card-strong p-4 inline-block">
            Select your primary campaign objective to optimize content syndication
          </p>
        </div>

        {/* Enhanced Goal Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {goals.map((goal, index) => (
            <Card
              key={goal.id}
              className={`frosted-glass bg-gradient-to-br ${goal.gradient} border-0 cursor-pointer hover:scale-110 transition-all duration-500 relative overflow-hidden group animate-fade-in ${
                selectedGoal === goal.id ? 'ring-4 ring-white/50 scale-110 glow-strong' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleGoalSelect(goal.id)}
            >
              {/* Shimmer effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <CardContent className="p-8 text-center relative z-10">
                <h3 className="text-3xl font-bold text-white mb-4 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {goal.title}
                </h3>
                <p className="text-white/95 text-lg drop-shadow-md font-medium">
                  {goal.description}
                </p>
                {selectedGoal === goal.id && (
                  <div className="mt-6 text-white text-sm animate-scale-in font-semibold">
                    ✨ Selected! Advancing to next step...
                  </div>
                )}
              </CardContent>

              {/* Floating particles effect */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full animate-float"></div>
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/40 rounded-full animate-float delay-500"></div>
            </Card>
          ))}
        </div>

        {/* Enhanced Help Text */}
        <div className="text-center mt-16 animate-fade-in delay-500">
          <div className="glass-card-strong p-6 inline-block">
            <p className="text-white/80 text-lg font-medium">
              💡 Pro tip: Each goal optimizes content distribution and boosting strategies
            </p>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="fixed top-20 right-20 w-4 h-4 bg-purple-400/30 rounded-full blur-sm animate-float"></div>
        <div className="fixed bottom-20 left-20 w-6 h-6 bg-blue-400/20 rounded-full blur-sm animate-float delay-700"></div>
        <div className="fixed top-1/3 right-10 w-3 h-3 bg-pink-400/25 rounded-full blur-sm animate-float delay-1200"></div>
      </div>
    </div>
  );
};

export default CampaignBuilderStep1;
