
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

  const fetchUserRole = async (userId: string): Promise<UserRole> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.log('No role found for user, defaulting to user role');
        return 'user';
      }
      
      return data.role as UserRole;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'user';
    }
  };

  // Development mode bypass
  useEffect(() => {
    if (DEV_MODE.DISABLE_AUTH) {
      setUser(DEV_MODE.MOCK_USER as User);
      setUserRole(DEV_MODE.DEFAULT_ROLE);
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id).then(setUserRole);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const role = await fetchUserRole(session.user.id);
          setUserRole(role);
        } else {
          setUserRole(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const refreshUserRole = async () => {
    if (DEV_MODE.DISABLE_AUTH) return;
    
    if (user) {
      const role = await fetchUserRole(user.id);
      setUserRole(role);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (DEV_MODE.DISABLE_AUTH) {
      return { error: null };
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string, role: UserRole = 'user') => {
    if (DEV_MODE.DISABLE_AUTH) {
      return { error: null };
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
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
  };

  const signOut = async () => {
    if (DEV_MODE.DISABLE_AUTH) {
      return;
    }
    
    await supabase.auth.signOut();
  };

  const updateUserRole = async (userId: string, role: UserRole) => {
    if (DEV_MODE.DISABLE_AUTH) {
      setUserRole(role);
      return;
    }
    
    const { error } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: role,
      });

    if (!error) {
      await refreshUserRole();
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
