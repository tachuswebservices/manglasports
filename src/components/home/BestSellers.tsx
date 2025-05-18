import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WishlistButton } from '@/components/common/WishlistButton';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { products as allProducts } from '@/data/products';

// Extend the Product interface to include soldCount
interface BestSellerProduct extends Omit<typeof allProducts[0], 'inWishlist'> {
  soldCount: number;
}

// Get best sellers from the main products list
const products: BestSellerProduct[] = allProducts
  .filter(product => product.isHot)
  .map(product => ({
    ...product,
    soldCount: (product as any).soldCount || 0
  }));

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

const BestSellerCard: React.FC<BestSellerProduct> = (product) => {
  const { name, price, image, category, rating, soldCount, inStock } = product;
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const isDark = theme === 'dark';
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!inStock) return;
    
    const added = addToCart(product, 1);
    if (added) {
      toast.success(`${name} added to cart`);
    }
  };
  
  return (
    <motion.div 
      variants={item}
      className="group"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className={`${isDark ? 'bg-mangla-dark-gray' : 'bg-white'} rounded-lg overflow-hidden border ${isDark ? 'border-gray-800' : 'border-gray-300'} h-full relative transition-all duration-300 hover:shadow-lg`}>
        {/* Always visible tags */}
        <div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-2">
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">HOT</span>
          {soldCount > 100 && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">BESTSELLER</span>
          )}
          {product.numericPrice && product.numericPrice > 100000 && (
            <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">PREMIUM</span>
          )}
        </div>
        
        {/* Wishlist button - always visible */}
        <div className="absolute top-3 right-3 z-10">
          <WishlistButton 
            product={product} 
            className="bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700/80"
            size="md"
            showTooltip={true}
          />
        </div>
        
        <div className="relative overflow-hidden">
          <div className="w-full h-[260px] flex items-center justify-center bg-white">
            <div className="p-4 flex items-center justify-center w-full h-full">
              <img 
                src={image} 
                alt={name} 
                className="transition-transform duration-500 group-hover:scale-110"
                style={{ 
                  maxHeight: "100%", 
                  maxWidth: "100%", 
                  objectFit: "contain",
                  display: "block"
                }}
              />
            </div>
          </div>
          
          {/* Hover overlay with subtle effect */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-4">
          <div>
            <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} font-medium mb-1 group-hover:text-mangla-gold transition-colors line-clamp-2 h-12`}>
              {name}
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-slate-600'} text-sm mb-2`}>{category}</p>
            <div className="flex items-center justify-between mb-2">
              <p className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold`}>{price}</p>
              <div className="flex items-center bg-amber-500/20 px-2 py-0.5 rounded">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1" />
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">{rating}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
              <span>{soldCount}+ sold</span>
              <span className={cn("text-xs font-medium px-2 py-0.5 rounded", 
                inStock ? "text-green-600 bg-green-100 dark:bg-green-900/30" : "text-red-600 bg-red-100 dark:bg-red-900/30"
              )}>
                {inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            
            <div className="space-y-2">
              <Button
                onClick={handleAddToCart}
                className={cn(
                  "w-full py-2 text-sm font-medium transition-colors",
                  inStock
                    ? isDark 
                      ? "bg-mangla-gold hover:bg-mangla-gold/90 text-mangla-dark-gray"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                )}
                disabled={!inStock}
              >
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button
                variant="outline"
                className="w-full py-2 text-sm font-medium bg-transparent border-mangla-gold/30 text-mangla-gold hover:bg-mangla-gold/10 hover:text-mangla-gold"
                asChild
              >
                <Link to={`/products/product/${product.id}`}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const BestSellers = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <section className={`section-padding ${isDark ? 'bg-mangla' : 'bg-gradient-to-b from-white to-slate-100'}`}>
      <div className="container-custom">
        <motion.div 
          className="flex justify-between items-center mb-10"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className={`section-title ${isDark ? 'text-white' : 'text-slate-900'}`}>Best Sellers</h2>
            <motion.div 
              className="w-20 h-1 bg-mangla-gold mt-2 mb-4"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 80, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            ></motion.div>
            <p className={`${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Our most popular premium shooting equipment</p>
          </div>
          <motion.div
            initial={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              className={`hidden md:block ${isDark ? 'border-mangla-gold text-mangla-gold hover:bg-mangla-gold/10 hover:text-white' : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'} px-6 py-2 h-auto`}
              asChild
            >
              <Link 
                to="/products"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo(0, 0);
                  setTimeout(() => {
                    window.location.href = '/products';
                  }, 0);
                }}
              >
                View All
              </Link>
            </Button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {products.map((product) => (
            <BestSellerCard 
              key={product.id}
              {...product}
            />
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-10 text-center md:hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div
            initial={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              className={`${isDark ? 'border-mangla-gold text-mangla-gold hover:bg-mangla-gold/10 hover:text-white' : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'} px-6 py-2 h-auto`}
              asChild
            >
              <Link 
                to="/products"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo(0, 0);
                  setTimeout(() => {
                    window.location.href = '/products';
                  }, 0);
                }}
              >
                View All
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BestSellers;
