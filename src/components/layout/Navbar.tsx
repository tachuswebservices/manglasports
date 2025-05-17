import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import ThemeToggle from '../theme/ThemeToggle';
import { useTheme } from '../theme/ThemeProvider';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Future implementation will handle actual search logic
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const menuItems = [
    { title: 'Air Rifles', link: '/products/air-rifles' },
    { title: 'Air Pistols', link: '/products/air-pistols' },
    { title: 'Pellets', link: '/products/pellets' },
    { title: 'Gloves', link: '/products/gloves' },
    { title: 'Shoes', link: '/products/shoes' },
    { title: 'Glasses', link: '/products/glasses' }
  ];

  const infoItems = [
    { title: 'ABOUT', link: '/about' },
    { title: 'CONTACT', link: '/contact' }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      {/* Top contact bar - visible on both mobile and desktop */}
      <div className={`${isDark ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-800'} py-2`}>
        <div className="container-custom flex justify-between items-center">
          <div className="flex items-center space-x-6 text-sm">
            <a href="mailto:officialmanglasports@gmail.com" className={`flex items-center gap-1 ${isDark ? 'text-white' : 'text-slate-700'} text-xs md:text-sm`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="hidden md:inline">officialmanglasports@gmail.com</span>
              <span className="md:hidden">Email Us</span>
            </a>
            <div className="hidden md:block px-1 text-slate-400">|</div>
            <a href="tel:+919256930009" className={`flex items-center gap-1 ${isDark ? 'text-white' : 'text-slate-700'} text-xs md:text-sm`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+91 92569 30009</span>
            </a>
          </div>
          
          {/* Social media icons */}
          <div className="flex items-center space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={`${isDark ? 'text-white' : 'text-slate-700'} hover:text-mangla-gold transition-colors`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={`${isDark ? 'text-white' : 'text-slate-700'} hover:text-mangla-gold transition-colors`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={`${isDark ? 'text-white' : 'text-slate-700'} hover:text-mangla-gold transition-colors`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation with logo and search */}
      <div className={`${isDark ? 'bg-slate-900' : 'bg-white'} px-4 md:px-6 lg:px-8 py-4 shadow-sm`}>
        <div className="container-custom flex justify-between items-center relative">
          {/* Logo and tagline */}
          <Link to="/" className="flex flex-col">
            <div className="flex items-center gap-2">
              <img src="/lovable-uploads/59a0133d-7459-463e-8a2f-fd2a578ea3ea.png" alt="Mangla Sports Logo" className="h-14 w-auto" />
              <div>
                <div className={`font-montserrat text-base md:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'} leading-tight hidden md:block`}>MANGLA SPORTS</div>
                <div className={`text-[10px] md:text-xs ${isDark ? 'text-gray-400' : 'text-slate-600'} uppercase tracking-wider`}>PREMIUM SHOOTING EQUIPMENT</div>
              </div>
            </div>
          </Link>

          {/* Navigation icons for desktop and mobile */}
          <div className="flex items-center space-x-4">
            {/* Desktop navigation - horizontal menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/products/air-rifles" className={`${isDark ? 'text-gray-300' : 'text-slate-700'} px-3 py-2 text-sm font-medium hover:text-mangla-gold transition-colors`}>
                Air Rifles
              </Link>
              <Link to="/products/air-pistols" className={`${isDark ? 'text-gray-300' : 'text-slate-700'} px-3 py-2 text-sm font-medium hover:text-mangla-gold transition-colors`}>
                Air Pistols
              </Link>
              <Link to="/products/air-pellets" className={`${isDark ? 'text-gray-300' : 'text-slate-700'} px-3 py-2 text-sm font-medium hover:text-mangla-gold transition-colors`}>
                Air Pellets
              </Link>
              <Link to="/products/air-rifle-accessories" className={`${isDark ? 'text-gray-300' : 'text-slate-700'} px-3 py-2 text-sm font-medium hover:text-mangla-gold transition-colors`}>
                Air Rifle Accessories
              </Link>
              <Link to="/products/air-pistol-accessories" className={`${isDark ? 'text-gray-300' : 'text-slate-700'} px-3 py-2 text-sm font-medium hover:text-mangla-gold transition-colors`}>
                Air Pistol Accessories
              </Link>
            </div>
            
            {/* Mobile and desktop navigation icons */}
            <div className="flex items-center space-x-3">
              {/* Search icon for desktop - expands on click */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className={`${isDark ? 'text-gray-300' : 'text-slate-700'} transition-colors p-1`}
                  aria-label="Search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                
                {/* Expandable search overlay for desktop - appears inline with header */}
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div 
                      className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent z-50"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 250 }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <form onSubmit={handleSearch} className="flex items-center">
                        <Input
                          type="text"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={`w-full border ${isDark ? 'bg-slate-700 text-white border-slate-600 placeholder:text-gray-300' : 'bg-white text-slate-700 border-slate-300'} h-9 text-sm rounded-l-md focus:ring-0`}
                          autoFocus
                        />
                        <button 
                          type="submit"
                          className={`${isDark ? 'bg-slate-900' : 'bg-slate-800'} text-white h-9 px-3 rounded-r-md hover:bg-slate-700 transition-colors flex items-center justify-center`}
                          aria-label="Search"
                        >
                          <Search className="w-4 h-4" />
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Wishlist icon removed as requested */}
              
              {/* Search icon for mobile */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`${isDark ? 'text-gray-300' : 'text-slate-700'} transition-colors p-1 md:hidden`}
                aria-label="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              <ThemeToggle />
              
              {/* Mobile menu button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className={`${isDark ? 'text-gray-300' : 'text-slate-700'} p-1 transition-all duration-300 relative z-20`}
                aria-label="Toggle menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Full-width search bar on mobile - shown only when search icon is clicked */}
      <AnimatePresence>
        {isSearchOpen && isMobile && (
          <motion.div 
            className={`${isDark ? 'bg-slate-800' : 'bg-gray-100'} px-4 py-3 md:hidden`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container-custom">
              <form onSubmit={handleSearch} className="flex items-center w-full">
                <Input
                  type="text"
                  placeholder="Search Products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full h-10 ${isDark ? 'bg-slate-700 text-white border-slate-600 placeholder:text-gray-300' : 'text-slate-700 border-gray-300'} text-xs border border-r-0 rounded-l-md focus:ring-0 focus:border-slate-400`}
                  autoFocus
                />
                <button 
                  type="submit"
                  className="bg-slate-800 text-white h-10 px-3 rounded-r-md hover:bg-slate-700 transition-colors flex items-center justify-center"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu button now has search functionality integrated in the new search bar above */}

      {/* Mobile Menu - Modern design with animations */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              className="md:hidden fixed inset-0 bg-black/60 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu panel */}
            <motion.div 
              className="md:hidden fixed inset-y-0 right-0 w-[85%] max-w-sm z-20 bg-white dark:bg-slate-900 shadow-xl overflow-y-auto flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {/* Header area with logo and close button */}
              <div className={`${isDark ? 'bg-slate-800' : 'bg-gray-100'} py-4 px-6 flex items-center justify-between`}>
                <img 
                  src="/lovable-uploads/59a0133d-7459-463e-8a2f-fd2a578ea3ea.png" 
                  alt="Mangla Sports Logo" 
                  className="h-12 w-auto" 
                />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} p-1 rounded-full transition-colors`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Search input */}
              <div className="px-6 py-4">
                <form onSubmit={handleSearch} className="flex items-center w-full">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full h-10 ${isDark ? 'bg-slate-800 text-white border-slate-700' : 'bg-white text-slate-800 border-gray-300'} text-sm border rounded-l-md focus:ring-0 focus:border-mangla-gold`}
                  />
                  <button 
                    type="submit"
                    className="bg-mangla h-10 px-3 rounded-r-md text-white hover:bg-mangla-dark transition-colors flex items-center justify-center"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </form>
              </div>
              
              {/* Main menu content */}
              <div className="flex-1 px-2 py-2 overflow-y-auto">
                {/* Products section */}
                <div className="mb-6">
                  <div className={`${isDark ? 'text-gray-300' : 'text-gray-500'} text-xs font-semibold uppercase tracking-wider px-4 py-2`}>
                    Products
                  </div>
                  <div className="mt-1">
                    {menuItems.map((item, index) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                      >
                        <Link 
                          to={item.link} 
                          className={`flex items-center justify-between w-full px-4 py-3 rounded-md ${isDark ? 'text-white hover:bg-slate-800' : 'text-slate-700 hover:bg-gray-100'} transition-colors`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="font-medium">{item.title}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-mangla" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Company section */}
                <div className="mb-6">
                  <div className={`${isDark ? 'text-gray-300' : 'text-gray-500'} text-xs font-semibold uppercase tracking-wider px-4 py-2`}>
                    Company
                  </div>
                  <div className="mt-1">
                    {infoItems.map((item, index) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                      >
                        <Link 
                          to={item.link} 
                          className={`flex items-center justify-between w-full px-4 py-3 rounded-md ${isDark ? 'text-white hover:bg-slate-800' : 'text-slate-700 hover:bg-gray-100'} transition-colors`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="font-medium">{item.title}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-mangla" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Footer with contact info */}
              <div className={`mt-auto border-t ${isDark ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'} px-6 py-4`}>
                <div className="grid gap-2">
                  <a href="tel:+919256930009" className={`flex items-center space-x-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm">+91 92569 30009</span>
                  </a>
                  <a href="mailto:officialmanglasports@gmail.com" className={`flex items-center space-x-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">officialmanglasports@gmail.com</span>
                  </a>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex space-x-4">
                    <a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'} transition-colors`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                      </svg>
                    </a>
                    <a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'} transition-colors`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'} transition-colors`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                    </a>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-xs font-medium mr-2">Theme:</span>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
