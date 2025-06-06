
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import ProgressBar from "@/components/ProgressBar";
import { ArrowLeft, ArrowRight, Zap, Bot, RefreshCw, Target } from "lucide-react";

const boosts = [
  {
    id: "ad-boost",
    title: "🚀 Ad Boost",
    description: "Amplify reach with TikTok & Meta ads",
    cost: 199,
    features: ["Targeted advertising", "Lookalike audiences", "Performance optimization"],
    gradient: "from-red-500 to-pink-600"
  },
  {
    id: "bot-boost",
    title: "🤖 Bot Boost",
    description: "AI-powered engagement loops",
    cost: 99,
    features: ["Auto-comments", "Strategic likes", "Engagement timing"],
    gradient: "from-purple-500 to-indigo-600"
  },
  {
    id: "auto-reshare",
    title: "🔁 Auto-Reshare",
    description: "Repost if engagement targets missed",
    cost: 79,
    features: ["Performance monitoring", "Smart reposting", "Optimal timing"],
    gradient: "from-green-500 to-teal-600"
  },
  {
    id: "playlist-boost",
    title: "🎵 Playlist Boost",
    description: "Inject into curated playlists",
    cost: 149,
    features: ["Playlist placement", "Genre targeting", "Curator outreach"],
    gradient: "from-orange-500 to-red-600"
  }
];

const CampaignBuilderStep4 = () => {
  const navigate = useNavigate();
  const [selectedBoosts, setSelectedBoosts] = useState<string[]>([]);

  const handleBoostToggle = (boostId: string) => {
    setSelectedBoosts(prev => 
      prev.includes(boostId) 
        ? prev.filter(id => id !== boostId)
        : [...prev, boostId]
    );
  };

  const handleNext = () => {
    // Save selected boosts to localStorage (would be Airtable in production)
    localStorage.setItem('campaignBoosts', JSON.stringify(selectedBoosts));
    navigate('/campaign-builder/step-5');
  };

  const totalCost = boosts
    .filter(boost => selectedBoosts.includes(boost.id))
    .reduce((sum, boost) => sum + boost.cost, 0);

  const baseTierCost = {
    basic: 99,
    pro: 299,
    max: 599
  };
  
  const tier = localStorage.getItem('campaignTier') || 'basic';
  const finalCost = baseTierCost[tier as keyof typeof baseTierCost] + totalCost;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/campaign-builder/step-3')}
            className="text-white hover:bg-white/10 mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-white">Campaign Builder</h1>
        </div>

        <ProgressBar currentStep={4} totalSteps={5} />

        {/* Step Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Supercharge Your Campaign 🚀
          </h2>
          <p className="text-xl text-white/80">
            Add powerful boosts to maximize reach and engagement
          </p>
        </div>

        {/* Boost Options */}
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-8">
          {boosts.map((boost) => (
            <Card
              key={boost.id}
              className={`bg-gradient-to-br ${boost.gradient} border-0 hover:scale-105 transition-all duration-300 ${
                selectedBoosts.includes(boost.id) ? 'ring-4 ring-white/50 scale-105' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{boost.title}</h3>
                    <p className="text-white/90 mb-3">{boost.description}</p>
                    <div className="text-2xl font-bold text-white">${boost.cost}/mo</div>
                  </div>
                  
                  <Switch
                    checked={selectedBoosts.includes(boost.id)}
                    onCheckedChange={() => handleBoostToggle(boost.id)}
                  />
                </div>
                
                <div className="space-y-2">
                  {boost.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-white/80 text-sm">
                      <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cost Summary */}
        <Card className="bg-white/10 border-white/20 max-w-2xl mx-auto mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Campaign Summary
            </h3>
            
            <div className="space-y-3 text-white/80">
              <div className="flex justify-between">
                <span>Base Tier ({tier.toUpperCase()}):</span>
                <span className="text-white font-semibold">${baseTierCost[tier as keyof typeof baseTierCost]}/mo</span>
              </div>
              
              {selectedBoosts.length > 0 && (
                <>
                  <div className="border-t border-white/20 pt-3">
                    <div className="text-sm text-white/60 mb-2">Selected Boosts:</div>
                    {boosts
                      .filter(boost => selectedBoosts.includes(boost.id))
                      .map(boost => (
                        <div key={boost.id} className="flex justify-between text-sm">
                          <span>{boost.title}</span>
                          <span className="text-white">${boost.cost}/mo</span>
                        </div>
                      ))}
                  </div>
                </>
              )}
              
              <div className="border-t border-white/20 pt-3 flex justify-between text-lg font-bold text-white">
                <span>Total Monthly Cost:</span>
                <span>${finalCost}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <div className="text-center mb-8">
          <div className="bg-white/10 border border-white/20 rounded-lg p-4 max-w-2xl mx-auto">
            <h4 className="text-white font-semibold mb-2">💡 Pro Tips</h4>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• Bot Boost works best with consistent posting schedules</li>
              <li>• Auto-Reshare maximizes content lifespan and reach</li>
              <li>• Ad Boost + Playlist Boost = ultimate viral combo</li>
            </ul>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between max-w-2xl mx-auto">
          <Button
            variant="outline"
            onClick={() => navigate('/campaign-builder/step-3')}
            className="border-white/30 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold"
          >
            Continue to Launch
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilderStep4;
