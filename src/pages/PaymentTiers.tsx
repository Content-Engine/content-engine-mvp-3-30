
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PAYMENT_TIERS } from "@/config/paymentTiers";
import PaymentTierCard from "@/components/PaymentTierCard";
import SubscriptionManager from "@/components/SubscriptionManager";
import { useSubscription } from "@/hooks/useSubscription";

const PaymentTiers = () => {
  const navigate = useNavigate();
  const { currentTier, upgradeToTier } = useSubscription();

  const handleSelectTier = (tierId: string) => {
    upgradeToTier(tierId);
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
          <h1 className="text-3xl font-bold text-white">Payment Plans</h1>
        </div>

        {/* Current Subscription Status */}
        <div className="mb-12">
          <SubscriptionManager />
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Choose Your Content Engine Power
          </h2>
          <p className="text-xl text-white/80">
            One-time payment for lifetime access to your chosen tier
          </p>
        </div>

        {/* Payment Tiers */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PAYMENT_TIERS.map((tier, index) => (
            <PaymentTierCard
              key={tier.id}
              tier={tier}
              currentTier={currentTier}
              onSelectTier={handleSelectTier}
              isPopular={index === 1} // Pro tier is popular
            />
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Compare All Features
          </h3>
          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3">Feature</th>
                    <th className="text-center py-3">Basic</th>
                    <th className="text-center py-3">Pro</th>
                    <th className="text-center py-3">Executive</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  <tr className="border-b border-white/10">
                    <td className="py-3">Syndication Accounts</td>
                    <td className="text-center py-3">5</td>
                    <td className="text-center py-3">15</td>
                    <td className="text-center py-3">50</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3">Team Seats</td>
                    <td className="text-center py-3">1</td>
                    <td className="text-center py-3">5</td>
                    <td className="text-center py-3">20</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3">Advanced Analytics</td>
                    <td className="text-center py-3">✗</td>
                    <td className="text-center py-3">✓</td>
                    <td className="text-center py-3">✓</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3">Boosted Syndication</td>
                    <td className="text-center py-3">✗</td>
                    <td className="text-center py-3">✓</td>
                    <td className="text-center py-3">✓</td>
                  </tr>
                  <tr>
                    <td className="py-3">Custom Add-ons</td>
                    <td className="text-center py-3">✗</td>
                    <td className="text-center py-3">✗</td>
                    <td className="text-center py-3">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Payment Security Notice */}
        <div className="mt-12 text-center">
          <p className="text-white/60 text-sm">
            🔒 Secure payments powered by Stripe • One-time purchase • No recurring charges
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentTiers;
