
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeProvider';
import { cn } from '@/lib/utils';
import { AspectRatio } from "@/components/ui/aspect-ratio";

const HeroSection = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Function to handle scroll indicator animation
  const scrollToNextSection = () => {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <section className="relative min-h-screen overflow-hidden pt-16">
      {/* Split layout container */}
      <div className="grid grid-cols-1 md:grid-cols-5 min-h-[calc(100vh-64px)]">
        {/* Left column with solid color background - 60% on desktop */}
        <motion.div 
          className={cn(
            "col-span-1 md:col-span-3 flex items-center justify-center p-8 md:p-16",
            isDark ? "bg-mangla-dark-gray" : "bg-mangla-light-bg"
          )}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-2xl">
            <motion.h1 
              className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${isDark ? 'text-white' : 'text-slate-800'}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Mangla Sports <br />
              <span className={`${isDark ? 'text-mangla-gold' : 'text-amber-500'}`}>Precision Performance Passion</span>
            </motion.h1>
            
            <motion.p 
              className={`text-lg md:text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              India's premier destination for shooting sports equipment, expertise and guidance.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 sm:items-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.button 
                className={`btn-primary text-base md:text-lg ${!isDark && 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                whileHover={{ scale: 1.05, backgroundColor: isDark ? "#1C3882" : "#2563eb" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Explore Our Collection
              </motion.button>
              <motion.button 
                className={`btn-secondary text-base md:text-lg ${!isDark && 'border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white'}`}
                whileHover={{ scale: 1.05, borderColor: isDark ? "#F2C250" : "#f59e0b" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Learn About Our Legacy
              </motion.button>
            </motion.div>
            
            <motion.p 
              className={`mt-8 ${isDark ? 'text-mangla-gold' : 'text-amber-500'} italic`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              Trusted by Champions Across India
            </motion.p>
          </div>
        </motion.div>
        
        {/* Right column with full-height image - 40% on desktop */}
        <motion.div 
          className="col-span-1 md:col-span-2 relative h-[50vh] md:h-auto"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0">
            <img 
              src="/lovable-uploads/043df67b-a8e3-4d7b-a886-d29c545973ab.png"
              alt="Mangla Sports" 
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden md:block cursor-pointer"
        initial={{ y: -10, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
          transition: {
            duration: 0.5, 
            delay: 1.2
          }
        }}
        whileHover={{ scale: 1.2 }}
        onClick={scrollToNextSection}
      >
        <motion.svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          className={`w-8 h-8 ${isDark ? 'text-mangla-gold' : 'text-amber-500'}`}
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </motion.svg>
      </motion.div>
    </section>
  );
};

export default HeroSection;
