
// Stripe configuration - use publishable key for client-side
export const STRIPE_CONFIG = {
  // Test Stripe publishable key
  publishableKey: 'pk_test_51RXbMOBA4IiKvZcuCKe556AVdY6yfqBYl0LzIhX5tyJt9Nx5tU5TYVnHqFwLIgytX39v8IvfMKAmMAlOFRLl1UuK00crPN2FHm',
  
  // Price IDs for each tier (one-time payments)
  priceIds: {
    basic: 'price_basic_9900',     // $99.00 one-time
    pro: 'price_pro_29900',        // $299.00 one-time  
    executive: 'price_executive_59900', // $599.00 one-time
  },
};

export const STRIPE_ENDPOINTS = {
  createPayment: '/functions/v1/create-payment',
  paymentSuccess: '/payment-success',
  paymentCancel: '/payment-cancel',
};
