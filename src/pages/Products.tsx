
import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { cn } from '@/lib/utils';
import { useTheme } from '../components/theme/ThemeProvider';
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';

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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 capitalize">
            {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </h1>
          <div className="w-20 h-1 bg-mangla-gold mb-10"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Product listings will be added here */}
            <div className="text-white text-center py-20">
              Coming soon! Our product catalog is being updated.
            </div>
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
      
      <main className="py-20 container-custom">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className={cn(
            "text-4xl md:text-5xl font-bold mb-6",
            isDark ? "text-white" : "text-slate-900"
          )}>
            All Collections
          </h1>
          <div className={cn(
            "w-20 h-1 mb-6",
            isDark ? "bg-mangla-gold" : "bg-amber-500"
          )}></div>
          <p className={cn(
            "max-w-3xl mb-10",
            isDark ? "text-gray-300" : "text-slate-700"
          )}>
            Browse our complete range of collections designed for precision shooting enthusiasts and professionals
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
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
