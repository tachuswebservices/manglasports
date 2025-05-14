
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeProvider';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ProductProps {
  name: string;
  price: string;
  image: string;
  category: string;
}

const products: ProductProps[] = [
  {
    name: "Walther LG500 ITEC Triple Edition",
    price: "₹199,999",
    image: "/lovable-uploads/44b2615c-e47e-41de-b6c4-97af839d9903.png",
    category: "Air Rifles"
  },
  {
    name: "Pardini K12 J Short",
    price: "₹185,999",
    image: "/lovable-uploads/5818a836-9981-47bc-bfb7-4efb566262b6.png",
    category: "Air Pistols"
  },
  {
    name: "Umarex 12g CO2 Cartridges (Capsules)",
    price: "₹1,499",
    image: "/lovable-uploads/343e01c8-d47b-4613-9aad-6f7197159da6.png",
    category: "Consumables"
  },
  {
    name: "SCATT MX-W2 WI-FI",
    price: "₹89,999",
    image: "/lovable-uploads/e284a5bc-98e2-45a3-b9b1-11aea9dadfb1.png",
    category: "Scatt Training Systems"
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

// Enhanced gradient backgrounds with more vibrant colors
const gradientBackgrounds = [
  'from-blue-200 to-indigo-300',
  'from-amber-200 to-yellow-300',
  'from-rose-200 to-pink-300',
  'from-emerald-200 to-teal-300',
];

const ProductCard: React.FC<ProductProps> = ({ name, price, image, category }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <motion.div 
      variants={item}
      className="group h-full"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className={`${isDark ? 'bg-mangla-dark-gray border-gray-800' : 'bg-white border-gray-200'} h-full overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300`}>
        <div className="relative overflow-hidden">
          <AspectRatio ratio={1} className="bg-gradient-to-br shadow-inner w-full">
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <img 
                src={image} 
                alt={name} 
                className="transition-transform duration-500 group-hover:scale-110 max-h-[80%] max-w-[80%] object-contain"
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
        <CardContent className="p-4">
          <p className="text-mangla-gold text-sm mb-2">{category}</p>
          <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} font-medium mb-1 group-hover:text-mangla-gold transition-colors line-clamp-2 h-[48px]`}>{name}</h3>
          <p className={`${isDark ? 'text-gray-300' : 'text-slate-700'} font-bold`}>{price}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const NewArrivals = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <section className={`section-padding ${isDark ? 'bg-mangla' : 'bg-[#f8fafc]'}`}>
      <div className="container-custom">
        <motion.div 
          className="flex justify-between items-center mb-10"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className={`section-title ${isDark ? 'text-white' : 'text-slate-900'}`}>New Arrivals</h2>
            <motion.div 
              className="w-20 h-1 bg-mangla-gold mt-2 mb-4"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 80, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            ></motion.div>
            <p className={`${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Latest additions to our premium collection</p>
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
            <div key={index} className={`${gradientBackgrounds[index % gradientBackgrounds.length]} bg-gradient-to-br rounded-lg p-[2px]`}>
              <ProductCard 
                key={index} 
                name={product.name} 
                price={product.price} 
                image={product.image}
                category={product.category}
              />
            </div>
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

export default NewArrivals;
