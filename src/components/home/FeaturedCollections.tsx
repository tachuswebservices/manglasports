
import React from 'react';
import { motion } from 'framer-motion';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useTheme } from '../theme/ThemeProvider';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';

interface CollectionItemProps {
  title: string;
  image: string;
  description: string;
  link: string;
}

const collections: CollectionItemProps[] = [
  {
    title: "Professional Equipment",
    image: "/lovable-uploads/94816e34-750a-420e-b8fc-bde67a9fe267.png",
    description: "Competition-grade shooting equipment",
    link: "/collections/professional-equipment"
  },
  {
    title: "Precision Accessories",
    image: "/lovable-uploads/81cbd973-5303-4c06-bfdf-36f0555888f8.png",
    description: "Fine-tuned accessories for peak performance",
    link: "/collections/precision-accessories"
  },
  {
    title: "Training Solutions",
    image: "/lovable-uploads/bfe6bd77-ba77-4a00-83ae-78679b1bc65b.png",
    description: "Advanced training systems and targets",
    link: "/collections/training-solutions"
  },
  {
    title: "Performance Gear",
    image: "/lovable-uploads/9d861ad0-08bd-4f35-9567-bf07dbe5551b.png",
    description: "Competition-ready shooting gear",
    link: "/collections/performance-gear"
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

const CollectionItem: React.FC<CollectionItemProps> = ({ title, image, description, link }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <motion.div 
      variants={item}
      className="group cursor-pointer"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Link to={link}>
        <div className={cn(
          "rounded-xl overflow-hidden shadow-lg h-full relative",
          isDark ? "shadow-black/40" : "shadow-gray-200/80"
        )}>
          <div className="relative overflow-hidden">
            <AspectRatio ratio={4/3}>
              <img 
                src={image} 
                alt={title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
            </AspectRatio>
            <div className="absolute bottom-0 left-0 p-5 w-full">
              <h3 className="text-white font-semibold text-xl md:text-2xl mb-2">{title}</h3>
              <p className="text-gray-200 text-sm md:text-base opacity-90">{description}</p>
              <div className={cn(
                "mt-3 w-10 h-0.5 transition-all duration-300 group-hover:w-24",
                isDark ? "bg-mangla-gold" : "bg-amber-400"
              )}></div>
            </div>
          </div>
        </div>
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
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.5, delay: 0.3 }}
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
              <Link to="/collections">
                View All Collections 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {collections.map((collection, index) => (
            <CollectionItem 
              key={index} 
              title={collection.title}
              description={collection.description}
              image={collection.image}
              link={collection.link}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
