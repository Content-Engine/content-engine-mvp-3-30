
import { ReactNode } from 'react';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { useSubscriptionTier, SubscriptionTier } from '@/hooks/useSubscriptionTier';

interface RoleBasedAccessProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requiredTier?: SubscriptionTier;
  fallback?: ReactNode;
}

const RoleBasedAccess = ({ 
  children, 
  allowedRoles, 
  requiredTier, 
  fallback = null 
}: RoleBasedAccessProps) => {
  const { userRole, loading: authLoading } = useAuth();
  const { tier, loading: tierLoading, canAccessPage } = useSubscriptionTier();

  if (authLoading || tierLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  // Check role access
  if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
    return <>{fallback}</>;
  }

  // Check tier access
  if (requiredTier && !canAccessPage(requiredTier)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default RoleBasedAccess;
