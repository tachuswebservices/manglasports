import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Menu, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../theme/ThemeToggle';
import { useTheme } from '../theme/ThemeProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import TopBar from './TopBar';
import WishlistIcon from './WishlistIcon';
import CartIcon from './CartIcon';
import SearchBar from '../search/SearchBar';

const Navbar = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const menuItems = [
    { title: 'Air Rifles', link: '/products/air-rifles' },
    { title: 'Air Pistols', link: '/products/air-pistols' },
    { title: 'CO2 Pistols', link: '/products/co2-pistols' },
    { title: 'Pellets', link: '/products/pellets' },
    { title: 'Scatt Training Systems', link: '/products/scatt' },
    { title: 'Consumables', link: '/products/consumables' }
  ];

  const infoItems = [
    { title: 'ABOUT', link: '/about' },
    { title: 'CONTACT', link: '/contact' }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full max-w-[100vw] transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      {/* Top bar with contact info, FAQ, Blog, and social links */}
      <TopBar />

      {/* Main navigation with logo and search */}
      <div className={`${isDark ? 'bg-slate-900' : 'bg-white'} w-full px-2 sm:px-3 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 shadow-sm`}>
        <div className="w-full max-w-[100vw]">
        <div className="container-custom flex items-center justify-between relative">
          {/* Logo and tagline */}
          <Link to="/" className="flex-shrink-0 mr-2" onClick={scrollToTop}>
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/msa-logo.png" 
                alt="Mangla Sports Logo" 
                className="h-10 w-auto md:h-14" 
              />
              <div className="hidden md:block">
                <div className={`font-montserrat text-base md:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'} leading-tight`}>MANGLA SPORTS</div>
                <div className={`text-[10px] md:text-xs ${isDark ? 'text-gray-400' : 'text-slate-600'} uppercase tracking-wider`}>PREMIUM SHOOTING EQUIPMENT</div>
              </div>
            </div>
          </Link>

          {/* Navigation icons for desktop and mobile */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Desktop navigation - horizontal menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/products/air-rifles" className={`${isDark ? 'text-gray-300' : 'text-slate-700'} px-3 py-2 text-sm font-medium hover:text-mangla-gold transition-colors`}>
                Air Rifles
              </Link>
              <Link to="/products/air-pistols" className={`${isDark ? 'text-gray-300' : 'text-slate-700'} px-3 py-2 text-sm font-medium hover:text-mangla-gold transition-colors`}>
                Air Pistols
              </Link>
              <Link to="/products/pellets" className={`${isDark ? 'text-gray-300' : 'text-slate-700'} px-3 py-2 text-sm font-medium hover:text-mangla-gold transition-colors`}>
                Pellets
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
              {/* Search bar for desktop */}
              <div className="hidden md:block relative">
                {isSearchOpen ? (
                  <div className="relative">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                      className="relative w-[300px]"
                    >
                      <SearchBar 
                        onClose={() => {
                          setIsSearchOpen(false);
                        }}
                        className="w-full pr-8"
                      />
                    </motion.div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSearchOpen(false);
                      }}
                      className={`absolute right-0 top-1/2 -translate-y-1/2 p-2 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                      aria-label="Close search"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSearchOpen(true);
                    }}
                    className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'} p-1 transition-colors`}
                    aria-label="Search"
                  >
                    <Search className="h-6 w-6" />
                  </button>
                )}
              </div>
              
              {/* Icons container - hidden on mobile */}
              <div className="hidden md:flex items-center space-x-2">
                {/* Wishlist icon */}
                <div className="relative">
                  <WishlistIcon />
                </div>
                
                {/* Cart icon */}
                <div className="relative">
                  <CartIcon />
                </div>
              </div>
              
              {/* Mobile Icons - only visible on mobile */}
              <div className="flex items-center justify-end flex-1 md:hidden pr-0">
                {/* Mobile icons container with proper spacing */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Search icon for mobile */}
                <button
                  onClick={toggleSearch}
                  className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'} p-1 transition-colors`}
                  aria-label="Search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                
                {/* Wishlist icon for mobile */}
                <div className="relative">
                  <WishlistIcon />
                </div>
                
                {/* Cart icon for mobile */}
                <div className="relative">
                  <CartIcon />
                </div>
                
                <ThemeToggle />
                
                {/* Mobile menu button - fixed position to ensure full visibility */}
                <div className="relative flex items-center justify-center px-1">
                  <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                    className={`mobile-nav-button p-1 flex items-center justify-center rounded-md ${isDark ? 'text-gray-300 hover:bg-slate-800 hover:text-white' : 'text-slate-700 hover:bg-gray-100 hover:text-slate-900'}`}
                    aria-label="Toggle menu"
                    style={{ zIndex: 100 }}
                  >
                    <Menu className="h-6 w-6 flex-shrink-0" strokeWidth={2.5} />
                  </button>
                </div>
                </div>
              </div>
              
              {/* Desktop Icons - only visible on desktop */}
              <div className="hidden md:flex items-center space-x-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      {/* Full-width search bar on mobile - shown only when search icon is clicked */}
      <AnimatePresence>
        {isSearchOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`fixed top-16 left-0 right-0 z-50 p-4 shadow-md ${
              isDark ? 'bg-slate-800' : 'bg-white'
            }`}
          >
            <div className="relative w-full max-w-2xl mx-auto">
              <div className="flex items-center w-full">
                <div className="flex-1">
                  <SearchBar 
                    isMobile 
                    onClose={() => setIsSearchOpen(false)}
                    className="w-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className={`ml-2 px-3 py-2 rounded-md whitespace-nowrap ${
                    isDark ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Cancel
                </button>
              </div>
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
              {/* Header area with logo */}
              <div className={`${isDark ? 'bg-slate-800' : 'bg-gray-100'} py-4 px-6 flex items-center`}>
                <img 
                  src="/lovable-uploads/msa-logo.png" 
                  alt="Mangla Sports Logo" 
                  className="h-12 w-auto" 
                />
              </div>
              
              {/* Search input */}
              <div className="px-6 py-4">
                <SearchBar 
                  isMobile 
                  onClose={() => setIsMobileMenuOpen(false)}
                  className="w-full"
                />
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
                
                {/* Additional Links section */}
                <div className="mb-6">
                  <div className={`${isDark ? 'text-gray-300' : 'text-gray-500'} text-xs font-semibold uppercase tracking-wider px-4 py-2`}>
                    More
                  </div>
                  <div className="mt-1">
                    {[
                      {
                        title: 'FAQs',
                        link: '/faq',
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 1.24-2.098 2.04-2.868.85-.804 1.721-1.21 2.732-1.21 1.42 0 2.418.74 2.418 1.782 0 .93-.62 1.635-1.624 2.08-.9.39-1.209.68-1.209 1.29v.5m0 3.5c0 .818-.7 1.5-1.5 1.5s-1.5-.682-1.5-1.5.7-1.5 1.5-1.5 1.5.682 1.5 1.5zM3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                          </svg>
                        )
                      },
                      {
                        title: 'Blog',
                        link: '/blog',
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        )
                      },
                      {
                        title: 'Events',
                        link: '/events',
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )
                      }
                    ].map((item, index) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + (index * 0.05) }}
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
