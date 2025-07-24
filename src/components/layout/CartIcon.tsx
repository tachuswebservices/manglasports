import React, { useEffect } from 'react';
import { ShoppingCart, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn, formatIndianPrice } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface CartItemProps {
  product: {
    id: string;
    name: string;
    price: string;
    images: string[];
    quantity: number;
    offerPrice?: number;
    numericPrice?: number;
  };
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CartItem = ({ product, onRemove, onUpdateQuantity }: CartItemProps) => {
  return (
    <div className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
      <div className="flex-shrink-0 h-16 w-16 bg-white dark:bg-gray-700 rounded-md overflow-hidden">
        <img 
          src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.png'} 
          alt={product.name}
          className="h-full w-full object-contain p-1"
        />
      </div>
      <div className="ml-3 flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {product.name}
        </h4>
        <div className="flex items-baseline gap-2 mt-1">
          {product.offerPrice && product.offerPrice > 0 ? (
            <>
              <span className="text-sm font-bold text-mangla-gold">
                {formatIndianPrice(product.offerPrice)}
              </span>
              <span className="text-xs text-gray-500 line-through">
                {formatIndianPrice(
                  typeof product.numericPrice === 'number' && !isNaN(product.numericPrice)
                    ? product.numericPrice
                    : (typeof product.price === 'string' ? parseFloat(product.price.replace(/[^\d.]/g, '')) : (typeof product.price === 'number' ? product.price : 0))
                )}
              </span>
            </>
          ) : (
            <span className="text-sm font-bold text-mangla-gold">
              {formatIndianPrice(
                typeof product.numericPrice === 'number' && !isNaN(product.numericPrice)
                  ? product.numericPrice
                  : (typeof product.price === 'string' ? parseFloat(product.price.replace(/[^\d.]/g, '')) : (typeof product.price === 'number' ? product.price : 0))
              )}
            </span>
          )}
        </div>
        <div className="flex items-center mt-2 space-x-2">
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            <button 
              className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => onUpdateQuantity(product.id, Math.max(1, product.quantity - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="px-2 py-1 text-sm w-8 text-center">{product.quantity}</span>
            <button 
              className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => onUpdateQuantity(product.id, product.quantity + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <button 
        onClick={() => onRemove(product.id)}
        className="text-gray-400 hover:text-rose-500 transition-colors p-1 rounded-full"
        aria-label="Remove from cart"
      >
        <Trash className="w-4 h-4" />
      </button>
    </div>
  );
};

interface CartIconProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartIcon: React.FC<CartIconProps> = ({ isOpen, setIsOpen }) => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartItemCount } = useCart();
  
  const isMobile = useIsMobile();
  const hasItems = cart.length > 0;
  const totalItems = getCartItemCount();
  const totalPrice = getCartTotal();

  // Prevent body scroll when cart is open on mobile
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

  // Close cart when clicking outside
  const cartRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={cartRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-mangla-gold transition-colors"
        aria-label={`Cart (${totalItems} items)`}
      >
        <ShoppingCart className="w-6 h-6" />
        {hasItems && (
          <span className="absolute -top-1 -right-1 bg-mangla-gold text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems > 9 ? '9+' : totalItems}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`fixed sm:absolute top-0 sm:top-auto right-0 sm:right-0 mt-0 sm:mt-2 w-full sm:w-80 h-screen sm:h-auto sm:max-h-[80vh] bg-white dark:bg-slate-800 rounded-none sm:rounded-lg shadow-xl sm:shadow-lg overflow-y-auto z-50 border-0 sm:border border-gray-200 dark:border-gray-700 transition-all duration-300 transform ${isMobile ? 'translate-x-0' : 'translate-y-0'}`}
          >
            {/* Mobile Close Button */}
            {isMobile && (
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close cart"
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-mangla-gold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900 dark:text-white">Shopping Cart</h3>
              </div>
            </div>

            <div className={`p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 sm:hidden`}>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Cart</h3>
              </div>
            <div className="max-h-[calc(100vh-200px)] sm:max-h-96 overflow-y-auto">
              {hasItems ? (
                <>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {cart.map((item) => (
                      <CartItem
                        key={item.id}
                        product={item}
                        onRemove={removeFromCart}
                        onUpdateQuantity={updateQuantity}
                      />
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Total:</span>
                      <span className="font-bold text-lg text-mangla-gold">{formatIndianPrice(totalPrice)}</span>
                    </div>
                    <Button
                      asChild
                      className="w-full bg-mangla-gold hover:bg-mangla-gold/90 text-mangla-dark-gray font-medium"
                    >
                      <Link to="/checkout" onClick={() => setIsOpen(false)}>
                        Go to Checkout
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center">
                  <ShoppingCart className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-4 w-full bg-transparent border-mangla-gold text-mangla-gold hover:bg-mangla-gold hover:text-mangla-dark-gray dark:hover:text-mangla-dark-gray transition-colors"
                  >
                    <Link to="/products" onClick={() => setIsOpen(false)}>
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartIcon;
