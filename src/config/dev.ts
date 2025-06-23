
export const DEV_MODE = {
  DISABLE_AUTH: true,
  USE_MOCK_AUTH: false,
  MOCK_USER: {
    id: '12345678-1234-5678-9012-123456789012',
    email: 'dev@bypass.com',
    user_metadata: {
      full_name: 'Dev User'
    },
    app_metadata: {},
    aud: 'authenticated',
    confirmation_sent_at: null,
    recovery_sent_at: null,
    email_change_sent_at: null,
    new_email: null,
    invited_at: null,
    action_link: null,
    email_confirmed_at: new Date().toISOString(),
    phone_confirmed_at: null,
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    role: 'authenticated',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    phone: null
  },
  DEFAULT_ROLE: 'admin' as const,
  MOCK_SESSION: {
    access_token: 'bypass-token',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Date.now() / 1000 + 3600,
    refresh_token: 'mock-refresh-token',
    user: null
  },
  
  // New tier simulation config
  TIER_SIMULATION: {
    STORAGE_KEY: '__devTierView',
    ROLE_STORAGE_KEY: '__devRoleView',
    TIER_ROLE_MAPPING: {
      'free': ['user'],
      'pro': ['user', 'editor', 'social_media_manager'],
      'enterprise': ['admin', 'social_media_manager', 'editor', 'user']
    }
  }
};

// Helper functions for tier simulation
export const TierSimulation = {
  setMockTier: (tier: 'free' | 'pro' | 'enterprise') => {
    if (process.env.NODE_ENV === 'development') {
      localStorage.setItem(DEV_MODE.TIER_SIMULATION.STORAGE_KEY, tier);
      // Set default role for tier
      const availableRoles = DEV_MODE.TIER_SIMULATION.TIER_ROLE_MAPPING[tier];
      localStorage.setItem(DEV_MODE.TIER_SIMULATION.ROLE_STORAGE_KEY, availableRoles[0]);
    }
  },
  
  setMockRole: (role: string) => {
    if (process.env.NODE_ENV === 'development') {
      localStorage.setItem(DEV_MODE.TIER_SIMULATION.ROLE_STORAGE_KEY, role);
    }
  },
  
  getMockTier: (): string | null => {
    if (process.env.NODE_ENV === 'development') {
      return localStorage.getItem(DEV_MODE.TIER_SIMULATION.STORAGE_KEY);
    }
    return null;
  },
  
  getMockRole: (): string | null => {
    if (process.env.NODE_ENV === 'development') {
      return localStorage.getItem(DEV_MODE.TIER_SIMULATION.ROLE_STORAGE_KEY);
    }
    return null;
  },
  
  clearMockTier: () => {
    if (process.env.NODE_ENV === 'development') {
      localStorage.removeItem(DEV_MODE.TIER_SIMULATION.STORAGE_KEY);
      localStorage.removeItem(DEV_MODE.TIER_SIMULATION.ROLE_STORAGE_KEY);
    }
  },
  
  getAvailableRoles: (tier: 'free' | 'pro' | 'enterprise'): string[] => {
    return DEV_MODE.TIER_SIMULATION.TIER_ROLE_MAPPING[tier] || [];
  }
};
