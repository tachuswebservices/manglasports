
import React from 'react';
import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';

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
    name: "Competition Air Rifle X100",
    price: "₹105,999",
    image: "https://images.unsplash.com/photo-1584178668396-37ae4e4bbb2b?q=80&w=1000&auto=format&fit=crop",
    category: "Air Rifles",
    rating: 4.9,
    soldCount: 126
  },
  {
    name: "Match Grade Air Pistol",
    price: "₹72,499",
    image: "https://images.unsplash.com/photo-1584178045080-cffef477173a?q=80&w=1000&auto=format&fit=crop",
    category: "Air Pistols",
    rating: 4.8,
    soldCount: 98
  },
  {
    name: "Premium Target Pellets (500)",
    price: "₹1,299",
    image: "https://images.unsplash.com/photo-1617124074721-767bc360aafc?q=80&w=1000&auto=format&fit=crop",
    category: "Ammunition",
    rating: 4.9,
    soldCount: 312
  },
  {
    name: "Competition Shooting Shoes",
    price: "₹8,999",
    image: "https://images.unsplash.com/photo-1585589266883-32e9457ec269?q=80&w=1000&auto=format&fit=crop",
    category: "Footwear",
    rating: 4.7,
    soldCount: 86
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
  return (
    <motion.div 
      variants={item}
      className="group"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="bg-mangla-dark-gray dark:bg-mangla-dark-gray rounded-lg overflow-hidden border border-gray-300 dark:border-gray-800 h-full relative">
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-mangla-gold text-mangla-dark-gray text-xs font-bold px-2 py-1 rounded">BEST SELLER</span>
        </div>
        <div className="relative overflow-hidden">
          <AspectRatio ratio={1 / 1}>
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
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
          <h3 className="text-slate-900 dark:text-white font-medium mb-1 group-hover:text-mangla-gold transition-colors">{name}</h3>
          <p className="text-slate-700 dark:text-gray-300 font-bold">{price}</p>
          
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-300 dark:border-gray-700">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-mangla-gold' : 'text-gray-400 dark:text-gray-600'}`}
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              ))}
              <span className="text-slate-800 dark:text-white text-xs ml-1">{rating}</span>
            </div>
            <span className="text-slate-500 dark:text-gray-400 text-xs">{soldCount} sold</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const BestSellers = () => {
  return (
    <section className="section-padding bg-gradient-to-b from-white to-slate-100 dark:from-mangla dark:to-mangla-dark-gray">
      <div className="container-custom">
        <motion.div 
          className="flex justify-between items-center mb-10"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="section-title text-slate-900 dark:text-white">Best Sellers</h2>
            <motion.div 
              className="w-20 h-1 bg-mangla-gold mt-2 mb-4"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 80, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            ></motion.div>
            <p className="text-slate-600 dark:text-gray-400">Our most popular products loved by champions</p>
          </div>
          <motion.button 
            className="hidden md:block text-mangla-gold hover:text-white border border-mangla-gold hover:border-white px-6 py-2 rounded-md transition-colors"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(212, 175, 55, 0.1)" }}
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
            className="text-mangla-gold hover:text-white border border-mangla-gold hover:border-white px-6 py-2 rounded-md transition-colors"
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
