
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { PAYMENT_TIERS } from '@/config/paymentTiers';
import { CreditCard, Settings, Zap, RefreshCw } from 'lucide-react';

const SubscriptionManager = () => {
  const { 
    currentTier, 
    isLoading, 
    upgradeToTier, 
    getCurrentTier,
  } = useSubscription();
  const [showManagement, setShowManagement] = useState(false);
  
  const currentTierData = getCurrentTier();

  if (!currentTierData) {
    return (
      <Card className="bg-gradient-to-br from-gray-500/10 to-gray-500/10 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-gray-600" />
            Free Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">Upgrade to unlock premium features</p>
          <Button
            onClick={() => setShowManagement(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            View Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-purple-600" />
              Current Plan
            </span>
            <Badge variant="default" className="bg-purple-600">
              {currentTierData.name}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {currentTierData.features.syndicationAccounts}
              </div>
              <div className="text-sm text-gray-600">Accounts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {currentTierData.features.teamSeats}
              </div>
              <div className="text-sm text-gray-600">Team Seats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {currentTierData.features.advancedDashboards ? '✓' : '✗'}
              </div>
              <div className="text-sm text-gray-600">Analytics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {currentTierData.features.boostedSyndication ? '✓' : '✗'}
              </div>
              <div className="text-sm text-gray-600">Boost Mode</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowManagement(!showManagement)}
              className="flex-1"
              disabled={isLoading}
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage Plan
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/payment-tiers'}
              disabled={isLoading}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {isLoading ? 'Loading...' : 'Upgrade'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Options */}
      {showManagement && (
        <Card>
          <CardHeader>
            <CardTitle>Upgrade Your Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {PAYMENT_TIERS.filter(tier => tier.id !== currentTier).map((tier) => (
                <div key={tier.id} className="border rounded-lg p-4">
                  <h4 className="font-bold text-lg mb-2">{tier.name}</h4>
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    ${tier.price}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{tier.description}</p>
                  <Button
                    onClick={() => upgradeToTier(tier.id)}
                    disabled={isLoading}
                    className="w-full"
                    variant={tier.id === 'executive' ? 'default' : 'outline'}
                  >
                    {isLoading ? 'Processing...' : `Get ${tier.name}`}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubscriptionManager;
