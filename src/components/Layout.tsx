
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Calendar, CheckSquare, CreditCard, Users, Edit } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/user-management', label: 'User Management', icon: Users },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/qc-panel', label: 'Quality Control', icon: CheckSquare },
    { path: '/payment-tiers', label: 'Billing', icon: CreditCard },
    { path: '/editor-dashboard', label: 'Editor Dashboard', icon: Edit },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900">
      {/* Header */}
      <header className="glass-card-strong border-b border-white/10 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            Content Engine
          </h1>
        </div>
      </header>

      {/* Main Navigation Toolbar */}
      <div className="container mx-auto px-4 py-4">
        <Card>
          <CardContent className="p-4">
            <nav className="flex flex-wrap gap-4 items-center justify-center">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "secondary" : "ghost"}
                    onClick={() => navigate(item.path)}
                    className="text-white/90 hover:text-white"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
