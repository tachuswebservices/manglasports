
import React from 'react';
import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useTheme } from '../theme/ThemeProvider';

interface BestSellerProps {
  name: string;
  price: string;
  image: string;
  category: string;
  rating: number;
  soldCount: number;
}

const products: BestSellerProps[] = [
  {
    name: "Walther LG500",
    price: "₹249,999",
    image: "/lovable-uploads/94816e34-750a-420e-b8fc-bde67a9fe267.png",
    category: "Competition Air Rifles",
    rating: 5.0,
    soldCount: 89
  },
  {
    name: "Pietro Beretta Px4 Storm",
    price: "₹89,999",
    image: "/lovable-uploads/81cbd973-5303-4c06-bfdf-36f0555888f8.png",
    category: "Air Pistols",
    rating: 4.8,
    soldCount: 132
  },
  {
    name: "Tachus Electronic Target System",
    price: "₹45,999",
    image: "/lovable-uploads/bfe6bd77-ba77-4a00-83ae-78679b1bc65b.png",
    category: "Electronic Target Systems",
    rating: 4.7,
    soldCount: 76
  },
  {
    name: "Pardini K12 Absorber Pistol",
    price: "₹189,999",
    image: "/lovable-uploads/9d861ad0-08bd-4f35-9567-bf07dbe5551b.png",
    category: "Competition Air Pistols",
    rating: 4.9,
    soldCount: 105
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

const BestSellerCard: React.FC<BestSellerProps> = ({ name, price, image, category, rating, soldCount }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <motion.div 
      variants={item}
      className="group"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className={`${isDark ? 'bg-mangla-dark-gray' : 'bg-white'} rounded-lg overflow-hidden border ${isDark ? 'border-gray-800' : 'border-gray-300'} h-full relative`}>
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-mangla-gold text-mangla-dark-gray text-xs font-bold px-2 py-1 rounded">FEATURED</span>
        </div>
        <div className="relative overflow-hidden">
          <AspectRatio ratio={4 / 3}>
            <div className="w-full h-full flex items-center justify-center bg-white p-6">
              <img 
                src={image} 
                alt={name} 
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </AspectRatio>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-4 w-full">
              <motion.button 
                className="w-full py-2 bg-mangla-gold text-mangla-dark-gray font-medium rounded hover:bg-yellow-500 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                View Details
              </motion.button>
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-mangla-gold text-sm mb-2">{category}</p>
          <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} font-medium mb-1 group-hover:text-mangla-gold transition-colors truncate`}>{name}</h3>
          <p className={`${isDark ? 'text-gray-300' : 'text-slate-700'} font-bold`}>{price}</p>
          
          <div className={`flex justify-between items-center mt-3 pt-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-mangla-gold' : isDark ? 'text-gray-600' : 'text-gray-400'}`}
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              ))}
              <span className={`${isDark ? 'text-white' : 'text-slate-800'} text-xs ml-1`}>{rating}</span>
            </div>
            <span className={`${isDark ? 'text-gray-400' : 'text-slate-500'} text-xs`}>{soldCount} sold</span>
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
          <motion.button 
            className={`hidden md:block ${isDark ? 'text-mangla-gold hover:text-white border border-mangla-gold hover:border-white' : 'text-blue-600 hover:text-white border border-blue-600 hover:border-white hover:bg-blue-600'} px-6 py-2 rounded-md transition-colors`}
            whileHover={{ scale: 1.05, backgroundColor: isDark ? "rgba(212, 175, 55, 0.1)" : undefined }}
            whileTap={{ scale: 0.98 }}
          >
            View All
          </motion.button>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {products.map((product, index) => (
            <BestSellerCard 
              key={index} 
              name={product.name} 
              price={product.price} 
              image={product.image}
              category={product.category}
              rating={product.rating}
              soldCount={product.soldCount}
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
          <motion.button 
            className={`${isDark ? 'text-mangla-gold hover:text-white border border-mangla-gold hover:border-white' : 'text-blue-600 hover:text-white border border-blue-600 hover:border-white hover:bg-blue-600'} px-6 py-2 rounded-md transition-colors`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            View All
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default BestSellers;
