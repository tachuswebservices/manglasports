
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Products = () => {
  const { category } = useParams();
  
  useEffect(() => {
    document.title = `Mangla Sports - ${category?.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`;
  }, [category]);

  return (
    <motion.div 
      className="bg-mangla min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      
      <main className="py-20 container-custom">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 capitalize">
          {category?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </h1>
        <div className="w-20 h-1 bg-mangla-gold mb-10"></div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Product listings will be added here */}
          <div className="text-white text-center py-20">
            Coming soon! Our product catalog is being updated.
          </div>
        </div>
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default Products;
