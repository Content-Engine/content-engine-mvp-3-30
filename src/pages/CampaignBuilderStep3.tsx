
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import ProgressBar from "@/components/ProgressBar";
import { ArrowLeft, Check } from "lucide-react";

const tiers = [
  {
    id: "basic",
    name: "Basic",
    price: "$99",
    accounts: "5 accounts",
    platforms: ["TikTok", "Instagram"],
    features: [
      "5 syndication accounts",
      "Basic analytics",
      "48hr posting window",
      "Standard captions"
    ],
    gradient: "from-blue-500 to-blue-600",
    popular: false
  },
  {
    id: "pro",
    name: "Pro",
    price: "$299",
    accounts: "15 accounts",
    platforms: ["TikTok", "Instagram", "YouTube", "Facebook"],
    features: [
      "15 syndication accounts",
      "Advanced analytics",
      "24hr posting window",
      "AI-optimized captions",
      "Custom hashtag sets",
      "Priority support"
    ],
    gradient: "from-purple-500 to-pink-600",
    popular: true
  },
  {
    id: "max",
    name: "Max",
    price: "$599",
    accounts: "30+ accounts",
    platforms: ["TikTok", "Instagram", "YouTube", "Facebook"],
    features: [
      "30+ syndication accounts",
      "Real-time analytics",
      "Instant posting",
      "AI-optimized captions",
      "Custom hashtag sets",
      "Priority support",
      "Dedicated account manager",
      "Custom integrations"
    ],
    gradient: "from-orange-500 to-red-600",
    popular: false
  }
];

const CampaignBuilderStep3 = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<string>("");

  const handleTierSelect = (tierId: string) => {
    setSelectedTier(tierId);
    // Save to localStorage (would be Airtable in production)
    localStorage.setItem('campaignTier', tierId);
  };

  const handleNext = () => {
    if (!selectedTier) return;
    navigate('/campaign-builder/step-4');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/campaign-builder/step-2')}
            className="text-white hover:bg-white/10 mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-white">Campaign Builder</h1>
        </div>

        <ProgressBar currentStep={3} totalSteps={5} />

        {/* Step Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Choose Your Syndication Tier 🚀
          </h2>
          <p className="text-xl text-white/80">
            Scale your reach across platforms with our content distribution network
          </p>
        </div>

        {/* Tier Selection */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              className={`bg-gradient-to-br ${tier.gradient} border-0 cursor-pointer hover:scale-105 transition-all duration-300 relative ${
                selectedTier === tier.id ? 'ring-4 ring-white/50 scale-105' : ''
              }`}
              onClick={() => handleTierSelect(tier.id)}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                    🔥 MOST POPULAR
                  </span>
                </div>
              )}
              
              <CardContent className="p-6 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="text-4xl font-bold text-white mb-1">{tier.price}</div>
                <p className="text-white/80 mb-4">{tier.accounts}</p>
                
                {/* Platform Icons */}
                <div className="flex justify-center gap-2 mb-6">
                  {tier.platforms.map((platform) => (
                    <div key={platform} className="bg-white/20 rounded-full px-3 py-1 text-xs text-white">
                      {platform}
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="space-y-2 text-left">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-white/90">
                      <Check className="h-4 w-4 mr-2 text-green-300" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {selectedTier === tier.id && (
                  <div className="mt-4 bg-white/20 rounded-lg p-2">
                    <span className="text-white font-bold">✨ Selected!</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Platform Coverage */}
        <Card className="bg-white/10 border-white/20 max-w-4xl mx-auto mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              Platform Coverage by Tier 📊
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { platform: "TikTok", basic: "2 accounts", pro: "4 accounts", max: "8+ accounts", color: "from-pink-500 to-purple-500" },
                { platform: "Instagram", basic: "2 accounts", pro: "4 accounts", max: "8+ accounts", color: "from-orange-500 to-pink-500" },
                { platform: "YouTube", basic: "Not included", pro: "3 accounts", max: "6+ accounts", color: "from-red-500 to-red-600" },
                { platform: "Facebook", basic: "1 account", pro: "4 accounts", max: "8+ accounts", color: "from-blue-500 to-blue-600" },
              ].map((item) => (
                <div key={item.platform} className={`bg-gradient-to-br ${item.color} rounded-lg p-4`}>
                  <h4 className="text-white font-bold text-center mb-2">{item.platform}</h4>
                  <div className="space-y-1 text-xs text-white/90">
                    <div>Basic: {item.basic}</div>
                    <div>Pro: {item.pro}</div>
                    <div>Max: {item.max}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={() => navigate('/campaign-builder/step-2')}
            className="border-white/30 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!selectedTier}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-8"
          >
            Next: Add Boost Options
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilderStep3;
