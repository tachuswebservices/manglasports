
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/home/HeroSection';
import FeaturedCollections from '../components/home/FeaturedCollections';
import ProductCategories from '../components/home/ProductCategories';
import NewArrivals from '../components/home/NewArrivals';
import BestSellers from '../components/home/BestSellers';
import Testimonials from '../components/home/Testimonials';
import BrandAssociations from '../components/home/BrandAssociations';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Footer from '../components/layout/Footer';

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
        <FeaturedCollections />
        <NewArrivals />
        <BestSellers />
        <WhyChooseUs />
        <BrandAssociations />
        <Testimonials />
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default Index;
