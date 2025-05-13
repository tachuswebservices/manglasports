
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
      {/* Top navigation bar with contact and info links */}
      <div className={`${isDark ? 'bg-mangla' : 'bg-slate-800'} py-2 hidden md:block`}>
        <div className="container-custom flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link to="/about" className="text-mangla-foreground hover:text-mangla-gold transition-colors text-sm">ABOUT</Link>
            <Link to="/contact" className="text-mangla-foreground hover:text-mangla-gold transition-colors text-sm">CONTACT</Link>
          </div>
          
          {/* Desktop Search Bar - Moved to the top bar */}
          {!isMobile && (
            <div className="relative max-w-md w-full">
              <form onSubmit={handleSearch} className="flex items-center">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 bg-mangla-dark-gray/70 border-0 rounded-l-md text-sm text-white placeholder:text-white/60"
                />
                <button 
                  type="submit"
                  className="bg-mangla-gold h-8 text-white px-3 rounded-r-md hover:bg-yellow-500 transition-colors flex items-center justify-center"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
          
          <div className="flex items-center space-x-6 text-sm">
            <a href="mailto:info@manglasports.com" className="text-mangla-foreground hover:text-mangla-gold flex items-center gap-2">
              <span>info@manglasports.com</span>
            </a>
            <a href="tel:+919999999999" className="text-mangla-foreground hover:text-mangla-gold flex items-center gap-2">
              <span>+91 99999 99999</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation with unique design */}
      <div className={`${isDark ? 'bg-gradient-to-r from-mangla-blue via-blue-700 to-blue-600' : 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400'} transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
        <div className="container-custom flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div
              className="flex flex-col"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-white font-montserrat font-bold text-2xl">MANGLA SPORTS</span>
              <span className="text-white/80 text-xs tracking-wider mt-0.5">Precision. Performance. Passion.</span>
            </motion.div>
          </Link>

          {/* Desktop Categories - Uniquely styled as a horizontal menu */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Product Categories with unique hover effects */}
            <div className="group relative">
              <Link to="/products/air-rifles" className="text-white px-4 py-3 inline-block group-hover:text-mangla-gold transition-all duration-300 border-b-2 border-transparent hover:border-mangla-gold">
                Air Rifles
              </Link>
            </div>
            <div className="group relative">
              <Link to="/products/air-pistols" className="text-white px-4 py-3 inline-block group-hover:text-mangla-gold transition-all duration-300 border-b-2 border-transparent hover:border-mangla-gold">
                Air Pistols
              </Link>
            </div>
            <div className="group relative">
              <Link to="/products/pellets" className="text-white px-4 py-3 inline-block group-hover:text-mangla-gold transition-all duration-300 border-b-2 border-transparent hover:border-mangla-gold">
                Pellets
              </Link>
            </div>
            <div className="group relative">
              <Link to="/products/gloves" className="text-white px-4 py-3 inline-block group-hover:text-mangla-gold transition-all duration-300 border-b-2 border-transparent hover:border-mangla-gold">
                Gloves
              </Link>
            </div>
            <div className="group relative">
              <Link to="/products/shoes" className="text-white px-4 py-3 inline-block group-hover:text-mangla-gold transition-all duration-300 border-b-2 border-transparent hover:border-mangla-gold">
                Shoes
              </Link>
            </div>
            <div className="group relative">
              <Link to="/products/glasses" className="text-white px-4 py-3 inline-block group-hover:text-mangla-gold transition-all duration-300 border-b-2 border-transparent hover:border-mangla-gold">
                Glasses
              </Link>
            </div>
          </div>
          
          {/* Search and Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Icon only visible on mobile now */}
            {isMobile && (
              <div className="relative">
                <motion.button
                  aria-label="Search"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="text-white hover:text-mangla-gold transition-colors focus:outline-none p-2 rounded-full hover:bg-white/10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search className="w-5 h-5" />
                </motion.button>
                
                {/* Desktop Search Overlay */}
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div 
                      className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-mangla-dark-gray shadow-xl rounded-lg overflow-hidden z-50"
                      initial={{ opacity: 0, y: -10, width: 0 }}
                      animate={{ opacity: 1, y: 0, width: "20rem" }}
                      exit={{ opacity: 0, y: -10, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <form onSubmit={handleSearch} className="flex items-center">
                        <Input
                          type="text"
                          placeholder="Search Products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full border-0 focus:ring-0 rounded-none py-3 px-4 dark:bg-mangla-dark-gray dark:text-white"
                          autoFocus
                        />
                        <button 
                          type="submit"
                          className="bg-mangla-gold text-white p-3 hover:bg-yellow-500 transition-colors"
                          aria-label="Search"
                        >
                          <Search className="w-5 h-5" />
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            <ThemeToggle />
          </div>

          {/* Mobile Nav Controls */}
          <div className="md:hidden flex items-center space-x-4">
            <motion.button
              aria-label="Search"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-white hover:text-mangla-gold transition-colors focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="w-5 h-5" />
            </motion.button>
            
            <ThemeToggle />
            
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-white p-1 rounded-md transition-all duration-300 relative z-20"
              aria-label="Toggle menu"
            >
              <motion.div
                initial={false}
                animate={isMobileMenuOpen ? "open" : "closed"}
                className="w-6 h-6 flex flex-col justify-center items-center"
              >
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 2 }
                  }}
                  className="w-6 h-0.5 bg-white block transition-all rounded-full"
                  style={{ transformOrigin: "center" }}
                />
                <motion.span
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 }
                  }}
                  className="w-6 h-0.5 bg-white block my-1 transition-all rounded-full"
                />
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -2 }
                  }}
                  className="w-6 h-0.5 bg-white block transition-all rounded-full"
                  style={{ transformOrigin: "center" }}
                />
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && isMobile && (
          <motion.div 
            className="md:hidden absolute top-full left-0 right-0 bg-mangla-blue/95 backdrop-blur-sm border-t border-gray-700 shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container-custom py-4">
              <form onSubmit={handleSearch} className="flex items-center gap-0">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow bg-white/10 border-0 focus:border-0 text-white placeholder:text-white/70 rounded-l-md rounded-r-none"
                  autoFocus
                />
                <motion.button 
                  type="submit"
                  className="bg-mangla-gold text-white p-3 rounded-r-md hover:bg-yellow-500 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search className="w-5 h-5" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu - Redesigned with animations */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden fixed inset-0 z-10 bg-gradient-to-b from-mangla-blue to-blue-900 backdrop-blur-md overflow-auto"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="pt-20 pb-6 px-4 h-full flex flex-col">
              {/* Logo and branding in mobile menu */}
              <div className="text-center mb-8">
                <h2 className="text-mangla-gold font-montserrat text-2xl font-bold">MANGLA SPORTS</h2>
                <p className="text-white/80 text-xs mt-1">Precision. Performance. Passion.</p>
              </div>
              
              {/* Main navigation links */}
              <div className="space-y-6 flex-1">
                <div className="space-y-3">
                  <h3 className="text-mangla-gold text-xs uppercase tracking-wider font-bold pl-2">Products</h3>
                  <div className="space-y-1">
                    {menuItems.map((item, index) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link 
                          to={item.link} 
                          className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="font-medium">{item.title}</span>
                          <ChevronRight className="w-4 h-4 text-mangla-gold" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-mangla-gold text-xs uppercase tracking-wider font-bold pl-2">Company</h3>
                  <div className="space-y-1">
                    {infoItems.map((item, index) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                      >
                        <Link 
                          to={item.link} 
                          className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="font-medium">{item.title}</span>
                          <ChevronRight className="w-4 h-4 text-mangla-gold" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Contact information */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="grid gap-3">
                  <a href="tel:+919999999999" className="flex items-center space-x-3 text-white/90 hover:text-mangla-gold transition-colors">
                    <span>+91 99999 99999</span>
                  </a>
                  <a href="mailto:info@manglasports.com" className="flex items-center space-x-3 text-white/90 hover:text-mangla-gold transition-colors">
                    <span>info@manglasports.com</span>
                  </a>
                </div>
                
                <div className="mt-6 text-center">
                  <button 
                    className="px-6 py-2 rounded-full bg-mangla-gold text-white font-medium hover:bg-yellow-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Close Menu
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
