
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PaymentTierCard from "@/components/PaymentTierCard";
import { PAYMENT_TIERS } from "@/config/paymentTiers";

const PaymentTiers = () => {
  const navigate = useNavigate();
  const [currentTier, setCurrentTier] = useState<string>('basic'); // This would come from user's account

  const handleSelectTier = (tierId: string) => {
    console.log(`Selected tier: ${tierId}`);
    // Here you would integrate with Stripe
    // For now, just update the current tier
    setCurrentTier(tierId);
    localStorage.setItem('userTier', tierId);
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
          <h1 className="text-3xl font-bold text-white">Choose Your Plan</h1>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Scale Your Syndication Power 🚀
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Choose the perfect plan to amplify your content across all platforms with our syndication engine
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {PAYMENT_TIERS.map((tier, index) => (
            <PaymentTierCard
              key={tier.id}
              tier={tier}
              currentTier={currentTier}
              onSelectTier={handleSelectTier}
              isPopular={index === 1} // Make the middle tier popular
            />
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white/10 border border-white/20 rounded-lg p-6 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            All plans include:
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-white/80">
            <div className="space-y-2">
              <div>• Multi-platform syndication</div>
              <div>• Real-time performance tracking</div>
              <div>• Content optimization tools</div>
            </div>
            <div className="space-y-2">
              <div>• 24/7 campaign monitoring</div>
              <div>• Automated posting schedules</div>
              <div>• Basic analytics dashboard</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTiers;
