import React, { useEffect } from 'react';
import { Heart, X, Heart as HeartFilled, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '@/contexts/WishlistContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';
import { Product } from '@/data/products';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const isDark = theme === 'dark';
  const itemCount = wishlist.length;

  // Prevent body scroll when wishlist is open on mobile
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isMobile]);

  // Close wishlist when clicking outside
  const wishlistRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wishlistRef.current && !wishlistRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
  };

  const handleMoveToCart = (product: Product) => {
    // TODO: Implement move to cart functionality
    console.log('Move to cart:', product);
  };

  return (
    <div className="relative" ref={wishlistRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={cn(
          "relative p-2 rounded-full transition-colors",
          isDark ? "hover:bg-slate-700" : "hover:bg-gray-100"
        )}
        aria-label={`Wishlist (${itemCount} items)`}
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
              "fixed sm:absolute top-0 sm:top-auto right-0 sm:right-0 mt-0 sm:mt-2 w-full sm:w-80 h-screen sm:h-auto sm:max-h-[80vh] bg-white dark:bg-slate-800 rounded-none sm:rounded-lg shadow-xl sm:shadow-lg overflow-y-auto z-50 border-0 sm:border border-gray-200 dark:border-gray-700 transition-all duration-300 transform",
              isMobile ? 'translate-x-0' : 'translate-y-0'
            )}
          >
            <div className={`p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 sm:hidden`}>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">My Wishlist</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-2 -mr-2"
                aria-label="Close wishlist"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="hidden sm:block px-4 py-2 border-b border-gray-200 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900 dark:text-white">My Wishlist</h3>
                <Link 
                  to="/wishlist" 
                  className="text-xs text-mangla-gold hover:underline"
                  onClick={() => setIsOpen(false)}
                >
                  View All
                </Link>
              </div>
            </div>
            
            {itemCount > 0 ? (
              <div className="max-h-[calc(100vh-200px)] sm:max-h-96 overflow-y-auto">
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
