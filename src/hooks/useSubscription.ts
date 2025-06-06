
import { useState, useEffect } from 'react';
import { PaymentTier } from '@/types/syndication';
import { PAYMENT_TIERS } from '@/config/paymentTiers';

interface SubscriptionState {
  currentTier: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useSubscription = () => {
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>({
    currentTier: 'basic', // Default to basic for demo
    isLoading: false,
    error: null,
  });

  const getCurrentTier = (): PaymentTier | undefined => {
    return PAYMENT_TIERS.find(tier => tier.id === subscriptionState.currentTier);
  };

  const upgradeToTier = async (tierId: string) => {
    setSubscriptionState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // This would integrate with Stripe checkout
      console.log(`Upgrading to tier: ${tierId}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscriptionState(prev => ({ 
        ...prev, 
        currentTier: tierId, 
        isLoading: false 
      }));
    } catch (error) {
      setSubscriptionState(prev => ({ 
        ...prev, 
        error: 'Failed to upgrade subscription', 
        isLoading: false 
      }));
    }
  };

  const cancelSubscription = async () => {
    setSubscriptionState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // This would integrate with Stripe customer portal
      console.log('Canceling subscription');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscriptionState(prev => ({ 
        ...prev, 
        currentTier: 'basic', 
        isLoading: false 
      }));
    } catch (error) {
      setSubscriptionState(prev => ({ 
        ...prev, 
        error: 'Failed to cancel subscription', 
        isLoading: false 
      }));
    }
  };

  return {
    ...subscriptionState,
    getCurrentTier,
    upgradeToTier,
    cancelSubscription,
  };
};
