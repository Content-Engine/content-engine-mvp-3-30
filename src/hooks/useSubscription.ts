
import { useState, useEffect } from 'react';
import { PaymentTier } from '@/types/syndication';
import { PAYMENT_TIERS } from '@/config/paymentTiers';
import { usePayments } from '@/hooks/usePayments';

interface SubscriptionState {
  currentTier: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useSubscription = () => {
  const { paymentTier, isLoading, error, initiatePayment } = usePayments();
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>({
    currentTier: paymentTier,
    isLoading,
    error,
  });

  useEffect(() => {
    setSubscriptionState({
      currentTier: paymentTier,
      isLoading,
      error,
    });
  }, [paymentTier, isLoading, error]);

  const getCurrentTier = (): PaymentTier | undefined => {
    return PAYMENT_TIERS.find(tier => tier.id === subscriptionState.currentTier);
  };

  const upgradeToTier = async (tierId: string) => {
    await initiatePayment(tierId);
  };

  const openCustomerPortal = async () => {
    // For one-time payments, redirect to payment tiers page
    window.location.href = '/payment-tiers';
  };

  return {
    ...subscriptionState,
    getCurrentTier,
    upgradeToTier,
    openCustomerPortal,
    refreshSubscription: () => {}, // No-op for one-time payments
  };
};
