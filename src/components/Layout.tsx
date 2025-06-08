
import { ReactNode } from 'react';
import TopNavBar from '@/components/TopNavBar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-bg-main">
      <TopNavBar />
      
      {/* Main Content with top padding to account for fixed navbar */}
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
