import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/components/theme/ThemeProvider';

interface SearchBarProps {
  isMobile?: boolean;
  onClose?: () => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ isMobile = false, onClose, className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch all products from backend on mount
  useEffect(() => {
    fetch('https://manglasportsbackend.onrender.com/api/products')
      .then(res => res.json())
      .then(data => setAllProducts(data))
      .catch(() => setAllProducts([]));
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input when search is opened
  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  // Generate search suggestions
  const updateSuggestions = (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const queryLower = query.toLowerCase();
    const results = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(queryLower) ||
        product.shortDescription?.toLowerCase().includes(queryLower) ||
        (typeof product.brand === 'string'
          ? product.brand.toLowerCase().includes(queryLower)
          : product.brand?.name?.toLowerCase().includes(queryLower)) ||
        (typeof product.category === 'string'
          ? product.category.toLowerCase().includes(queryLower)
          : product.category?.name?.toLowerCase().includes(queryLower))
    );

    setSuggestions(results.slice(0, 5)); // Show top 5 results
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSuggestions([]);
      if (onClose) onClose();
    }
  };

  const handleSuggestionClick = (product: any) => {
    navigate(`/products/product/${product.id}`);
    setSearchQuery('');
    setSuggestions([]);
    setIsFocused(false);
    if (onClose) onClose();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className={`relative w-full ${className}`} ref={searchRef}>
      <form 
        onSubmit={handleSearch} 
        className="relative w-full"
        onClick={(e) => e.stopPropagation()} // Prevent click from closing suggestions
      >
        <div className="relative w-full">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              const value = e.target.value;
              setSearchQuery(value);
              updateSuggestions(value);
              setIsFocused(true);
            }}
            onFocus={() => {
              setIsFocused(true);
            }}
            className={`w-full ${isMobile ? 'pl-3 pr-10' : 'pl-10 pr-10'} h-10 text-sm rounded-md ${
              isDark
                ? 'bg-slate-700 text-white border-slate-600 placeholder:text-gray-300 focus:border-mangla-gold focus:ring-1 focus:ring-mangla-gold'
                : 'bg-white text-slate-700 border-slate-300 placeholder:text-slate-400 focus:border-mangla-gold focus:ring-1 focus:ring-mangla-gold'
            }`}
            aria-label="Search products"
          />
          <div className={`absolute inset-y-0 left-3 flex items-center pointer-events-none ${
            isMobile ? 'hidden' : 'flex'
          }`}>
            <Search className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-slate-400'}`} />
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearSearch();
              }}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Search suggestions */}
      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 mt-1 w-full rounded-md shadow-lg ${
              isDark ? 'bg-slate-800' : 'bg-white'
            } ring-1 ring-black ring-opacity-5 overflow-hidden`}
            style={{
              width: isMobile ? 'calc(100vw - 2rem)' : '100%',
              left: '0',
              transform: 'none',
              maxWidth: '500px',
              maxHeight: '400px',
              overflowY: 'auto',
            }}
          >
            <div className="py-1">
              {suggestions.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleSuggestionClick(product)}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    isDark
                      ? 'text-gray-200 hover:bg-slate-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{product.name}</div>
                  <div className="text-xs text-gray-400 truncate">
                    {(typeof product.brand === 'string' ? product.brand : product.brand?.name) || ''} • {(typeof product.category === 'string' ? product.category : product.category?.name) || ''}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
