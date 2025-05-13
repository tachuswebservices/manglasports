
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <Link to="#" className="text-mangla-foreground hover:text-mangla-gold transition-colors">Products</Link>
          <Link to="#" className="text-mangla-foreground hover:text-mangla-gold transition-colors">About Us</Link>
          <Link to="#" className="text-mangla-foreground hover:text-mangla-gold transition-colors">News</Link>
          <Link to="#" className="text-mangla-foreground hover:text-mangla-gold transition-colors">Contact</Link>
        </nav>

        <div className="md:hidden">
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-mangla-dark-gray absolute top-full left-0 right-0 border-t border-gray-800 animate-fade-down">
          <div className="container-custom py-4 flex flex-col space-y-4">
            <Link to="/" className="text-mangla-foreground hover:text-mangla-gold transition-colors py-2">Home</Link>
            <Link to="#" className="text-mangla-foreground hover:text-mangla-gold transition-colors py-2">Products</Link>
            <Link to="#" className="text-mangla-foreground hover:text-mangla-gold transition-colors py-2">About Us</Link>
            <Link to="#" className="text-mangla-foreground hover:text-mangla-gold transition-colors py-2">News</Link>
            <Link to="#" className="text-mangla-foreground hover:text-mangla-gold transition-colors py-2">Contact</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
