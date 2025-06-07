
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Remove auth checks - always render children
  return <>{children}</>;
};

export default ProtectedRoute;
