import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider';
import { motion } from 'framer-motion';

const TopBar = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`w-full ${isDark ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-800'} py-2`}>
      <div className="container-custom flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center space-x-6 text-sm mb-2 sm:mb-0">
          <a 
            href="mailto:officialmanglasports@gmail.com" 
            className={`flex items-center gap-1 ${isDark ? 'text-white' : 'text-slate-700'} text-xs md:text-sm hover:text-mangla-gold transition-colors`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="hidden md:inline">officialmanglasports@gmail.com</span>
            <span className="md:hidden">Email Us</span>
          </a>
          <div className="hidden md:block px-1 text-slate-400">|</div>
          <a 
            href="tel:+919256930009" 
            className={`flex items-center gap-1 ${isDark ? 'text-white' : 'text-slate-700'} text-xs md:text-sm hover:text-mangla-gold transition-colors`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>+91 92569 30009</span>
          </a>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* FAQ Link */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/faq" 
              className={`flex items-center gap-1 text-xs md:text-sm ${isDark ? 'text-white' : 'text-slate-700'} hover:text-mangla-gold transition-colors`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 1.24-2.098 2.04-2.868.85-.804 1.721-1.21 2.732-1.21 1.42 0 2.418.74 2.418 1.782 0 .93-.62 1.635-1.624 2.08-.9.39-1.209.68-1.209 1.29v.5m0 3.5c0 .818-.7 1.5-1.5 1.5s-1.5-.682-1.5-1.5.7-1.5 1.5-1.5 1.5.682 1.5 1.5zM3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
              </svg>
              <span className="hidden sm:inline">FAQs</span>
            </Link>
          </motion.div>

          <div className={`h-4 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>

          {/* Blog Link */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/blog" 
              className={`flex items-center gap-1 text-xs md:text-sm ${isDark ? 'text-white' : 'text-slate-700'} hover:text-mangla-gold transition-colors`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <span className="hidden sm:inline">Blog</span>
            </Link>
          </motion.div>

          <div className={`h-4 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>

          {/* Events Link */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/events" 
              className={`flex items-center gap-1 text-xs md:text-sm ${isDark ? 'text-white' : 'text-slate-700'} hover:text-mangla-gold transition-colors`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">Events</span>
            </Link>
          </motion.div>

          <div className={`h-4 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>

          {/* Social media icons */}
          <div className="flex items-center space-x-4">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`${isDark ? 'text-white' : 'text-slate-700'} hover:text-mangla-gold transition-colors`}
              aria-label="Facebook"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`${isDark ? 'text-white' : 'text-slate-700'} hover:text-mangla-gold transition-colors`}
              aria-label="Instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4z"/>
              </svg>
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`${isDark ? 'text-white' : 'text-slate-700'} hover:text-mangla-gold transition-colors`}
              aria-label="YouTube"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
