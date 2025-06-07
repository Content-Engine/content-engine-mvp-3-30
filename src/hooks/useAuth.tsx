
import { createContext, useContext, ReactNode } from 'react';

export type UserRole = 'admin' | 'social_media_manager' | 'editor' | 'user';

interface AuthContextType {
  user: null;
  session: null;
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
  // Remove all auth functionality - always return null/false states
  const mockAuth: AuthContextType = {
    user: null,
    session: null,
    userRole: null,
    loading: false,
    signIn: async () => {},
    signUp: async () => {},
    signOut: async () => {},
    updateUserRole: async () => {},
    refreshUserRole: async () => {},
  };

  return (
    <AuthContext.Provider value={mockAuth}>
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
