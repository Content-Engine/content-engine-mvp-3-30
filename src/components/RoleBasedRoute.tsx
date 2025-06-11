
import { ReactNode, useEffect, useState } from 'react';
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
  const [hasCheckedRole, setHasCheckedRole] = useState(false);

  useEffect(() => {
    // Bypass role check in dev mode
    if (DEV_MODE.DISABLE_AUTH) {
      setHasCheckedRole(true);
      return;
    }
    
    if (!loading && !hasCheckedRole) {
      setHasCheckedRole(true);
      
      if (!user) {
        console.log('User not authenticated, redirecting to auth');
        navigate('/auth');
        return;
      }
      
      if (userRole && !allowedRoles.includes(userRole)) {
        console.log(`User role ${userRole} not in allowed roles:`, allowedRoles);
        navigate('/unauthorized');
        return;
      }
    }
  }, [userRole, loading, user, allowedRoles, navigate, hasCheckedRole]);

  if (DEV_MODE.DISABLE_AUTH) {
    return <>{children}</>;
  }

  if (loading || !hasCheckedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (userRole && !allowedRoles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
