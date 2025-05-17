import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTheme } from '../components/theme/ThemeProvider';
import { Card, CardContent } from "@/components/ui/card";
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

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
          "h-full overflow-hidden",
          isDark ? "bg-mangla-dark-gray border-gray-800" : "bg-white border-gray-300"
        )}>
          <div className="relative overflow-hidden">
            <div className="w-full h-40 sm:h-48 md:h-56 lg:h-64 flex items-center justify-center bg-white overflow-hidden">
              <div className="p-4 flex items-center justify-center w-full h-full">
                <img 
                  src={image} 
                  alt={title} 
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div className="p-4 w-full">
                <motion.div 
                  className="w-full py-2 bg-mangla-gold text-mangla-dark-gray font-medium rounded text-center"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  View Collection
                </motion.div>
              </div>
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
          className="mb-10 text-center"
        >
          <h1 className={cn(
            "text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6",
            isDark ? "text-white" : "text-slate-900"
          )}>
            All Categories
          </h1>
          <div className={cn(
            "w-16 sm:w-20 h-1 mx-auto mb-4 sm:mb-6",
            isDark ? "bg-mangla-gold" : "bg-amber-500"
          )}></div>
          <p className={cn(
            "max-w-3xl mx-auto",
            isDark ? "text-gray-300" : "text-slate-700"
          )}>
            Explore our complete range of shooting sports equipment and accessories
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
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
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default Categories;
