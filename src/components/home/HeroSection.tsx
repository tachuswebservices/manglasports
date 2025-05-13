
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeProvider';
import { cn } from '@/lib/utils';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "../ui/button";
import { ArrowDown } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();
  
  // Function to handle scroll indicator animation
  const scrollToNextSection = () => {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <section className="relative min-h-screen overflow-hidden pt-16">
      {/* Main hero container */}
      <div className="relative min-h-[calc(100vh-64px)] w-full">
        {/* Background image that covers the entire section with adjusted positioning to show shooter's head */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="/lovable-uploads/043df67b-a8e3-4d7b-a886-d29c545973ab.png"
            alt="Mangla Sports" 
            className="w-full h-full object-cover object-top"
          />
        </div>
        
        {/* Content container repositioned to match the green box area */}
        <div className="relative h-full flex items-center justify-end">
          <div className="container mx-auto px-4 flex justify-end">
            {/* Modified for better positioning - moved down from the top on normal screens */}
            <div className={`${
              isMobile 
                ? 'absolute bottom-24 right-4 max-w-[280px]' 
                : 'max-w-[40%] xl:max-w-[35%] mt-32'
              } py-6 md:py-8`}>
              <motion.div
                className={cn(
                  "p-4 md:p-5 backdrop-blur-xl rounded-lg border",
                  isDark 
                    ? "bg-mangla-dark-gray/20 border-mangla-gold/20" 
                    : "bg-mangla-light-bg/20 border-amber-500/20"
                )}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <motion.h1 
                  className={`text-xl md:text-2xl lg:text-3xl font-bold mb-2 leading-tight ${isDark ? 'text-white' : 'text-slate-800'}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Mangla Sports <br />
                  <span className={`${isDark ? 'text-mangla-gold' : 'text-amber-500'}`}>Precision Performance Passion</span>
                </motion.h1>
                
                <motion.p 
                  className={`text-xs md:text-sm mb-3 ${isDark ? 'text-gray-200' : 'text-slate-700'}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  India's premier destination for shooting sports equipment, expertise and guidance.
                </motion.p>
                
                <motion.div 
                  className="flex items-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <Button
                    variant={isDark ? "default" : "default"}
                    className={`${isDark ? 'bg-mangla-gold hover:bg-mangla-gold/90 text-mangla' : 'bg-amber-500 hover:bg-amber-600 text-white'} px-4 py-2 h-auto text-xs md:text-sm font-medium`}
                    asChild
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      Explore Our Collection
                    </motion.button>
                  </Button>
                </motion.div>
                
                <motion.p 
                  className={`mt-2 ${isDark ? 'text-mangla-gold' : 'text-amber-500'} italic text-xs`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  Trusted by Champions Across India
                </motion.p>
              </motion.div>
            </div>
          </div>
        </div>
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
        <motion.div 
          className={`flex items-center justify-center rounded-full p-2 ${isDark ? 'bg-mangla-gold/20' : 'bg-amber-500/20'}`}
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <ArrowDown className={`w-6 h-6 ${isDark ? 'text-mangla-gold' : 'text-amber-500'}`} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
