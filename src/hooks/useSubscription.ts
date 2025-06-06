
import { useState, useEffect } from 'react';
import { PaymentTier } from '@/types/syndication';
import { PAYMENT_TIERS } from '@/config/paymentTiers';
import { STRIPE_CONFIG } from '@/config/stripe';
import { createClient } from '@supabase/supabase-js';

interface SubscriptionState {
  currentTier: string | null;
  isLoading: boolean;
  error: string | null;
}

// Initialize Supabase client (you'll need to add your actual URL and anon key)
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || '',
  process.env.REACT_APP_SUPABASE_ANON_KEY || ''
);

export const useSubscription = () => {
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>({
    currentTier: 'basic', // Default to basic for demo
    isLoading: false,
    error: null,
  });

  const getCurrentTier = (): PaymentTier | undefined => {
    return PAYMENT_TIERS.find(tier => tier.id === subscriptionState.currentTier);
  };

  const checkSubscriptionStatus = async () => {
    setSubscriptionState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setSubscriptionState(prev => ({ 
          ...prev, 
          currentTier: 'basic', 
          isLoading: false 
        }));
        return;
      }

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setSubscriptionState(prev => ({ 
        ...prev, 
        currentTier: data.subscription_tier || 'basic', 
        isLoading: false 
      }));
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscriptionState(prev => ({ 
        ...prev, 
        error: 'Failed to check subscription status', 
        isLoading: false 
      }));
    }
  };

  const upgradeToTier = async (tierId: string) => {
    setSubscriptionState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }

      const priceId = STRIPE_CONFIG.priceIds[tierId as keyof typeof STRIPE_CONFIG.priceIds];
      if (!priceId) {
        throw new Error('Invalid tier selected');
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      
      setSubscriptionState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      setSubscriptionState(prev => ({ 
        ...prev, 
        error: 'Failed to upgrade subscription', 
        isLoading: false 
      }));
    }
  };

  const openCustomerPortal = async () => {
    setSubscriptionState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      // Open customer portal in a new tab
      window.open(data.url, '_blank');
      
      setSubscriptionState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('Error opening customer portal:', error);
      setSubscriptionState(prev => ({ 
        ...prev, 
        error: 'Failed to open billing portal', 
        isLoading: false 
      }));
    }
  };

  // Check subscription status on mount and when auth state changes
  useEffect(() => {
    checkSubscriptionStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkSubscriptionStatus();
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    ...subscriptionState,
    getCurrentTier,
    upgradeToTier,
    openCustomerPortal,
    refreshSubscription: checkSubscriptionStatus,
  };
};
