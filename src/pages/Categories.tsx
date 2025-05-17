import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTheme } from '../components/theme/ThemeProvider';
import { Card, CardContent } from "@/components/ui/card";

interface CollectionItemProps {
  title: string;
  link: string;
  image: string;
}

// Full list of all collections with images
const allCollections: CollectionItemProps[] = [
  { 
    title: "Air Rifles", 
    link: "/products/air-rifles",
    image: "/lovable-uploads/f6511efe-79e5-4cc8-b162-cd6690da117f.png"
  },
  { 
    title: "Air Pistols", 
    link: "/products/air-pistols",
    image: "/lovable-uploads/1a43b533-cd5c-4d93-ad4d-11182e4a80a8.png"
  },
  { 
    title: "CO2 Pistols", 
    link: "/products/co2-pistols",
    image: "/lovable-uploads/abe30c6a-a8c1-41e2-b747-db6293109e7d.png"
  },
  { 
    title: "Air Pellets", 
    link: "/products/air-pellets",
    image: "/lovable-uploads/ccff352e-0441-4a8a-992b-6d6d4071eab8.png"
  },
  { 
    title: "Spares", 
    link: "/products/spares",
    image: "/lovable-uploads/bfe6bd77-ba77-4a00-83ae-78679b1bc65b.png"
  },
  { 
    title: "Air Rifle Accessories", 
    link: "/products/air-rifle-accessories",
    image: "/lovable-uploads/9d861ad0-08bd-4f35-9567-bf07dbe5551b.png"
  },
  { 
    title: "Air Pistol Accessories", 
    link: "/products/air-pistol-accessories",
    image: "/lovable-uploads/aa897794-9610-4c04-9c17-d3928750fc0e.png"
  },
  { 
    title: "Manual Target Systems", 
    link: "/products/manual-target-systems",
    image: "/lovable-uploads/85f832fc-2392-48b5-8aed-ac47b08b590e.png"
  },
  { 
    title: "Electronic Target Systems", 
    link: "/products/electronic-target-systems",
    image: "/lovable-uploads/94816e34-750a-420e-b8fc-bde67a9fe267.png"
  },
  { 
    title: "Scatt Training Systems", 
    link: "/products/scatt-training-systems",
    image: "/lovable-uploads/e284a5bc-98e2-45a3-b9b1-11aea9dadfb1.png"
  },
  { 
    title: "Consumables", 
    link: "/products/consumables",
    image: "/lovable-uploads/343e01c8-d47b-4613-9aad-6f7197159da6.png"
  }
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

const CollectionItem: React.FC<CollectionItemProps> = ({ title, link, image }) => {
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
          "h-full overflow-hidden shadow-lg",
          isDark 
            ? "bg-mangla-dark-gray border-gray-800 hover:border-mangla-gold/70" 
            : "bg-white border-gray-200 hover:border-amber-500/70"
        )}>
          <div className="relative overflow-hidden">
            <div className="w-full h-40 sm:h-48 md:h-56 lg:h-64 flex items-center justify-center bg-white overflow-hidden">
              <div className="p-4 flex items-center justify-center w-full h-full relative">
                {/* Background pattern */}
                <div className={cn(
                  "absolute inset-0 opacity-5",
                  isDark ? "bg-grid-white/10" : "bg-grid-black/10"
                )}></div>
                
                {/* Category image with enhanced animation */}
                <motion.img 
                  src={image} 
                  alt={title} 
                  className="z-10 transition-all duration-500 group-hover:scale-110"
                  style={{ 
                    maxHeight: "100%", 
                    maxWidth: "100%", 
                    objectFit: "contain",
                    display: "block"
                  }}
                  whileHover={{ rotate: [0, -1, 1, -1, 0] }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div className="p-4 w-full">
                <motion.div 
                  className={cn(
                    "w-full py-2.5 font-medium rounded-md text-center flex items-center justify-center space-x-2",
                    isDark 
                      ? "bg-mangla-gold text-mangla-dark-gray" 
                      : "bg-amber-600 text-white"
                  )}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>View Collection</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </motion.div>
              </div>
            </div>
            
            {/* Category badge */}
            <div className="absolute top-3 right-3 z-10">
              <span className={cn(
                "px-2 py-1 text-xs font-medium rounded-full",
                isDark 
                  ? "bg-mangla-gold/90 text-mangla-dark-gray" 
                  : "bg-amber-600/90 text-white"
              )}>
                Category
              </span>
            </div>
          </div>
          <CardContent className="p-4">
            <p className={cn(
              "text-lg font-semibold group-hover:text-mangla-gold transition-colors text-center",
              isDark ? "text-white" : "text-slate-900"
            )}>
              {title}
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

const Categories: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  useEffect(() => {
    document.title = "Mangla Sports - All Categories";
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900"
    )}>
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Breadcrumb Navigation */}
        <motion.nav 
          className="flex mb-6 mt-6" 
          aria-label="Breadcrumb"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link to="/" className={cn(
                "inline-flex items-center text-sm font-medium", 
                isDark ? "text-gray-300 hover:text-mangla-gold" : "text-gray-600 hover:text-amber-600"
              )}>
                <svg className="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L4 10.414V17a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-6.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                </svg>
                Home
              </Link>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                </svg>
                <span className={cn(
                  "ml-1 text-sm font-medium md:ml-2",
                  isDark ? "text-mangla-gold" : "text-amber-600"
                )}>
                  Categories
                </span>
              </div>
            </li>
          </ol>
        </motion.nav>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className={cn(
            "text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6",
            isDark ? "text-white" : "text-slate-900"
          )}>
            Browse Our Categories
          </h1>
          <div className={cn(
            "w-16 sm:w-24 h-1 mx-auto mb-4 sm:mb-6",
            isDark ? "bg-mangla-gold" : "bg-amber-500"
          )}></div>
          <p className={cn(
            "max-w-3xl mx-auto text-base md:text-lg",
            isDark ? "text-gray-300" : "text-slate-700"
          )}>
            Explore our premium collection of shooting sports equipment and accessories
          </p>
          <div className="mt-6 flex justify-center">
            <Link 
              to="/products"
              className={cn(
                "inline-flex items-center px-5 py-2.5 rounded-md font-medium text-sm",
                isDark 
                  ? "bg-mangla-gold text-mangla-dark-gray hover:bg-mangla-gold/90" 
                  : "bg-amber-600 text-white hover:bg-amber-700"
              )}
            >
              View All Products
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </motion.div>
        
        {/* Category count indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={cn(
            "mb-6 text-sm py-1.5 px-3 rounded-full inline-flex items-center",
            isDark ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-700"
          )}
        >
          <span className="font-medium mr-1">{allCollections.length}</span>
          <span>categories available</span>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {allCollections.map((collection, index) => (
            <CollectionItem 
              key={index} 
              title={collection.title}
              link={collection.link}
              image={collection.image}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

import PageLayout from '../components/layout/PageLayout';

const CategoriesPage = () => (
  <PageLayout>
    <Categories />
  </PageLayout>
);

export default CategoriesPage;
