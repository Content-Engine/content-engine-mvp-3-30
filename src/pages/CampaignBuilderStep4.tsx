
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import ProgressBar from "@/components/ProgressBar";
import { ArrowLeft, Zap, Bot, RotateCcw } from "lucide-react";

const boostOptions = [
  {
    id: "ad-boost",
    title: "🚀 Ad Boost",
    description: "Paid promotion across TikTok and Meta platforms",
    price: "+$199",
    icon: Zap,
    features: [
      "Targeted audience reach",
      "Conversion tracking",
      "A/B testing campaigns",
      "Real-time optimization"
    ],
    gradient: "from-purple-500 to-pink-600"
  },
  {
    id: "bot-boost",
    title: "🤖 Bot Boost",
    description: "In-house engagement loops for organic growth",
    price: "+$99",
    icon: Bot,
    features: [
      "Automated likes & comments",
      "Strategic timing",
      "Engagement velocity",
      "Growth acceleration"
    ],
    gradient: "from-blue-500 to-cyan-600"
  },
  {
    id: "auto-reshare",
    title: "🔁 Auto-Reshare",
    description: "Repost content if engagement targets aren't met",
    price: "+$49",
    icon: RotateCcw,
    features: [
      "Performance monitoring",
      "Smart reposting logic",
      "Optimal timing",
      "Engagement thresholds"
    ],
    gradient: "from-orange-500 to-red-600"
  }
];

const CampaignBuilderStep4 = () => {
  const navigate = useNavigate();
  const [selectedBoosts, setSelectedBoosts] = useState<string[]>([]);

  const toggleBoost = (boostId: string) => {
    setSelectedBoosts(prev => 
      prev.includes(boostId) 
        ? prev.filter(id => id !== boostId)
        : [...prev, boostId]
    );
  };

  const handleNext = () => {
    // Save to localStorage (would be Airtable in production)
    localStorage.setItem('campaignBoosts', JSON.stringify(selectedBoosts));
    navigate('/campaign-builder/step-5');
  };

  const calculateTotalCost = () => {
    const baseTier = localStorage.getItem('campaignTier');
    let basePrice = 0;
    
    switch(baseTier) {
      case 'basic': basePrice = 99; break;
      case 'pro': basePrice = 299; break;
      case 'max': basePrice = 599; break;
    }

    let boostCost = 0;
    selectedBoosts.forEach(boostId => {
      switch(boostId) {
        case 'ad-boost': boostCost += 199; break;
        case 'bot-boost': boostCost += 99; break;
        case 'auto-reshare': boostCost += 49; break;
      }
    });

    return basePrice + boostCost;
  };

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
            Supercharge Your Campaign ⚡
          </h2>
          <p className="text-xl text-white/80">
            Add boost options to maximize reach and engagement
          </p>
        </div>

        {/* Boost Options */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          {boostOptions.map((boost) => {
            const Icon = boost.icon;
            const isSelected = selectedBoosts.includes(boost.id);
            
            return (
              <Card
                key={boost.id}
                className={`bg-gradient-to-br ${boost.gradient} border-0 cursor-pointer transition-all duration-300 ${
                  isSelected ? 'ring-4 ring-white/50 scale-105' : 'hover:scale-105'
                }`}
                onClick={() => toggleBoost(boost.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="h-8 w-8 text-white" />
                    <Switch checked={isSelected} readOnly />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{boost.title}</h3>
                  <p className="text-white/90 mb-3">{boost.description}</p>
                  <div className="text-2xl font-bold text-white mb-4">{boost.price}</div>
                  
                  <div className="space-y-2">
                    {boost.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-white/80 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {isSelected && (
                    <div className="mt-4 bg-white/20 rounded-lg p-2 text-center">
                      <span className="text-white font-bold text-sm">✨ You've unlocked {boost.title.split(' ')[1]} Boost!</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Cost Summary */}
        <Card className="bg-white/10 border-white/20 max-w-2xl mx-auto mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 text-center">Campaign Cost Summary 💰</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-white">
                <span>Base Tier</span>
                <span>${calculateTotalCost() - selectedBoosts.reduce((sum, id) => {
                  switch(id) {
                    case 'ad-boost': return sum + 199;
                    case 'bot-boost': return sum + 99;
                    case 'auto-reshare': return sum + 49;
                    default: return sum;
                  }
                }, 0)}</span>
              </div>
              
              {selectedBoosts.map(boostId => {
                const boost = boostOptions.find(b => b.id === boostId);
                return (
                  <div key={boostId} className="flex justify-between text-white/80">
                    <span>{boost?.title}</span>
                    <span>{boost?.price}</span>
                  </div>
                );
              })}
              
              <div className="border-t border-white/30 pt-3">
                <div className="flex justify-between text-xl font-bold text-white">
                  <span>Total</span>
                  <span>${calculateTotalCost()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card className="bg-white/10 border-white/20 max-w-4xl mx-auto mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-white mb-3">💡 Pro Tips</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-white/80">
              <div>
                <strong className="text-white">Ad Boost:</strong> Best for sales campaigns with specific conversion goals
              </div>
              <div>
                <strong className="text-white">Bot Boost:</strong> Perfect for building initial momentum and social proof
              </div>
              <div>
                <strong className="text-white">Auto-Reshare:</strong> Ensures no content gets left behind in the algorithm
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between max-w-4xl mx-auto">
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
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-8"
          >
            Next: Schedule & Launch
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilderStep4;
