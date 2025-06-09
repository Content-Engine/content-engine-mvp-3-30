
import { ReactNode } from 'react';
import TopNavBar from '@/components/TopNavBar';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';

interface LayoutProps {
  children: ReactNode;
  showBreadcrumbs?: boolean;
}

const Layout = ({ children, showBreadcrumbs = true }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-bg-main">
      <TopNavBar />
      
      <main className="spacing-section">
        <div className="container-main">
          {showBreadcrumbs && <BreadcrumbNavigation />}
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
