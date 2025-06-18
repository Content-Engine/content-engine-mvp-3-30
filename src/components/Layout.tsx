
import { ReactNode } from 'react';
import TopNavBar from '@/components/TopNavBar';
import DevToolbar from '@/components/DevToolbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900">
      <TopNavBar />
      <main>{children}</main>
      <DevToolbar />
    </div>
  );
};

export default Layout;
