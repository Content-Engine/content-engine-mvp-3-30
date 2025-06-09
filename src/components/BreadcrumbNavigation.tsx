
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const routeLabels: Record<string, string> = {
  '/': 'Home',
  '/dashboard': 'Dashboard',
  '/campaign-builder': 'Campaign Builder',
  '/calendar': 'Calendar',
  '/social-manager': 'Content Hub',
  '/editor': 'Editor Dashboard',
  '/quality-control': 'Quality Control',
  '/client-portal': 'Client Portal',
  '/user-management': 'User Management',
  '/payment-tiers': 'Plans & Billing',
  '/auth': 'Authentication'
};

const BreadcrumbNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Always include dashboard as root for authenticated routes
  if (location.pathname !== '/' && location.pathname !== '/auth') {
    breadcrumbs.push({ label: 'Dashboard', path: '/dashboard' });
  }

  // Build breadcrumb trail
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Skip dashboard if it's already added
    if (currentPath === '/dashboard' && breadcrumbs.length > 0) return;
    
    const label = routeLabels[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbs.push({ label, path: currentPath });
  });

  // Don't show breadcrumbs for root pages
  if (breadcrumbs.length <= 1) return null;

  const canGoBack = breadcrumbs.length > 1;
  const parentPath = canGoBack ? breadcrumbs[breadcrumbs.length - 2].path : '/dashboard';

  return (
    <div className="flex items-center gap-4 mb-6">
      {canGoBack && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(parentPath)}
          className="text-text-muted hover:text-text-main"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      )}
      
      <nav className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((item, index) => (
          <div key={item.path} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="w-4 h-4 text-text-muted" />}
            
            {index === breadcrumbs.length - 1 ? (
              <span className="text-text-main font-medium">{item.label}</span>
            ) : (
              <button
                onClick={() => navigate(item.path)}
                className="text-text-muted hover:text-text-main transition-colors"
              >
                {item.label}
              </button>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default BreadcrumbNavigation;
