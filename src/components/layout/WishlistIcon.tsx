import React from 'react';
import { Heart, X, Heart as HeartFilled, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '@/contexts/WishlistContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';
import { Product } from '@/data/products';

interface WishlistItemProps {
  product: Product;
  onRemove: (id: string) => void;
  onMoveToCart: (product: Product) => void;
}

const WishlistItem = ({ product, onRemove, onMoveToCart }: WishlistItemProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
      <div className="flex-shrink-0 h-16 w-16 bg-white dark:bg-gray-700 rounded-md overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="h-full w-full object-contain p-1"
        />
      </div>
      <div className="ml-3 flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {product.name}
        </h4>
        <p className="text-sm font-bold text-mangla-gold mt-1">{product.price}</p>
        <div className="flex mt-2 space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs px-2"
            onClick={() => onMoveToCart(product)}
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            Add to Cart
          </Button>
        </div>
      </div>
      <button 
        onClick={() => onRemove(product.id)}
        className="text-gray-400 hover:text-rose-500 transition-colors p-1"
        aria-label="Remove from wishlist"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const WishlistIcon = () => {
  const { wishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const itemCount = wishlist.length;

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
  };

  const handleMoveToCart = (product: Product) => {
    // TODO: Implement move to cart functionality
    console.log('Move to cart:', product);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2 rounded-full transition-colors",
          isDark ? "hover:bg-slate-700" : "hover:bg-gray-100"
        )}
        aria-label="Wishlist"
        aria-expanded={isOpen}
      >
        {isInWishlist ? (
          <HeartFilled className="w-6 h-6 text-rose-500 fill-current" />
        ) : (
          <Heart className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        )}
        
        {itemCount > 0 && (
          <motion.span 
            className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {itemCount > 9 ? '9+' : itemCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 z-50",
              isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200"
            )}
          >
            <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-medium text-gray-900 dark:text-white">My Wishlist</h3>
              <Link 
                to="/wishlist" 
                className="text-xs text-mangla-gold hover:underline"
                onClick={() => setIsOpen(false)}
              >
                View All
              </Link>
            </div>
            
            {itemCount > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {wishlist.map((product) => (
                  <WishlistItem
                    key={product.id}
                    product={product}
                    onRemove={handleRemove}
                    onMoveToCart={handleMoveToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="p-4 text-center">
                <Heart className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400">Your wishlist is empty</p>
                <Button 
                  variant="outline" 
                  className="mt-3"
                  size="sm"
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to products page
                    window.location.href = '/products';
                  }}
                >
                  Browse Products
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WishlistIcon;
