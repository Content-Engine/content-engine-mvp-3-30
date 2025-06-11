
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
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, fullName?: string, role?: UserRole) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
  refreshUserRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchUserRole = async (userId: string): Promise<UserRole> => {
    try {
      console.log('Fetching role for user:', userId);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.log('No role found for user, defaulting to user role:', error);
        return 'user';
      }
      
      console.log('User role fetched:', data.role);
      return data.role as UserRole;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'user';
    }
  };

  // Development mode bypass
  useEffect(() => {
    if (DEV_MODE.DISABLE_AUTH && !isInitialized) {
      console.log('Dev mode enabled, using mock user');
      setUser(DEV_MODE.MOCK_USER as User);
      setUserRole(DEV_MODE.DEFAULT_ROLE);
      setLoading(false);
      setIsInitialized(true);
      return;
    }

    if (isInitialized) return;

    let isMounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.id);
            
            if (!isMounted) return;
            
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              // Fetch role in a separate async operation to avoid blocking
              setTimeout(async () => {
                if (!isMounted) return;
                try {
                  const role = await fetchUserRole(session.user.id);
                  if (isMounted) {
                    setUserRole(role);
                  }
                } catch (error) {
                  console.error('Error fetching user role in auth state change:', error);
                  if (isMounted) {
                    setUserRole('user');
                  }
                }
              }, 0);
            } else {
              setUserRole(null);
            }
          }
        );

        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
        }
        
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            try {
              const role = await fetchUserRole(session.user.id);
              if (isMounted) {
                setUserRole(role);
              }
            } catch (error) {
              console.error('Error fetching initial user role:', error);
              if (isMounted) {
                setUserRole('user');
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
        console.error('Error initializing auth:', error);
        if (isMounted) {
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [isInitialized]);

  const refreshUserRole = async () => {
    if (DEV_MODE.DISABLE_AUTH) return;
    
    if (user) {
      try {
        const role = await fetchUserRole(user.id);
        setUserRole(role);
      } catch (error) {
        console.error('Error refreshing user role:', error);
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    if (DEV_MODE.DISABLE_AUTH) {
      return { error: null };
    }
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string, role: UserRole = 'user') => {
    if (DEV_MODE.DISABLE_AUTH) {
      return { error: null };
    }
    
    try {
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
      }

      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    if (DEV_MODE.DISABLE_AUTH) {
      return;
    }
    
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateUserRole = async (userId: string, role: UserRole) => {
    if (DEV_MODE.DISABLE_AUTH) {
      setUserRole(role);
      return;
    }
    
    try {
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
      console.error('Error updating user role:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      userRole,
      loading,
      signIn,
      signUp,
      signOut,
      updateUserRole,
      refreshUserRole,
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
