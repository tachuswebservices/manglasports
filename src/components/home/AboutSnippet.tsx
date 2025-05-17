
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider';
import { cn } from '@/lib/utils';

const AboutSnippet = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <section id="about-section" className={cn(
      "section-padding",
      isDark 
        ? "bg-gradient-to-b from-mangla to-mangla-dark-gray" 
        : "bg-gradient-to-b from-amber-50 to-amber-100 border-t border-b border-amber-200"
    )}>
      <div className="container-custom">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className={cn(
              "section-title text-3xl md:text-4xl font-bold",
              isDark ? "text-white" : "text-slate-900"
            )}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            About Mangla Sports & Associates
          </motion.h2>
          
          <motion.div 
            className="w-20 h-1 bg-mangla-gold mx-auto mb-8"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 80, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          ></motion.div>
          
          <motion.p 
            className={cn(
              "text-xl mb-8 leading-relaxed",
              isDark ? "text-gray-300" : "text-slate-700"
            )}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Established with a vision to elevate the shooting sports experience in India, 
            Mangla Sports & Associates represents the pinnacle of quality, expertise, and passion. 
            We curate only the finest equipment, backed by decades of collective experience 
            and an unwavering commitment to the shooting community.
          </motion.p>
          
          <Link to="/about">
            <motion.span 
              className={cn(
                "inline-block border-b text-lg font-medium transition-colors duration-300",
                isDark 
                  ? "text-mangla-gold hover:text-white border-mangla-gold hover:border-white" 
                  : "text-amber-600 hover:text-amber-800 border-amber-500 hover:border-amber-800"
              )}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              Read More
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSnippet;
