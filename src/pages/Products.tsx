
import React, { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { cn } from '@/lib/utils';
import { useTheme } from '../components/theme/ThemeProvider';
import { Card, CardContent } from "@/components/ui/card";

interface CollectionItemProps {
  title: string;
  link: string;
}

// Define all collections - ensure consistency between links and what's used in the URLs
const allCollections: CollectionItemProps[] = [
  { title: "Air Rifles", link: "/products/air-rifles" },
  { title: "Air Pistols", link: "/products/air-pistols" },
  { title: "CO2 Pistols", link: "/products/co2-pistols" },
  { title: "Air Pellets", link: "/products/air-pellets" },
  { title: "Spares", link: "/products/spares" },
  { title: "Air Rifle Accessories", link: "/products/air-rifle-accessories" },
  { title: "Air Pistol Accessories", link: "/products/air-pistol-accessories" },
  { title: "Manual Target Systems", link: "/products/manual-target-systems" },
  { title: "Electronic Target Systems", link: "/products/electronic-target-systems" },
  { title: "Scatt Training Systems", link: "/products/scatt-training-systems" },
  { title: "Consumables", link: "/products/consumables" }
];

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

const CollectionItem: React.FC<CollectionItemProps> = ({ title, link }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <motion.div 
      variants={item}
      className="group"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Link to={link}>
        <Card className={cn(
          "h-full overflow-hidden",
          isDark ? "bg-mangla-dark-gray border-gray-800" : "bg-white border-gray-300"
        )}>
          <CardContent className="p-6">
            <h3 className={cn(
              "text-xl font-semibold mb-2 group-hover:text-mangla-gold transition-colors",
              isDark ? "text-white" : "text-slate-900"
            )}>
              {title}
            </h3>
            <div className={cn(
              "mt-3 w-10 h-0.5 transition-all duration-300 group-hover:w-24",
              isDark ? "bg-mangla-gold" : "bg-amber-400"
            )}></div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

const Products: React.FC = () => {
  const { category } = useParams();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Scroll to top when category changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);
  
  // Find if the category exists in our collections
  const validCategories = allCollections.map(c => c.link.replace('/products/', ''));
  const isValidCategory = category ? validCategories.includes(category) : true;
  
  useEffect(() => {
    document.title = category 
      ? `Mangla Sports - ${category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`
      : "Mangla Sports - All Collections";
  }, [category]);

  // If category is not valid, redirect to the products page
  if (category && !isValidCategory) {
    return <Navigate to="/products" replace />;
  }

  if (category) {
    return (
      <motion.div 
        className="bg-mangla min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Navbar />
        
        <main className="py-20 container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-10 capitalize">
            {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              {
                id: 'air-rifle-1',
                name: 'Precision Air Rifle Pro X',
                price: 45999,
                originalPrice: 52999,
                image: '/placeholder-rifle-1.jpg',
                rating: 4.8,
                reviewCount: 124,
                inStock: true
              },
              {
                id: 'air-rifle-2',
                name: 'Olympic Target Air Rifle',
                price: 68999,
                originalPrice: 75999,
                image: '/placeholder-rifle-2.jpg',
                rating: 4.9,
                reviewCount: 87,
                inStock: true
              },
              {
                id: 'air-rifle-3',
                name: 'Hunting Air Rifle Elite',
                price: 38999,
                image: '/placeholder-rifle-3.jpg',
                rating: 4.6,
                reviewCount: 203,
                inStock: true
              },
              {
                id: 'air-rifle-4',
                name: 'Junior Air Rifle Trainer',
                price: 28999,
                originalPrice: 32999,
                image: '/placeholder-rifle-4.jpg',
                rating: 4.7,
                reviewCount: 56,
                inStock: false
              }
            ].map((product, index) => (
              <motion.div 
                key={product.id}
                className={cn(
                  "group relative overflow-hidden rounded-lg shadow-lg",
                  isDark ? "bg-mangla-dark-gray" : "bg-white"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              >
                <Link to={`/products/product/${product.id}`} className="block">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    />
                    {!product.inStock && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-2 h-12">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center mb-2">
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
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          ({product.reviewCount})
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-baseline">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                      {product.originalPrice && (
                        <span className="ml-2 text-xs font-medium text-green-600 dark:text-green-400">
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
                
                <div className="px-4 pb-4">
                  <Button 
                    className={cn(
                      "w-full py-2 text-sm font-medium transition-colors",
                      product.inStock 
                        ? "bg-mangla-gold hover:bg-mangla-gold/90 text-mangla"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    )}
                    disabled={!product.inStock}
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
        
        <Footer />
      </motion.div>
    );
  }

  // All collections view
  return (
    <motion.div 
      className={cn(
        "min-h-screen",
        isDark ? "bg-mangla" : "bg-slate-50"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      
      <main className="px-4 sm:px-6 pt-32 pb-16 md:pt-36 md:pb-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className={cn(
            "text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8",
            isDark ? "text-white" : "text-slate-900"
          )}>
            All Collections
          </h1>
          <p className={cn(
            "max-w-3xl mb-10",
            isDark ? "text-gray-300" : "text-slate-700"
          )}>
            Browse our complete range of collections designed for precision shooting enthusiasts and professionals
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {allCollections.map((collection, index) => (
            <CollectionItem 
              key={index} 
              title={collection.title}
              link={collection.link}
            />
          ))}
        </motion.div>
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default Products;
