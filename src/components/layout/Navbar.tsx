
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Crosshair } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import ThemeToggle from '../theme/ThemeToggle';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';

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
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-mangla bg-opacity-95 backdrop-blur-sm py-4 shadow-lg' : 'bg-transparent py-6'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-mangla-gold font-montserrat font-bold text-2xl">MANGLA SPORTS</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-mangla-foreground hover:text-mangla-gold transition-colors">Home</Link>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-transparent hover:text-mangla-gold focus:bg-transparent">Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {[
                      { title: "Air Rifles", icon: <Crosshair className="w-4 h-4 mr-2" /> },
                      { title: "Air Pistols", icon: <Crosshair className="w-4 h-4 mr-2" /> },
                      { title: "Pellets", icon: <Crosshair className="w-4 h-4 mr-2" /> },
                      { title: "Gloves", icon: <Crosshair className="w-4 h-4 mr-2" /> },
                      { title: "Shoes", icon: <Crosshair className="w-4 h-4 mr-2" /> },
                      { title: "Glasses", icon: <Crosshair className="w-4 h-4 mr-2" /> },
                    ].map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <a
                            href="#"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex items-center"
                          >
                            {item.icon}
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <Link to="#" className="text-mangla-foreground hover:text-mangla-gold transition-colors">About Us</Link>
          <Link to="#" className="text-mangla-foreground hover:text-mangla-gold transition-colors">Contact</Link>
          
          <motion.button
            aria-label="Search"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-mangla-foreground hover:text-mangla-gold transition-colors focus:outline-none"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search className="w-5 h-5" />
          </motion.button>
          
          <ThemeToggle />
        </nav>

        <div className="md:hidden flex items-center space-x-4">
          <ThemeToggle />
          
          <motion.button
            aria-label="Search"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-mangla-foreground hover:text-mangla-gold transition-colors focus:outline-none"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search className="w-5 h-5" />
          </motion.button>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-mangla-foreground"
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

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            className="absolute top-full left-0 right-0 bg-mangla bg-opacity-95 backdrop-blur-sm border-t border-gray-800 shadow-lg"
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
                  className="flex-grow bg-mangla-dark-gray border-gray-700 focus:border-mangla-gold"
                  autoFocus
                />
                <motion.button 
                  type="submit"
                  className="btn-primary text-sm px-4 py-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Search
                </motion.button>
                <motion.button 
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="btn-secondary text-sm px-4 py-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-mangla-dark-gray absolute top-full left-0 right-0 border-t border-gray-800 animate-fade-down">
          <div className="container-custom py-4 flex flex-col space-y-4">
            <Link to="/" className="text-mangla-foreground hover:text-mangla-gold transition-colors py-2">Home</Link>
            
            {/* Mobile Product Categories */}
            <div className="flex flex-col space-y-2 pl-4">
              <div className="font-medium text-mangla-gold py-1">Products:</div>
              <Link to="#" className="text-mangla-foreground hover:text-mangla-gold transition-colors py-1">Air Rifles</Link>
              <Link to="#" className="text-mangla-foreground hover:text-mangla-gold transition-colors py-1">Air Pistols</Link>
              <Link to="#" className="text-mangla-foreground hover:text-mangla-gold transition-colors py-1">Pellets</Link>
              <Link to="#" className="text-mangla-foreground hover:text-mangla-gold transition-colors py-1">Gloves</Link>
              <Link to="#" className="text-mangla-foreground hover:text-mangla-gold transition-colors py-1">Shoes</Link>
              <Link to="#" className="text-mangla-foreground hover:text-mangla-gold transition-colors py-1">Glasses</Link>
            </div>
            
            <Link to="#" className="text-mangla-foreground hover:text-mangla-gold transition-colors py-2">About Us</Link>
            <Link to="#" className="text-mangla-foreground hover:text-mangla-gold transition-colors py-2">Contact</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
