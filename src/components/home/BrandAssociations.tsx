
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeProvider';

// Updated logos with uploaded images
const logos = [
  "/lovable-uploads/e9aeb95d-c144-45db-b37b-ea803e9eac8e.png", // Pardini
  "/lovable-uploads/85f832fc-2392-48b5-8aed-ac47b08b590e.png", // Anschutz
  "/lovable-uploads/e3ba1dbe-4b02-480b-bc89-d30ffa1fbc5e.png", // Walther
  "/lovable-uploads/017141a0-cde2-4659-a59b-bd25939b3538.png", // MEC
  "/lovable-uploads/320e28cc-4968-4423-a0ee-4758610432ec.png", // Morini
  "/lovable-uploads/72ea075f-973b-4f7a-b6f4-2aed1fd7171d.png"  // Pi
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

const BrandAssociations = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className={`py-10 ${isDark ? 'bg-mangla-dark-gray' : 'bg-slate-100'}`}>
      <div className="container-custom">
        <motion.h2 
          className={`text-2xl md:text-3xl font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-slate-800'}`}
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          Our Trusted Brands
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {logos.map((logo, index) => (
            <motion.div 
              key={index}
              variants={item}
              className={`flex items-center justify-center ${isDark ? 'bg-white bg-opacity-10' : 'bg-white shadow-sm'} rounded-lg p-4 grayscale hover:grayscale-0 ${isDark ? 'opacity-70' : 'opacity-90'} hover:opacity-100 transition-all duration-300`}
              whileHover={{ 
                scale: 1.05, 
                transition: { duration: 0.3 } 
              }}
            >
              <div className="w-full" style={{ height: "80px" }}>
                <div className="h-full flex items-center justify-center">
                  <img 
                    src={logo} 
                    alt={`Partner brand ${index + 1}`} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BrandAssociations;
