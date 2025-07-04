
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { TierSimulation } from '@/config/dev';

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

interface TierFeatures {
  [key: string]: boolean;
}

const TIER_FEATURES: Record<SubscriptionTier, TierFeatures> = {
  free: {
    basicSOPs: true,
    analytics: false,
    syndicationTabs: false,
    teamManagement: false,
    whiteLabel: false,
    internalAITools: false,
  },
  pro: {
    basicSOPs: true,
    analytics: true,
    syndicationTabs: true,
    teamManagement: false,
    whiteLabel: false,
    internalAITools: false,
  },
  enterprise: {
    basicSOPs: true,
    analytics: true,
    syndicationTabs: true,
    teamManagement: true,
    whiteLabel: true,
    internalAITools: true,
  },
};

export const useSubscriptionTier = () => {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const getEffectiveTier = (): SubscriptionTier => {
    // In development, check for mock tier first
    if (process.env.NODE_ENV === 'development') {
      const mockTier = TierSimulation.getMockTier();
      if (mockTier && ['free', 'pro', 'enterprise'].includes(mockTier)) {
        return mockTier as SubscriptionTier;
      }
    }
    return tier;
  };

  const fetchTier = async () => {
    if (!user) {
      setTier('free');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      const userTier = (data?.subscription_tier as SubscriptionTier) || 'free';
      setTier(userTier);
    } catch (err) {
      console.error('Error fetching subscription tier:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription tier');
      setTier('free');
    } finally {
      setLoading(false);
    }
  };

  const updateTier = async (newTier: SubscriptionTier) => {
    if (!user) {
      throw new Error('User must be authenticated to update tier');
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_tier: newTier })
        .eq('id', user.id);

      if (error) throw error;

      setTier(newTier);
    } catch (err) {
      console.error('Error updating subscription tier:', err);
      throw err;
    }
  };

  const hasFeature = (feature: string): boolean => {
    const effectiveTier = getEffectiveTier();
    return TIER_FEATURES[effectiveTier]?.[feature] || false;
  };

  const canAccessPage = (requiredTier: SubscriptionTier): boolean => {
    const effectiveTier = getEffectiveTier();
    const tierLevels = { free: 0, pro: 1, enterprise: 2 };
    return tierLevels[effectiveTier] >= tierLevels[requiredTier];
  };

  useEffect(() => {
    fetchTier();
  }, [user]);

  return {
    tier: getEffectiveTier(), // Always return the effective tier (mock or real)
    realTier: tier, // Expose real tier for debugging
    loading,
    error,
    updateTier,
    hasFeature,
    canAccessPage,
    refetch: fetchTier,
  };
};
