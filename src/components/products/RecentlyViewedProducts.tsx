import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '../theme/ThemeProvider';
import type { ProductDetails } from './QuickViewModal';

interface RecentlyViewedProductsProps {
  currentProductId?: string;
  onProductClick?: (product: ProductDetails) => void;
}

const MAX_RECENT_PRODUCTS = 5;
const STORAGE_KEY = 'mangla-recently-viewed';

const RecentlyViewedProducts: React.FC<RecentlyViewedProductsProps> = ({ 
  currentProductId,
  onProductClick 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [products, setProducts] = useState<ProductDetails[]>([]);
  
  // Load recently viewed products from localStorage
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem(STORAGE_KEY);
      if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts) as ProductDetails[];
        // Filter out current product if any
        const filteredProducts = currentProductId 
          ? parsedProducts.filter(product => product.id !== currentProductId)
          : parsedProducts;
        setProducts(filteredProducts.slice(0, MAX_RECENT_PRODUCTS));
      }
    } catch (error) {
      console.error('Error loading recently viewed products:', error);
    }
  }, [currentProductId]);
  
  // If no products, don't render anything
  if (products.length === 0) {
    return null;
  }
  
  return (
    <div className="my-8">
      <h3 className={cn(
        "text-xl font-semibold mb-4",
        isDark ? "text-white" : "text-gray-900"
      )}>
        Recently Viewed
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "group relative overflow-hidden rounded-lg shadow-md",
              isDark ? "bg-slate-800 border border-gray-700" : "bg-white border border-gray-200"
            )}
          >
            <Link 
              to={`/products/product/${product.id}`}
              onClick={() => onProductClick && onProductClick(product)}
              className="block"
            >
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden p-2">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              
              <div className="p-3">
                <h4 className={cn(
                  "text-sm font-medium line-clamp-1",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  {product.name}
                </h4>
                
                <div className="flex items-center mt-1">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={cn(
                          "w-3 h-3",
                          star <= Math.floor(product.rating) 
                            ? "fill-mangla-gold text-mangla-gold" 
                            : isDark 
                              ? "text-gray-700" 
                              : "text-gray-300"
                        )} 
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-baseline mt-1">
                  <span className={cn(
                    "text-sm font-bold",
                    isDark ? "text-white" : "text-gray-900"
                  )}>
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="ml-2 text-xs text-gray-500 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Helper function to add a product to recently viewed
export const addToRecentlyViewed = (product: ProductDetails): void => {
  try {
    const storedProducts = localStorage.getItem(STORAGE_KEY);
    let recentProducts: ProductDetails[] = storedProducts 
      ? JSON.parse(storedProducts) 
      : [];
    
    // Remove the product if it already exists
    recentProducts = recentProducts.filter(p => p.id !== product.id);
    
    // Add the product at the beginning
    recentProducts.unshift(product);
    
    // Limit to MAX_RECENT_PRODUCTS
    recentProducts = recentProducts.slice(0, MAX_RECENT_PRODUCTS);
    
    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentProducts));
  } catch (error) {
    console.error('Error adding product to recently viewed:', error);
  }
};

export default RecentlyViewedProducts;
