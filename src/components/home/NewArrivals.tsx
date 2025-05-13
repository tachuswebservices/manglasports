
import React from 'react';
import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ProductProps {
  name: string;
  price: string;
  image: string;
  category: string;
}

const products: ProductProps[] = [
  {
    name: "Match Air Rifle 800",
    price: "₹89,999",
    image: "https://images.unsplash.com/photo-1584178668396-37ae4e4bbb2b?q=80&w=1000&auto=format&fit=crop",
    category: "Air Rifles"
  },
  {
    name: "Competition Air Pistol Pro",
    price: "₹65,999",
    image: "https://images.unsplash.com/photo-1584178045080-cffef477173a?q=80&w=1000&auto=format&fit=crop",
    category: "Air Pistols"
  },
  {
    name: "Premium Shooting Gloves",
    price: "₹3,499",
    image: "https://images.unsplash.com/photo-1585589266883-32e9457ec269?q=80&w=1000&auto=format&fit=crop",
    category: "Accessories"
  },
  {
    name: "Professional Shooting Jacket",
    price: "₹12,999",
    image: "https://images.unsplash.com/photo-1617124074721-767bc360aafc?q=80&w=1000&auto=format&fit=crop",
    category: "Apparel"
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

const ProductCard: React.FC<ProductProps> = ({ name, price, image, category }) => {
  return (
    <motion.div 
      variants={item}
      className="group"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="bg-mangla-dark-gray rounded-lg overflow-hidden border border-gray-800 h-full">
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
          <h3 className="text-white font-medium mb-1 group-hover:text-mangla-gold transition-colors">{name}</h3>
          <p className="text-gray-300 font-bold">{price}</p>
        </div>
      </div>
    </motion.div>
  );
};

const NewArrivals = () => {
  return (
    <section className="section-padding bg-mangla">
      <div className="container-custom">
        <motion.div 
          className="flex justify-between items-center mb-10"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="section-title">New Arrivals</h2>
            <motion.div 
              className="w-20 h-1 bg-mangla-gold mt-2 mb-4"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 80, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            ></motion.div>
            <p className="text-gray-400">Latest additions to our premium collection</p>
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
            <ProductCard 
              key={index} 
              name={product.name} 
              price={product.price} 
              image={product.image}
              category={product.category}
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

export default NewArrivals;
