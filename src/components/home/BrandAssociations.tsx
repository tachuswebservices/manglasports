
import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedHeading } from '../animation/TextAnimations';

// Real sporting brands logos
const logos = [
  "https://www.issf-sports.org/img/2010/sponsors/logo_walther.jpg", // Walther
  "https://www.issf-sports.org/img/2010/sponsors/logo_steyr.gif", // Steyr
  "https://cdni.comss.net/logo/cl/big/morini-logo_1.png", // Morini
  "https://pbs.twimg.com/profile_images/1228999122083635201/eMwZHVgb_400x400.jpg", // Pardini
  "https://www.wftc.org.uk/wp-content/uploads/2022/04/feinwerkbau.jpeg", // Feinwerkbau
  "https://www.issf-sports.org/img/2010/sponsors/logo_sius.gif" // SIUS
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
    <section className="py-10 bg-mangla-dark-gray">
      <div className="container-custom">
        <AnimatedHeading className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Our Trusted Brands
        </AnimatedHeading>
        
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
              className="flex items-center justify-center bg-white bg-opacity-10 rounded-lg p-4 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
              whileHover={{ 
                scale: 1.05, 
                transition: { duration: 0.3 } 
              }}
            >
              <img 
                src={logo} 
                alt={`Partner brand ${index + 1}`} 
                className="max-h-10 object-contain"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BrandAssociations;
