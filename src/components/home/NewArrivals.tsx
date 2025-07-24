import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider';
import { Button } from '@/components/ui/button';
import { cn, formatIndianPrice } from '@/lib/utils';
import { WishlistButton } from '@/components/common/WishlistButton';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { Star } from 'lucide-react';

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

interface ProductCardProps {
  product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { name, price, images, category, inStock, rating, reviewCount, soldCount } = product;
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
      className="group h-full"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className={`h-full rounded-lg overflow-hidden border transition-all hover:shadow-lg ${isDark ? 'bg-mangla-dark-gray border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="relative h-64 overflow-hidden">
          <img 
            src={images && images.length > 0 ? images[0] : '/placeholder.png'} 
            alt={name} 
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">NEW</span>
          </div>
          {/* Wishlist button */}
          <div className="absolute top-3 right-3 z-10">
            <WishlistButton 
              product={product} 
              className="bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-700/80"
              size="md"
              showTooltip={true}
            />
          </div>
        </div>
        <div className="p-4">
          <p className="text-mangla-gold text-sm mb-1">{category?.name || ''}</p>
          <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} font-medium mb-1 group-hover:text-mangla-gold transition-colors line-clamp-2 h-12`}>
            {name}
          </h3>
          
          {/* Ratings */}
          <div className="flex items-center mt-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className={cn(
                  "mr-0.5",
                  star <= (rating || 0)
                    ? "fill-mangla-gold text-mangla-gold" 
                    : isDark 
                      ? "text-gray-700" 
                      : "text-gray-300"
                )}
              />
            ))}
            <span className={cn(
              "text-xs ml-1",
              isDark ? "text-gray-400" : "text-gray-500"
            )}>
              ({reviewCount || soldCount || 0})
            </span>
          </div>
          
          <div className="flex items-baseline gap-2 mb-3">
            {product.offerPrice && product.offerPrice > 0 ? (
              <>
                <span className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-lg`}>
                  {formatIndianPrice(product.offerPrice)}
                </span>
                <span className="text-sm line-through text-gray-500">
                  {formatIndianPrice(
                    typeof product.numericPrice === 'number' && !isNaN(product.numericPrice)
                      ? product.numericPrice
                      : (typeof price === 'string' ? parseFloat(price.replace(/[^\d.]/g, '')) : (typeof price === 'number' ? price : 0))
                  )}
                </span>
              </>
            ) : (
              <span className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-lg`}>
                {formatIndianPrice(
                  typeof product.numericPrice === 'number' && !isNaN(product.numericPrice)
                    ? product.numericPrice
                    : (typeof price === 'string' ? parseFloat(price.replace(/[^\d.]/g, '')) : (typeof price === 'number' ? price : 0))
                )}
              </span>
            )}
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
    </motion.div>
  );
};

export default function NewArrivals() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/products')
      .then(res => res.json())
      .then(data => setProducts((data.products || []).filter((p: any) => p.isNew)));
  }, []);

  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <section className={`section-padding ${isDark ? 'bg-mangla' : 'bg-[#f8fafc]'}`}>
      <div className="container-custom">
        <motion.div 
          className="flex justify-between items-center mb-10"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className={`section-title ${isDark ? 'text-white' : 'text-slate-900'}`}>New Arrivals</h2>
            <motion.div 
              className="w-20 h-1 bg-mangla-gold mt-2 mb-4"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 80, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            ></motion.div>
            <p className={`${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Latest additions to our premium collection</p>
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
            <ProductCard 
              key={product.id}
              product={product}
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
}
