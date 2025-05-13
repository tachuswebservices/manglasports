
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import ThemeToggle from '../theme/ThemeToggle';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      {/* Top navigation bar with contact and info links */}
      <div className="bg-mangla py-2 hidden md:block">
        <div className="container-custom flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link to="/about" className="text-mangla-foreground hover:text-mangla-gold transition-colors text-sm">ABOUT</Link>
            <Link to="/contact" className="text-mangla-foreground hover:text-mangla-gold transition-colors text-sm">CONTACT</Link>
          </div>
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
      <div className={`bg-gradient-to-r from-mangla-blue via-blue-700 to-blue-600 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
        <div className="container-custom flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.span 
              className="text-white font-montserrat font-bold text-2xl"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              MANGLA SPORTS
            </motion.span>
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
            {/* Search Icon that reveals search form on click */}
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
                    className="absolute right-0 top-full mt-2 w-64 bg-white shadow-lg rounded-md overflow-hidden z-50"
                    initial={{ opacity: 0, y: -10, width: 0 }}
                    animate={{ opacity: 1, y: 0, width: "16rem" }}
                    exit={{ opacity: 0, y: -10, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <form onSubmit={handleSearch} className="flex items-center">
                      <Input
                        type="text"
                        placeholder="Search Products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border-0 focus:ring-0"
                        autoFocus
                      />
                      <button 
                        type="submit"
                        className="bg-mangla-gold text-white p-2 hover:bg-yellow-500 transition-colors"
                        aria-label="Search"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
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
              className="text-white"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            className="md:hidden absolute top-full left-0 right-0 bg-mangla-blue/95 backdrop-blur-sm border-t border-gray-700 shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container-custom py-4">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow bg-white/10 border-0 focus:border-0 text-white placeholder:text-white/70"
                  autoFocus
                />
                <motion.button 
                  type="submit"
                  className="bg-mangla-gold text-white p-2 rounded-md hover:bg-yellow-500 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search className="w-4 h-4" />
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
            className="md:hidden bg-mangla-blue/95 backdrop-blur-md absolute top-full left-0 right-0 border-t border-gray-700 shadow-lg z-50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container-custom py-4">
              <div className="grid grid-cols-2 gap-3">
                <Link to="/about" className="bg-mangla-dark/20 rounded-md px-3 py-2 text-white hover:bg-mangla-gold/20 transition-colors">ABOUT</Link>
                <Link to="/contact" className="bg-mangla-dark/20 rounded-md px-3 py-2 text-white hover:bg-mangla-gold/20 transition-colors">CONTACT</Link>
              </div>
              
              <div className="h-px bg-gray-700 my-3"></div>
              
              <div className="grid grid-cols-2 gap-3">
                <Link to="/products/air-rifles" className="bg-mangla-dark/20 rounded-md px-3 py-2 text-white hover:bg-mangla-gold/20 transition-colors">Air Rifles</Link>
                <Link to="/products/air-pistols" className="bg-mangla-dark/20 rounded-md px-3 py-2 text-white hover:bg-mangla-gold/20 transition-colors">Air Pistols</Link>
                <Link to="/products/pellets" className="bg-mangla-dark/20 rounded-md px-3 py-2 text-white hover:bg-mangla-gold/20 transition-colors">Pellets</Link>
                <Link to="/products/gloves" className="bg-mangla-dark/20 rounded-md px-3 py-2 text-white hover:bg-mangla-gold/20 transition-colors">Gloves</Link>
                <Link to="/products/shoes" className="bg-mangla-dark/20 rounded-md px-3 py-2 text-white hover:bg-mangla-gold/20 transition-colors">Shoes</Link>
                <Link to="/products/glasses" className="bg-mangla-dark/20 rounded-md px-3 py-2 text-white hover:bg-mangla-gold/20 transition-colors">Glasses</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

