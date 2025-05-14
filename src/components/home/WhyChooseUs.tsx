
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, BookOpen, Package, Flag } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';

interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: FeatureProps[] = [
  {
    title: "Uncompromising Quality",
    description: "We source only the finest equipment that meets our rigorous standards for precision, reliability, and performance.",
    icon: <Shield className="h-10 w-10" />
  },
  {
    title: "Expert Guidance & Support",
    description: "Our team of seasoned professionals offers personalized consultation and ongoing support to elevate your shooting experience.",
    icon: <BookOpen className="h-10 w-10" />
  },
  {
    title: "Curated Selection",
    description: "Our catalog features a carefully curated selection of the world's finest shooting sports equipment, tailored for Indian enthusiasts.",
    icon: <Package className="h-10 w-10" />
  },
  {
    title: "Commitment to Indian Shooters",
    description: "We're dedicated to advancing shooting sports in India through education, access to premium equipment, and community support.",
    icon: <Flag className="h-10 w-10" />
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6 } }
};

const FeatureCard: React.FC<FeatureProps> = ({ title, description, icon }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div 
      variants={item}
      className={`${isDark ? 'bg-mangla-dark-gray' : 'bg-white'} p-6 rounded-lg border ${isDark ? 'border-gray-800' : 'border-gray-200'} h-full flex flex-col`}
      whileHover={{ 
        scale: 1.03, 
        borderColor: "#D4AF37",
        boxShadow: "0 10px 30px -15px rgba(212, 175, 55, 0.2)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div 
        className="text-mangla-gold mb-4"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {icon}
      </motion.div>
      <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
    </motion.div>
  );
};

const WhyChooseUs = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <section className={`py-16 ${isDark ? 'bg-gradient-to-b from-mangla-dark-gray to-mangla' : 'bg-gray-50'}`}>
      <div className="container-custom">
        <motion.h2 
          className={`text-center text-3xl md:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          Why Choose Mangla Sports & Associates?
        </motion.h2>
        
        <motion.div 
          className="w-20 h-1 bg-mangla-gold mx-auto mb-6"
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: 80, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        ></motion.div>
        
        <motion.p 
          className={`text-center max-w-2xl mx-auto mb-12 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Our commitment to excellence makes us the trusted partner for shooting sports enthusiasts across India.
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              title={feature.title} 
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
