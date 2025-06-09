
// Development mode configuration
export const DEV_MODE = {
  // Set to true to disable authentication in development
  DISABLE_AUTH: true,
  
  // Default user role when auth is disabled
  DEFAULT_ROLE: 'admin' as const,
  
  // Mock user data for development
  MOCK_USER: {
    id: 'dev-user-123',
    email: 'dev@contentengine.com',
    user_metadata: {
      full_name: 'Development User'
    },
    app_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    role: 'authenticated',
    updated_at: new Date().toISOString(),
    email_confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString()
  }
};

console.log('Dev Mode - Auth Disabled');
