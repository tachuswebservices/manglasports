import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Star, Info, Clock, Package, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatIndianPrice } from '@/lib/utils';
import { useTheme } from '../theme/ThemeProvider';
import { StockLevel } from './StockIndicator';

export interface ProductDetails {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  category: string;
  brand: string;
  isNew: boolean;
  isOnSale: boolean;
  shortDescription?: string;
  stockLevel?: StockLevel;
  images?: string[]; // Added images to the interface
}

interface QuickViewModalProps {
  product: ProductDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: ProductDetails) => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // If product is null or modal is closed, don't render anything
  if (!product || !isOpen) return null;
  
  // Calculate discount percentage if originalPrice exists
  const discountPercentage = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;
  
  // Handle overlay click (close if clicking outside the modal)
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (onAddToCart && product.inStock) {
      onAddToCart(product);
    }
  };
  
  // Stock level indicator
  const renderStockLevel = () => {
    if (!product.inStock) {
      return (
        <div className="flex items-center text-red-500">
          <AlertCircle className="w-4 h-4 mr-1" />
          <span className="text-sm">Out of Stock</span>
        </div>
      );
    }
    
    if (product.stockLevel === 'low') {
      return (
        <div className="flex items-center text-red-500">
          <AlertCircle className="w-4 h-4 mr-1" />
          <span className="text-sm">Low Stock - Order Soon</span>
        </div>
      );
    } else if (product.stockLevel === 'medium') {
      return (
        <div className="flex items-center text-amber-500">
          <Clock className="w-4 h-4 mr-1" />
          <span className="text-sm">In Stock - Limited Quantity</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-green-500">
          <Check className="w-4 h-4 mr-1" />
          <span className="text-sm">In Stock - Ready to Ship</span>
        </div>
      );
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
          onClick={handleOverlayClick}
        >
          <motion.div 
            className={cn(
              "relative w-full max-w-4xl overflow-hidden rounded-lg shadow-xl",
              isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900"
            )}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className={cn(
                "absolute right-2 top-2 p-1 rounded-full z-10",
                isDark ? "bg-slate-800 text-gray-300 hover:bg-slate-700" : 
                        "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col md:flex-row">
              {/* Product image */}
              <div className="md:w-1/2 p-6 bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                <div className="relative w-full h-80 md:h-96">
                  <img 
                    src={product.images && product.images.length > 0 ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url) : '/placeholder.png'} 
                    alt={product.name} 
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col space-y-1">
                    {product.isNew && (
                      <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                        New
                      </span>
                    )}
                    {product.isOnSale && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Sale
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Product details */}
              <div className="md:w-1/2 p-6 flex flex-col">
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={cn(
                          "w-4 h-4",
                          star <= Math.floor(product.rating) 
                            ? "fill-mangla-gold text-mangla-gold" 
                            : isDark 
                              ? "text-gray-700" 
                              : "text-gray-300"
                        )} 
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                    </span>
                  </div>
                </div>
                
                {/* Price */}
                <div className="flex items-baseline mb-4">
                  <span className="text-2xl font-bold">
                    {formatIndianPrice(product.price)}
                  </span>
                  {formatIndianPrice(product.originalPrice) && (
                    <>
                      <span className="ml-2 text-lg text-gray-500 line-through">
                        {formatIndianPrice(product.originalPrice)}
                      </span>
                      <span className="ml-2 text-sm font-medium text-green-600 dark:text-green-400">
                        {discountPercentage}% OFF
                      </span>
                    </>
                  )}
                </div>
                
                {/* Short description */}
                <p className={cn(
                  "mb-4 text-sm",
                  isDark ? "text-gray-300" : "text-gray-600"
                )}>
                  {product.shortDescription || "This premium product meets the highest standards for accuracy and reliability in shooting sports."}
                </p>
                
                {/* Stock info */}
                <div className="mb-4">
                  {renderStockLevel()}
                </div>
                
                {/* Brand and Category */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center">
                    <Info className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Brand: </span>
                    <span className="text-sm ml-1 font-medium">{product.brand}</span>
                  </div>
                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Category: </span>
                    <span className="text-sm ml-1 font-medium capitalize">
                      {product.category.replace(/-/g, ' ')}
                    </span>
                  </div>
                </div>
                
                {/* Buttons */}
                <div className="mt-auto flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant={product.inStock ? "default" : "secondary"}
                    className={cn(
                      "flex-1 py-2 font-medium flex items-center justify-center gap-2",
                      product.inStock 
                        ? "bg-mangla-gold hover:bg-mangla-gold/90 text-slate-900" 
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    )}
                    disabled={!product.inStock}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1 border-gray-300 dark:border-gray-700"
                  >
                    View Full Details
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
