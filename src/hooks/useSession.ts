
import { useAuth } from './useAuth';

// Simple hook that matches the pattern you provided
export const useSession = () => {
  const { user, session, loading } = useAuth();
  
  return {
    session,
    user,
    isAuthenticated: !!user && !!session,
    loading
  };
};
