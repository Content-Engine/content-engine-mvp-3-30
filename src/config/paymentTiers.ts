
import { PaymentTier } from '@/types/syndication';

export const PAYMENT_TIERS: PaymentTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 99,
    description: 'Perfect for independent artists and content creators',
    features: {
      syndicationAccounts: 5,
      advancedDashboards: false,
      boostedSyndication: false,
      teamSeats: 1,
      customAddOns: false,
    },
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 299,
    description: 'Ideal for labels, managers, and growing teams',
    features: {
      syndicationAccounts: 15,
      advancedDashboards: true,
      boostedSyndication: true,
      teamSeats: 5,
      customAddOns: false,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 599,
    description: 'For agencies and multi-artist operations',
    features: {
      syndicationAccounts: 50,
      advancedDashboards: true,
      boostedSyndication: true,
      teamSeats: 20,
      customAddOns: true,
    },
  },
];

export const getTierById = (tierId: string): PaymentTier | undefined => {
  return PAYMENT_TIERS.find(tier => tier.id === tierId);
};

export const getTierFeatures = (tierId: string) => {
  const tier = getTierById(tierId);
  return tier?.features;
};
