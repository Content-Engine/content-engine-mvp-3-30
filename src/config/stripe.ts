
// Stripe configuration - use publishable key for client-side
export const STRIPE_CONFIG = {
  // Replace with your actual Stripe publishable key
  publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_...',
  
  // Price IDs for each tier (replace with your actual Stripe price IDs)
  priceIds: {
    basic: 'price_basic_monthly',
    plus: 'price_plus_monthly', 
    enterprise: 'price_enterprise_monthly',
  },
};

export const STRIPE_ENDPOINTS = {
  createCheckout: '/api/create-checkout-session',
  customerPortal: '/api/customer-portal',
};
