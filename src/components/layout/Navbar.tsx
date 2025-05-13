
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
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* Top bar with contact info */}
      <div className="bg-mangla py-2 hidden md:block">
        <div className="container-custom flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link to="/blog" className="text-mangla-foreground hover:text-mangla-gold transition-colors text-sm">BLOG</Link>
            <Link to="/contact" className="text-mangla-foreground hover:text-mangla-gold transition-colors text-sm">CONTACT</Link>
            <Link to="/explore" className="text-mangla-foreground hover:text-mangla-gold transition-colors text-sm">EXPLORE</Link>
            <Link to="/about" className="text-mangla-foreground hover:text-mangla-gold transition-colors text-sm">ABOUT</Link>
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

      {/* Main navigation bar */}
      <div className={`bg-mangla-blue transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'}`}>
        <div className="container-custom flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-white font-montserrat font-bold text-2xl">MANGLA SPORTS</span>
          </Link>

          {/* Desktop Categories */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products/air-rifles" className="text-white hover:text-mangla-gold transition-colors">
              Air Rifles
            </Link>
            <Link to="/products/air-pistols" className="text-white hover:text-mangla-gold transition-colors">
              Air Pistols
            </Link>
            <Link to="/products/pellets" className="text-white hover:text-mangla-gold transition-colors">
              Pellets
            </Link>
            <Link to="/products/gloves" className="text-white hover:text-mangla-gold transition-colors">
              Gloves
            </Link>
            <Link to="/products/shoes" className="text-white hover:text-mangla-gold transition-colors">
              Shoes
            </Link>
            <Link to="/products/glasses" className="text-white hover:text-mangla-gold transition-colors">
              Glasses
            </Link>
            
            {/* Search Form - Always visible on desktop */}
            <form onSubmit={handleSearch} className="relative flex items-center">
              <Input
                type="text"
                placeholder="Search Products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white text-mangla rounded-l-md border-0 focus:ring-0 w-[180px] py-1"
              />
              <button 
                type="submit"
                className="bg-mangla text-white p-1.5 rounded-r-md hover:bg-mangla-gold transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
            
            <ThemeToggle />
          </div>

          {/* Mobile Nav */}
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
            className="md:hidden absolute top-full left-0 right-0 bg-mangla-blue border-t border-gray-700 shadow-lg"
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
                  className="flex-grow bg-white border-0 focus:border-0"
                  autoFocus
                />
                <motion.button 
                  type="submit"
                  className="bg-mangla text-white p-2 rounded-md hover:bg-mangla-gold transition-colors"
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-mangla absolute top-full left-0 right-0 border-t border-gray-800 animate-fade-down z-50">
          <div className="container-custom py-4 flex flex-col space-y-3">
            <Link to="/blog" className="text-mangla-foreground hover:text-mangla-gold transition-colors py-1">BLOG</Link>
            <Link to="/contact" className="text-mangla-foreground hover:text-mangla-gold transition-colors py-1">CONTACT</Link>
            <Link to="/explore" className="text-mangla-foreground hover:text-mangla-gold transition-colors py-1">EXPLORE</Link>
            <Link to="/about" className="text-mangla-foreground hover:text-mangla-gold transition-colors py-1">ABOUT</Link>
            
            <div className="h-px bg-gray-700 my-2"></div>
            
            <Link to="/products/air-rifles" className="text-mangla-foreground hover:text-mangla-gold transition-colors py-1">Air Rifles</Link>
            <Link to="/products/air-pistols" className="text-mangla-foreground hover:text-mangla-gold transition-colors py-1">Air Pistols</Link>
            <Link to="/products/pellets" className="text-mangla-foreground hover:text-mangla-gold transition-colors py-1">Pellets</Link>
            <Link to="/products/gloves" className="text-mangla-foreground hover:text-mangla-gold transition-colors py-1">Gloves</Link>
            <Link to="/products/shoes" className="text-mangla-foreground hover:text-mangla-gold transition-colors py-1">Shoes</Link>
            <Link to="/products/glasses" className="text-mangla-foreground hover:text-mangla-gold transition-colors py-1">Glasses</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
