import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '../theme/ThemeProvider';
import Navbar from './Navbar';
import Footer from './Footer';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900"
    )}>
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
