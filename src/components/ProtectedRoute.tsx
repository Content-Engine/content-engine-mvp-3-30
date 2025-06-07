
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DEV_MODE } from '@/config/dev';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Bypass auth check in dev mode
    if (DEV_MODE.DISABLE_AUTH) {
      return;
    }
    
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (DEV_MODE.DISABLE_AUTH) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
