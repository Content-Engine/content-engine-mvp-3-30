import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { DEV_MODE } from '@/config/dev';

export type UserRole = 'admin' | 'social_media_manager' | 'editor' | 'user';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  loading: boolean;
  authError: string | null;
  isEmailConfirmed: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, fullName?: string, role?: UserRole) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
  refreshUserRole: () => Promise<void>;
  resendConfirmation: () => Promise<{ error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utility function to clean up all auth-related storage
const cleanupAuthState = () => {
  console.log('🧹 Cleaning up auth state...');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchUserRole = async (userId: string): Promise<UserRole> => {
    try {
      console.log('🔍 Fetching role for user:', userId);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.log('⚠️ No role found for user, defaulting to user role:', error);
        return 'user';
      }
      
      console.log('✅ User role fetched:', data.role);
      return data.role as UserRole;
    } catch (error) {
      console.error('❌ Error fetching user role:', error);
      return 'user';
    }
  };

  // Mock auth bypass
  useEffect(() => {
    if (DEV_MODE.USE_MOCK_AUTH && !isInitialized) {
      console.log('🔧 Mock auth enabled, using bypass user');
      
      // Create mock session
      const mockSession = {
        ...DEV_MODE.MOCK_SESSION,
        user: DEV_MODE.MOCK_USER as User
      } as Session;
      
      setUser(DEV_MODE.MOCK_USER as User);
      setSession(mockSession);
      setUserRole(DEV_MODE.DEFAULT_ROLE);
      setIsEmailConfirmed(true);
      setLoading(false);
      setIsInitialized(true);
      return;
    }

    // Regular auth bypass (old method)
    if (DEV_MODE.DISABLE_AUTH && !isInitialized) {
      console.log('🔧 Dev mode enabled, using mock user');
      setUser(DEV_MODE.MOCK_USER as User);
      setUserRole(DEV_MODE.DEFAULT_ROLE);
      setIsEmailConfirmed(true);
      setLoading(false);
      setIsInitialized(true);
      return;
    }

    // Auth timeout safeguard
    const authTimeout = setTimeout(() => {
      if (loading && !isInitialized) {
        console.warn('⚠️ Auth timeout after 3 seconds, setting default state');
        setLoading(false);
        setIsInitialized(true);
        setAuthError('Authentication timeout');
      }
    }, 3000);

    if (isInitialized) {
      clearTimeout(authTimeout);
      return;
    }

    let isMounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing auth...');
        
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('🔄 Auth state changed:', event, session?.user?.id);
            
            if (!isMounted) return;
            
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              // Check email confirmation status - allow login regardless
              const emailConfirmed = session.user.email_confirmed_at !== null;
              setIsEmailConfirmed(emailConfirmed);
              
              console.log('📧 User email confirmed:', emailConfirmed);
              
              // Fetch user role regardless of email confirmation
              setTimeout(async () => {
                if (!isMounted) return;
                try {
                  const role = await fetchUserRole(session.user.id);
                  if (isMounted) {
                    setUserRole(role);
                    setLoading(false);
                  }
                } catch (error) {
                  console.error('❌ Error fetching user role:', error);
                  if (isMounted) {
                    setUserRole('user');
                    setLoading(false);
                    setAuthError('Role fetch failed');
                  }
                }
              }, 100);
            } else {
              setUserRole(null);
              setIsEmailConfirmed(false);
              setLoading(false);
            }
          }
        );

        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting initial session:', error);
          setAuthError(error.message);
        }
        
        console.log('📊 Initial session check:', !!session?.user);
        
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Check email confirmation status
            const emailConfirmed = session.user.email_confirmed_at !== null;
            setIsEmailConfirmed(emailConfirmed);
            
            try {
              const role = await fetchUserRole(session.user.id);
              if (isMounted) {
                setUserRole(role);
              }
            } catch (error) {
              console.error('❌ Error fetching initial user role:', error);
              if (isMounted) {
                setUserRole('user');
                setAuthError('Initial role fetch failed');
              }
            }
          }
          
          setLoading(false);
          setIsInitialized(true);
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        if (isMounted) {
          setLoading(false);
          setIsInitialized(true);
          setAuthError('Auth initialization failed');
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      clearTimeout(authTimeout);
    };
  }, [isInitialized, loading]);

  const refreshUserRole = async () => {
    if (DEV_MODE.DISABLE_AUTH || DEV_MODE.USE_MOCK_AUTH) return;
    
    if (user) {
      try {
        const role = await fetchUserRole(user.id);
        setUserRole(role);
        setAuthError(null);
      } catch (error) {
        console.error('❌ Error refreshing user role:', error);
        setAuthError('Role refresh failed');
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    if (DEV_MODE.DISABLE_AUTH || DEV_MODE.USE_MOCK_AUTH) {
      return { error: null };
    }
    
    try {
      console.log('🔐 Starting sign in process...');
      setAuthError(null);
      
      // Clean up existing state first
      cleanupAuthState();
      
      // Attempt global sign out to clear any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('⚠️ Global sign out failed (continuing anyway):', err);
      }
      
      // Sign in with new credentials - IMPORTANT: Don't check email confirmation
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Sign in failed:', error);
        return { error };
      }
      
      console.log('✅ Sign in successful, user confirmed status:', data.user?.email_confirmed_at ? 'confirmed' : 'unconfirmed');
      return { error: null };
    } catch (error) {
      console.error('❌ Sign in error:', error);
      setAuthError('Sign in failed');
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string, role: UserRole = 'user') => {
    if (DEV_MODE.DISABLE_AUTH || DEV_MODE.USE_MOCK_AUTH) {
      return { error: null };
    }
    
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (!error && data.user) {
        // Create user role entry
        await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: role,
          });
          
        console.log('✅ Sign up successful - user can login without email confirmation');
      }

      return { error };
    } catch (error) {
      console.error('❌ Sign up error:', error);
      setAuthError('Sign up failed');
      return { error };
    }
  };

  const signOut = async () => {
    if (DEV_MODE.DISABLE_AUTH || DEV_MODE.USE_MOCK_AUTH) {
      return;
    }
    
    try {
      console.log('🚪 Starting sign out process...');
      setAuthError(null);
      
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('⚠️ Global sign out failed (continuing anyway):', err);
      }
      
      // Reset local state
      setUser(null);
      setSession(null);
      setUserRole(null);
      setIsEmailConfirmed(false);
      
      console.log('✅ Sign out complete');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      setAuthError('Sign out failed');
    }
  };

  const updateUserRole = async (userId: string, role: UserRole) => {
    if (DEV_MODE.DISABLE_AUTH || DEV_MODE.USE_MOCK_AUTH) {
      setUserRole(role);
      return;
    }
    
    try {
      setAuthError(null);
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: role,
        });

      if (!error) {
        await refreshUserRole();
      }
    } catch (error) {
      console.error('❌ Error updating user role:', error);
      setAuthError('Role update failed');
    }
  };

  const resendConfirmation = async () => {
    if (DEV_MODE.DISABLE_AUTH || DEV_MODE.USE_MOCK_AUTH || !user?.email) {
      return { error: null };
    }
    
    try {
      setAuthError(null);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) {
        console.error('❌ Resend confirmation failed:', error);
        return { error };
      }
      
      console.log('✅ Confirmation email resent');
      return { error: null };
    } catch (error) {
      console.error('❌ Resend confirmation error:', error);
      setAuthError('Failed to resend confirmation');
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      userRole,
      loading,
      authError,
      isEmailConfirmed,
      signIn,
      signUp,
      signOut,
      updateUserRole,
      refreshUserRole,
      resendConfirmation,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
