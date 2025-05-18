import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeProvider';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, UPI, net banking, and cash on delivery for select locations."
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping typically takes 3-5 business days within India. International shipping may take 7-14 business days depending on the destination."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship internationally. Please contact our customer support for specific country availability and shipping rates."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 14-day return policy for unused products in their original packaging. Please refer to our Returns & Refunds page for detailed information."
  },
  {
    question: "Are your products covered by warranty?",
    answer: "Yes, all our products come with a manufacturer's warranty. The warranty period varies by product. Please check the product description for specific warranty details."
  }
];

const FAQSection = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className={`py-16 ${isDark ? 'bg-mangla-dark-gray' : 'bg-white'}`}>
      <div className="container-custom">
        <motion.div 
          className="text-center mb-12"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`section-title ${isDark ? 'text-white' : 'text-slate-900'}`}>Frequently Asked Questions</h2>
          <motion.div 
            className="w-20 h-1 bg-mangla-gold mx-auto mt-2 mb-6"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 80, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <p className={`max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
            Find answers to common questions about our products, shipping, and more.
          </p>
        </motion.div>

        <motion.div 
          className="max-w-4xl mx-auto"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {faqData.map((faq, index) => (
            <motion.div 
              key={index}
              variants={item}
              className={`mb-4 overflow-hidden rounded-lg ${isDark ? 'bg-mangla' : 'bg-gray-50'} border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
            >
              <button
                className={`w-full px-6 py-4 text-left flex justify-between items-center ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
                onClick={() => toggleFAQ(index)}
              >
                <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className={`w-5 h-5 ${isDark ? 'text-mangla-gold' : 'text-slate-600'}`} />
                ) : (
                  <ChevronDown className={`w-5 h-5 ${isDark ? 'text-mangla-gold' : 'text-slate-600'}`} />
                )}
              </button>
              <motion.div
                initial={false}
                animate={{ 
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className={`p-6 pt-0 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                  {faq.answer}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

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

export default FAQSection;
