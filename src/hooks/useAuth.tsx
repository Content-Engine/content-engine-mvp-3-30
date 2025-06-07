
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'admin' | 'social_media_manager' | 'editor' | 'user';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string, role?: UserRole) => Promise<void>;
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
  const navigate = useNavigate();

  const fetchUserRole = async (userId: string): Promise<UserRole | null> => {
    try {
      console.log('Fetching user role for:', userId);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        
        // If there's no role record, create a default editor role
        if (error.code === 'PGRST116' || !data) {
          console.log('No role found, creating default editor role');
          const { error: insertError } = await supabase
            .from('user_roles')
            .insert({
              user_id: userId,
              role: 'editor'
            });
          
          if (insertError) {
            console.error('Error creating default role:', insertError);
            return 'editor'; // Return default even if insert fails
          }
          
          return 'editor';
        }
        
        return 'editor'; // Default fallback
      }

      const role = data?.role as UserRole || 'editor';
      console.log('User role fetched:', role);
      return role;
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      return 'editor';
    }
  };

  const refreshUserRole = async () => {
    if (user) {
      console.log('Refreshing user role for:', user.id);
      const role = await fetchUserRole(user.id);
      setUserRole(role);
    }
  };

  const redirectUserByRole = (role: UserRole) => {
    console.log('Redirecting user with role:', role);
    switch (role) {
      case 'admin':
        navigate('/dashboard');
        break;
      case 'social_media_manager':
        navigate('/social/calendar');
        break;
      case 'editor':
        navigate('/editor-dashboard');
        break;
      case 'user':
        navigate('/user-dashboard');
        break;
      default:
        navigate('/');
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to defer role fetching and avoid blocking auth state updates
          setTimeout(async () => {
            try {
              const role = await fetchUserRole(session.user.id);
              setUserRole(role);
              
              if (event === 'SIGNED_IN') {
                redirectUserByRole(role);
              }
            } catch (error) {
              console.error('Error handling auth state change:', error);
              setUserRole('editor'); // Fallback role
            }
          }, 100);
        } else {
          setUserRole(null);
          if (event === 'SIGNED_OUT') {
            navigate('/login');
          }
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          const role = await fetchUserRole(session.user.id);
          setUserRole(role);
        } catch (error) {
          console.error('Error fetching initial role:', error);
          setUserRole('editor');
        }
      }
      
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    console.log('Signing in user:', email);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, fullName?: string, role: UserRole = 'editor') => {
    console.log('Signing up user:', email, 'with role:', role);
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    if (error) throw error;

    // Create user role entry
    if (data.user) {
      console.log('Creating user role entry for:', data.user.id);
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: data.user.id,
          role: role
        });

      if (roleError) {
        console.error('Error creating user role:', roleError);
      }
    }
  };

  const signOut = async () => {
    console.log('Signing out user');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateUserRole = async (userId: string, role: UserRole) => {
    console.log('Updating user role:', userId, 'to:', role);
    const { error } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: role
      });

    if (error) throw error;
    
    // Refresh current user's role if it's their own role being updated
    if (user?.id === userId) {
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
      refreshUserRole 
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
