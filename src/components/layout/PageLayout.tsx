import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '../theme/ThemeProvider';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsappFloatingButton from '../common/WhatsappFloatingButton';

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
      <main className="flex-grow pt-0 md:pt-24 pb-16 px-4 sm:px-6">
        {children}
      </main>
      <Footer />
      <WhatsappFloatingButton />
    </div>
  );
};

export default PageLayout;
