
export const DEV_MODE = {
  DISABLE_AUTH: false,
  MOCK_USER: {
    id: 'dev-user-123',
    email: 'dev@contentengine.com',
    aud: 'authenticated',
    role: 'authenticated',
    email_confirmed_at: new Date().toISOString(),
    phone: '',
    confirmation_sent_at: new Date().toISOString(),
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: { full_name: 'Dev User' },
    identities: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  DEFAULT_ROLE: 'admin' as const,
};
