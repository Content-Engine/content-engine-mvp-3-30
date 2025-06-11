
export const DEV_MODE = {
  DISABLE_AUTH: false,
  USE_MOCK_AUTH: true, // New flag for mock auth
  MOCK_USER: {
    id: '12345678-1234-5678-9012-123456789012', // Valid UUID format
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
  // Mock session for bypass
  MOCK_SESSION: {
    access_token: 'bypass-token',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Date.now() / 1000 + 3600,
    refresh_token: 'mock-refresh-token',
    user: null // Will be set dynamically
  }
};
