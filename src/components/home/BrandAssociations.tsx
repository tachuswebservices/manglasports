
import React from 'react';
import { motion } from 'framer-motion';

const logos = [
  "https://via.placeholder.com/200x100/1A1A1A/FFFFFF?text=Brand+1",
  "https://via.placeholder.com/200x100/1A1A1A/FFFFFF?text=Brand+2",
  "https://via.placeholder.com/200x100/1A1A1A/FFFFFF?text=Brand+3",
  "https://via.placeholder.com/200x100/1A1A1A/FFFFFF?text=Brand+4",
  "https://via.placeholder.com/200x100/1A1A1A/FFFFFF?text=Brand+5",
  "https://via.placeholder.com/200x100/1A1A1A/FFFFFF?text=Brand+6"
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
  return (
    <section className="py-16 bg-mangla-dark-gray">
      <div className="container-custom">
        <motion.h2 
          className="text-2xl md:text-3xl font-bold mb-10 text-center"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          Featuring Premier Brands
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {logos.map((logo, index) => (
            <motion.div 
              key={index}
              variants={item}
              className="flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
              whileHover={{ 
                scale: 1.1, 
                transition: { duration: 0.3 } 
              }}
            >
              <img 
                src={logo} 
                alt={`Partner brand ${index + 1}`} 
                className="max-h-12"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BrandAssociations;
