
import React from 'react';
import { motion } from 'framer-motion';

const AboutSnippet = () => {
  return (
    <section id="about-section" className="section-padding bg-gradient-to-b from-mangla to-mangla-dark-gray">
      <div className="container-custom">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="section-title"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            About Mangla Sports
          </motion.h2>
          
          <motion.div 
            className="w-20 h-1 bg-mangla-gold mx-auto mb-8"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 80, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          ></motion.div>
          
          <motion.p 
            className="text-xl mb-8 leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Established with a vision to elevate the shooting sports experience in India, 
            Mangla Sports represents the pinnacle of quality, expertise, and passion. 
            We curate only the finest equipment, backed by decades of collective experience 
            and an unwavering commitment to the shooting community.
          </motion.p>
          
          <motion.a 
            href="#" 
            className="inline-block text-mangla-gold hover:text-white border-b border-mangla-gold hover:border-white transition-colors duration-300 text-lg font-medium"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            Discover Our Story
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSnippet;
