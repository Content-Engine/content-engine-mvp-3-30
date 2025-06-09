
import { useAuth, UserRole } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  Calendar,
  Zap,
  Upload,
  CheckSquare,
  MessageSquare,
  CreditCard,
  User
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const navigationItems: NavItem[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: Home,
    roles: ['admin', 'editor', 'social_media_manager']
  },
  {
    path: '/campaign-builder',
    label: 'Create Campaign',
    icon: Upload,
    roles: ['admin']
  },
  {
    path: '/calendar',
    label: 'Calendar',
    icon: Calendar,
    roles: ['admin', 'social_media_manager']
  },
  {
    path: '/social-manager',
    label: 'Content Hub',
    icon: BarChart3,
    roles: ['admin', 'social_media_manager']
  },
  {
    path: '/editor',
    label: 'My Assignments',
    icon: FileText,
    roles: ['admin', 'editor']
  },
  {
    path: '/quality-control',
    label: 'Quality Control',
    icon: CheckSquare,
    roles: ['admin', 'social_media_manager']
  },
  {
    path: '/user-management',
    label: 'User Management',
    icon: Users,
    roles: ['admin']
  },
  {
    path: '/payment-tiers',
    label: 'Plans & Billing',
    icon: CreditCard,
    roles: ['admin']
  }
];

const RoleBasedNavigation = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!userRole) return null;

  const allowedItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="space-y-2">
      {allowedItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        
        return (
          <Button
            key={item.path}
            variant="ghost"
            className={`nav-item w-full justify-start ${active ? 'nav-item-active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <Icon className="w-5 h-5" />
            {item.label}
          </Button>
        );
      })}
    </nav>
  );
};

export default RoleBasedNavigation;
