
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DEV_MODE } from '@/config/dev';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, authError } = useAuth();
  const navigate = useNavigate();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [authTimeout, setAuthTimeout] = useState(false);

  // Set timeout for auth check
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasCheckedAuth && loading) {
        console.warn('⚠️ ProtectedRoute: Auth check timeout');
        setAuthTimeout(true);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [hasCheckedAuth, loading]);

  useEffect(() => {
    // Bypass auth check in dev mode
    if (DEV_MODE.DISABLE_AUTH) {
      setHasCheckedAuth(true);
      return;
    }
    
    if (!loading && !hasCheckedAuth) {
      console.log('🔐 ProtectedRoute: Checking auth - User:', !!user);
      setHasCheckedAuth(true);
      
      if (!user) {
        console.log('❌ ProtectedRoute: User not authenticated, redirecting to auth');
        navigate('/auth');
      }
    }
  }, [user, loading, navigate, hasCheckedAuth]);

  if (DEV_MODE.DISABLE_AUTH) {
    return <>{children}</>;
  }

  // Show error state if auth failed
  if (authError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Authentication Error</div>
          <div className="text-white/70 text-sm mb-4">{authError}</div>
          <button 
            onClick={() => navigate('/auth')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show timeout state
  if (authTimeout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-400 text-xl mb-4">Authentication Timeout</div>
          <div className="text-white/70 text-sm mb-4">Taking longer than expected...</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (loading || !hasCheckedAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Loading...</div>
          <div className="text-white/50 text-sm">Checking authentication...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
