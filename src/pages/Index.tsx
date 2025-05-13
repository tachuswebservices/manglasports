
import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/home/HeroSection';
import AboutSnippet from '../components/home/AboutSnippet';
import ProductCategories from '../components/home/ProductCategories';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Testimonials from '../components/home/Testimonials';
import BrandAssociations from '../components/home/BrandAssociations';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion';

const Index = () => {
  // Set page title
  useEffect(() => {
    document.title = "Mangla Sports - Precision. Performance. Passion";
  }, []);

  return (
    <motion.div 
      className="bg-mangla min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      
      <main>
        <HeroSection />
        <AboutSnippet />
        <ProductCategories />
        <WhyChooseUs />
        <Testimonials />
        <BrandAssociations />
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default Index;
