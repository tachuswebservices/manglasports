
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeProvider';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
}

const testimonials: TestimonialProps[] = [
  {
    quote: "The expertise and quality of equipment provided by Mangla Sports has dramatically improved my competition performance. Their guidance was invaluable in selecting the perfect setup for my needs.",
    author: "Rajesh Kumar",
    role: "National Level Competitor"
  },
  {
    quote: "As a shooting coach, I've found Mangla Sports to be an invaluable resource. Their knowledge, selection of premium equipment, and commitment to the sport is unmatched in the Indian market.",
    author: "Priya Singh",
    role: "Professional Shooting Coach"
  },
  {
    quote: "When I decided to pursue shooting sports professionally, Mangla Sports provided exceptional guidance. Their equipment recommendations and ongoing support have been crucial to my development.",
    author: "Amit Patel",
    role: "Olympic Hopeful"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6 } }
};

const TestimonialCard: React.FC<TestimonialProps> = ({ quote, author, role }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <motion.div 
      variants={item}
      className={`${isDark ? 'bg-mangla-dark-gray border-gray-800' : 'bg-white border-gray-200'} p-8 rounded-lg border relative`}
      whileHover={{ 
        scale: 1.03, 
        boxShadow: isDark 
          ? "0 10px 30px -15px rgba(212, 175, 55, 0.2)" 
          : "0 10px 30px -15px rgba(59, 130, 246, 0.2)",
        borderColor: isDark ? "#D4AF37" : "#3B82F6"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div 
        className={`absolute -top-5 -left-2 ${isDark ? 'text-mangla-gold' : 'text-amber-500'} text-6xl opacity-30`}
        initial={{ rotate: -10, opacity: 0 }}
        whileInView={{ rotate: 0, opacity: 0.3 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        "
      </motion.div>
      <p className={`italic ${isDark ? 'text-gray-300' : 'text-slate-600'} mb-6 relative z-10`}>{quote}</p>
      <motion.div 
        className="flex items-center"
        initial={{ x: -10, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="w-12 h-12 rounded-full bg-mangla-gold flex items-center justify-center text-mangla-dark-gray font-bold text-xl">
          {author.charAt(0)}
        </div>
        <div className="ml-4">
          <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{author}</p>
          <p className="text-mangla-gold text-sm">{role}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Testimonials = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <section className={`section-padding ${isDark ? 'bg-mangla' : 'bg-[#f8fafc]'}`}>
      <div className="container-custom">
        <motion.h2 
          className={`section-title text-center ${isDark ? 'text-white' : 'text-slate-900'}`}
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          What Our Clients Say
        </motion.h2>
        
        <motion.div 
          className="w-20 h-1 bg-mangla-gold mx-auto mb-8"
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: 80, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        ></motion.div>
        
        <motion.p 
          className={`section-subtitle text-center ${isDark ? 'text-gray-300' : 'text-slate-600'}`}
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Hear from the shooting sports community about their experience with Mangla Sports.
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index} 
              quote={testimonial.quote} 
              author={testimonial.author}
              role={testimonial.role}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
