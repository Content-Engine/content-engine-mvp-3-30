
// Stripe configuration - use publishable key for client-side
export const STRIPE_CONFIG = {
  // Replace with your actual Stripe publishable key
  publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_...',
  
  // Price IDs for each tier (replace with your actual Stripe price IDs)
  priceIds: {
    basic: 'price_1234567890_basic_monthly',     // $99/month
    plus: 'price_1234567890_plus_monthly',       // $299/month
    enterprise: 'price_1234567890_enterprise_monthly', // $599/month
  },
  
  // Add-on price IDs for one-time purchases
  addOnPriceIds: {
    boostCreditPack: 'price_1234567890_boost_pack',        // $50
    playlistFunnelAccess: 'price_1234567890_playlist',     // $99
    aiVideoGenerator: 'price_1234567890_ai_video',         // $25/video
    contentVaultUpgrade: 'price_1234567890_content_vault', // $79/month
    editorialReview: 'price_1234567890_editorial',         // $15/review
    teamSeat: 'price_1234567890_team_seat',                // $30/month/seat
    extraPages: 'price_1234567890_extra_pages',            // $20/page/month
  },
};

export const STRIPE_ENDPOINTS = {
  createCheckout: '/api/create-checkout-session',
  customerPortal: '/api/customer-portal',
  checkSubscription: '/api/check-subscription',
};
