
import { ReactNode } from 'react';
import TopNavBar from '@/components/TopNavBar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <TopNavBar />
      
      {/* Main Content with top padding to account for fixed navbar */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};

export default Layout;
