
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { DEV_MODE } from '@/config/dev';

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

const RoleBasedRoute = ({ children, allowedRoles }: RoleBasedRouteProps) => {
  const { userRole, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Bypass role check in dev mode
    if (DEV_MODE.DISABLE_AUTH) {
      return;
    }
    
    if (!loading) {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      if (userRole && !allowedRoles.includes(userRole)) {
        navigate('/unauthorized');
        return;
      }
    }
  }, [userRole, loading, user, allowedRoles, navigate]);

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

  if (!user || (userRole && !allowedRoles.includes(userRole))) {
    return null;
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
