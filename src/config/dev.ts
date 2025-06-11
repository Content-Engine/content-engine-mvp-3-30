
export const DEV_MODE = {
  DISABLE_AUTH: false,
  MOCK_USER: {
    id: '00000000-0000-4000-8000-000000000001', // Valid UUID format
    email: 'dev@example.com',
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
  DEFAULT_ROLE: 'admin' as const
};
