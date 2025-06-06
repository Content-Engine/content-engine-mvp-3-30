
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { PaymentTier } from "@/types/syndication";

interface PaymentTierCardProps {
  tier: PaymentTier;
  currentTier?: string;
  onSelectTier: (tierId: string) => void;
  isPopular?: boolean;
}

const PaymentTierCard = ({ tier, currentTier, onSelectTier, isPopular }: PaymentTierCardProps) => {
  const isCurrentTier = currentTier === tier.id;
  
  return (
    <Card className={`relative hover:scale-105 transition-all duration-300 ${
      isPopular ? 'ring-2 ring-purple-500 scale-105' : ''
    } ${isCurrentTier ? 'bg-green-50 border-green-300' : ''}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold">
            Most Popular
          </span>
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
          <div className="text-4xl font-bold text-purple-600 mb-2">
            ${tier.price}
            <span className="text-lg text-gray-500 font-normal">/month</span>
          </div>
          <p className="text-gray-600">{tier.description}</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-3" />
            <span>{tier.features.syndicationAccounts} syndication accounts</span>
          </div>
          
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-3" />
            <span>{tier.features.teamSeats} team seat{tier.features.teamSeats > 1 ? 's' : ''}</span>
          </div>
          
          {tier.features.advancedDashboards && (
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-3" />
              <span>Advanced analytics dashboards</span>
            </div>
          )}
          
          {tier.features.boostedSyndication && (
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-3" />
              <span>Boosted syndication (ads + bots)</span>
            </div>
          )}
          
          {tier.features.customAddOns && (
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-3" />
              <span>Custom add-ons & integrations</span>
            </div>
          )}
        </div>

        <Button
          onClick={() => onSelectTier(tier.id)}
          className={`w-full ${
            isCurrentTier
              ? 'bg-green-600 hover:bg-green-700'
              : isPopular
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
              : 'bg-gray-800 hover:bg-gray-900'
          } text-white font-bold`}
          disabled={isCurrentTier}
        >
          {isCurrentTier ? 'Current Plan' : `Upgrade to ${tier.name}`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentTierCard;
