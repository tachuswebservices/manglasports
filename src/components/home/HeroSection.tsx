
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeProvider';
import { cn } from '@/lib/utils';

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background overlay & image */}
      <div className="absolute inset-0 z-0">
        {/* Background image */}
        <motion.div 
          className="absolute inset-0 bg-center bg-cover z-0" 
          style={{
            backgroundImage: `url('/lovable-uploads/043df67b-a8e3-4d7b-a886-d29c545973ab.png')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        {/* Subtle overlay to darken/lighten image based on theme */}
        <motion.div 
          className={cn(
            "absolute inset-0 z-10",
            isDark ? "bg-black/30" : "bg-white/10"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
      </div>

      <div className="container-custom relative z-20 py-10">
        {/* Glassmorphism card overlay for text */}
        <motion.div
          className={cn(
            "max-w-3xl mx-auto rounded-xl p-8 backdrop-blur-md border",
            isDark 
              ? "bg-black/40 border-white/10 shadow-lg" 
              : "bg-white/30 border-white/20 shadow-xl"
          )}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${isDark ? 'text-white' : 'text-slate-800'}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Mangla Sports <br />
            <span className={`${isDark ? 'text-mangla-gold' : 'text-amber-500'}`}>Precision Performance Passion</span>
          </motion.h1>
          
          <motion.p 
            className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-slate-700'}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            India's premier destination for shooting sports equipment, expertise and guidance.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
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
