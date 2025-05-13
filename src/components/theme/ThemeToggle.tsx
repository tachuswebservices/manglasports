
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const toggleRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  useEffect(() => {
    // Add a subtle floating animation for the 3D effect
    const toggle = toggleRef.current;
    if (toggle) {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = toggle.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        toggle.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
      };

      toggle.addEventListener('mousemove', handleMouseMove);
      return () => toggle.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <motion.div 
      ref={toggleRef}
      className="relative cursor-pointer select-none"
      onClick={toggleTheme}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.1s ease'
      }}
    >
      <motion.div
        className={`w-14 h-7 rounded-full flex items-center p-1 relative ${
          isDark ? 'bg-mangla-dark-gray' : 'bg-blue-100'
        }`}
        initial={false}
        animate={{ 
          backgroundColor: isDark ? '#1A1A1A' : '#EBF4FF'
        }}
        transition={{ duration: 0.4 }}
      >
        {/* Toggle circle */}
        <motion.div
          className={`absolute w-5 h-5 rounded-full shadow-md z-10 flex items-center justify-center ${
            isDark ? 'bg-mangla-gold' : 'bg-white border border-blue-200'
          }`}
          initial={false}
          animate={{
            left: isDark ? '4px' : 'calc(100% - 24px)',
            rotate: isDark ? 0 : 360
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        >
          {isDark ? (
            <Moon className="w-3 h-3 text-mangla" />
          ) : (
            <Sun className="w-3 h-3 text-yellow-500" />
          )}
        </motion.div>

        {/* Background icons */}
        <motion.div
          className="absolute inset-0 flex items-center justify-between px-1"
          style={{ pointerEvents: 'none' }}
        >
          <Moon className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-400'}`} />
          <Sun className={`w-4 h-4 ${isDark ? 'text-gray-600' : 'text-yellow-400'}`} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ThemeToggle;
