
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeProvider';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";

interface CollectionItemProps {
  title: string;
  link: string;
  image: string;
  featured?: boolean;
}

// Full list of all collections - with consistent naming, URLs and images
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

// Show only 4 collections and exclude "Spares" as requested
// Mark all collections as featured
const featuredCollections = allCollections
  .filter(collection => collection.title !== "Spares")
  .slice(0, 4)
  .map((collection) => {
    return {
      ...collection,
      featured: true // All collections are featured
    };
  });

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

const CollectionItem: React.FC<CollectionItemProps> = ({ title, link, image, featured = false }) => {
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
            {/* Featured badge */}
            {featured && (
              <div className="absolute top-2 right-2 z-10">
                <div className="bg-amber-400 text-black text-xs font-bold py-1 px-3 rounded shadow-md">
                  FEATURED
                </div>
              </div>
            )}
            <div className="w-full h-[260px] flex items-center justify-center bg-white">
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
              "text-lg font-semibold group-hover:text-mangla-gold transition-colors",
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

const FeaturedCollections: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <section id="featured-collections" className={cn(
      "py-16 md:py-20", 
      isDark ? "bg-mangla-dark-gray/40" : "bg-slate-50"
    )}>
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <motion.div 
            className="mb-6 md:mb-0"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={cn(
              "section-title text-4xl md:text-5xl font-bold",
              isDark ? "text-white" : "text-slate-900"
            )}>
              Featured Collections
            </h2>
            <motion.div 
              className={cn(
                "w-20 h-1 mt-2 mb-4",
                isDark ? "bg-mangla-gold" : "bg-amber-500"
              )}
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 80, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            ></motion.div>
            <p className={cn(
              "max-w-2xl",
              isDark ? "text-gray-300" : "text-slate-700"
            )}>
              Explore our curated collections designed for champions and enthusiasts alike
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant={isDark ? "outline" : "default"}
              className={cn(
                "group font-medium",
                isDark ? "border-mangla-gold text-mangla-gold hover:bg-mangla-gold hover:text-black" : 
                "bg-amber-500 text-white hover:bg-amber-600"
              )}
              asChild
            >
              <Link to="/products">
                View All Collections
              </Link>
            </Button>
          </motion.div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {featuredCollections.map((collection, index) => (
            <CollectionItem 
              key={index} 
              title={collection.title}
              link={collection.link}
              image={collection.image}
              featured={collection.featured}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
