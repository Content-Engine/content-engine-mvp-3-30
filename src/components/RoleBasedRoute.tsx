
import { ReactNode } from 'react';

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const RoleBasedRoute = ({ children }: RoleBasedRouteProps) => {
  // Remove auth checks - always render children
  return <>{children}</>;
};

export default RoleBasedRoute;
