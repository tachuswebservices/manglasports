
import React from 'react';
import { motion } from 'framer-motion';

interface CategoryProps {
  title: string;
  icon: string;
  description: string;
}

const categories: CategoryProps[] = [
  {
    title: "Precision Rifles",
    icon: "https://images.unsplash.com/photo-1584178668396-37ae4e4bbb2b?q=80&w=1000&auto=format&fit=crop",
    description: "Elite selection of competition-grade precision rifles for target shooting and sport."
  },
  {
    title: "Performance Handguns",
    icon: "https://images.unsplash.com/photo-1584178045080-cffef477173a?q=80&w=1000&auto=format&fit=crop",
    description: "Competition-ready handguns designed for precision, reliability, and performance."
  },
  {
    title: "Advanced Optics",
    icon: "https://images.unsplash.com/photo-1617124074721-767bc360aafc?q=80&w=1000&auto=format&fit=crop",
    description: "Premium scopes and sights for unparalleled accuracy and clarity in any condition."
  },
  {
    title: "Essential Accessories",
    icon: "https://images.unsplash.com/photo-1585589266883-32e9457ec269?q=80&w=1000&auto=format&fit=crop",
    description: "Professional-grade accessories to enhance your shooting experience and performance."
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6 } }
};

const CategoryCard: React.FC<CategoryProps> = ({ title, icon, description }) => {
  return (
    <motion.div 
      variants={item}
      className="bg-mangla-dark-gray rounded-lg overflow-hidden border border-gray-800 group"
      whileHover={{ 
        scale: 1.03, 
        boxShadow: "0 10px 30px -15px rgba(212, 175, 55, 0.25)",
        borderColor: "#D4AF37" 
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="h-48 overflow-hidden">
        <motion.img 
          src={icon} 
          alt={title} 
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.7 }}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-mangla-gold transition-colors">{title}</h3>
        <p className="text-gray-400 mb-4">{description}</p>
        <motion.a 
          href="#" 
          className="text-mangla-gold flex items-center font-medium"
          whileHover={{ x: 10 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          Explore {title}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 ml-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M14 5l7 7m0 0l-7 7m7-7H3" 
            />
          </svg>
        </motion.a>
      </div>
    </motion.div>
  );
};

const ProductCategories = () => {
  return (
    <section className="section-padding bg-mangla">
      <div className="container-custom">
        <motion.h2 
          className="section-title text-center"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          Featured Collections
        </motion.h2>
        
        <motion.div 
          className="w-20 h-1 bg-mangla-gold mx-auto mb-8"
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: 80, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        ></motion.div>
        
        <motion.p 
          className="section-subtitle text-center"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Explore our curated selection of premium shooting sports equipment, designed for champions.
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {categories.map((category, index) => (
            <CategoryCard 
              key={index} 
              title={category.title} 
              icon={category.icon} 
              description={category.description}
            />
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.button 
            className="btn-secondary"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(212, 175, 55, 0.1)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            View All Product Ranges
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductCategories;
