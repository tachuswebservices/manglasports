
import React from 'react';
import { motion } from 'framer-motion';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useTheme } from '../theme/ThemeProvider';
import { cn } from '@/lib/utils';

interface CollectionItemProps {
  title: string;
  image: string;
  description: string;
}

const collections: CollectionItemProps[] = [
  {
    title: "Professional Equipment",
    image: "/lovable-uploads/94816e34-750a-420e-b8fc-bde67a9fe267.png",
    description: "Competition-grade shooting equipment"
  },
  {
    title: "Precision Accessories",
    image: "/lovable-uploads/81cbd973-5303-4c06-bfdf-36f0555888f8.png",
    description: "Fine-tuned accessories for peak performance"
  },
  {
    title: "Training Solutions",
    image: "/lovable-uploads/bfe6bd77-ba77-4a00-83ae-78679b1bc65b.png",
    description: "Advanced training systems and targets"
  },
  {
    title: "Performance Gear",
    image: "/lovable-uploads/9d861ad0-08bd-4f35-9567-bf07dbe5551b.png",
    description: "Competition-ready shooting gear"
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

const CollectionItem: React.FC<CollectionItemProps> = ({ title, image, description }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <motion.div 
      variants={item}
      className="group cursor-pointer"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className={`${isDark ? 'bg-mangla-dark-gray/50' : 'bg-white'} rounded-lg overflow-hidden border ${isDark ? 'border-gray-800' : 'border-gray-200'} h-full relative`}>
        <div className="relative overflow-hidden">
          <AspectRatio ratio={4/3}>
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-70 group-hover:opacity-80 transition-opacity"></div>
          </AspectRatio>
          <div className="absolute bottom-0 left-0 p-4 w-full">
            <h3 className="text-white font-semibold text-lg md:text-xl mb-1">{title}</h3>
            <p className="text-gray-200 text-sm opacity-90">{description}</p>
            <div className={`mt-3 w-8 h-0.5 ${isDark ? 'bg-mangla-gold' : 'bg-amber-500'} group-hover:w-20 transition-all duration-300`}></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturedCollections: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <section id="featured-collections" className={`section-padding ${isDark ? 'bg-mangla-dark-gray/30' : 'bg-slate-50'}`}>
      <div className="container-custom">
        <motion.div 
          className="text-center mb-10"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`section-title ${isDark ? 'text-white' : 'text-slate-900'}`}>Featured Collections</h2>
          <motion.div 
            className={`w-20 h-1 ${isDark ? 'bg-mangla-gold' : 'bg-amber-500'} mx-auto mt-2 mb-4`}
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 80, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          ></motion.div>
          <p className={`${isDark ? 'text-gray-400' : 'text-slate-600'} max-w-2xl mx-auto`}>
            Explore our curated collections designed for champions and enthusiasts alike
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
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
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
