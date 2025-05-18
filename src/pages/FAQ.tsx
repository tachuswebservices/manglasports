import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const FAQ = () => {
  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, UPI, Net Banking, and Cash on Delivery (COD) for all orders.'
    },
    {
      question: 'What is your shipping policy?',
      answer: 'We offer free shipping on all orders above ₹5,000. For orders below this amount, a flat shipping fee of ₹150 will be applied. Delivery typically takes 3-7 business days.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Currently, we only ship within India. We plan to expand our shipping options in the future.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 7-day return policy for unused and undamaged products. Please contact our customer support team to initiate a return.'
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order is shipped, you will receive a tracking number via email and SMS. You can use this number to track your order on our website or the courier service\'s website.'
    },
    {
      question: 'Do you offer warranty on your products?',
      answer: 'Yes, all our products come with a manufacturer\'s warranty. The warranty period varies by product and is mentioned on the product page.'
    },
    {
      question: 'How can I contact customer support?',
      answer: 'You can reach our customer support team via email at support@manglasports.com or call us at +91 92569 30009. Our support team is available Monday to Saturday, 10 AM to 7 PM.'
    },
    {
      question: 'Do you offer bulk discounts?',
      answer: 'Yes, we offer special pricing for bulk orders. Please contact our sales team at sales@manglasports.com for more information.'
    },
    {
      question: 'What are your business hours?',
      answer: 'Our customer support team is available Monday to Saturday, 10 AM to 7 PM. Orders can be placed on our website 24/7.'
    },
    {
      question: 'How do I know if a product is in stock?',
      answer: 'All products listed on our website are currently in stock. If an item is out of stock, it will be clearly marked as \'Out of Stock\' on the product page.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-mangla-gold hover:text-mangla-gold-dark transition-colors mb-6"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Home
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Find answers to common questions about our products, shipping, and more.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer focus:outline-none">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {faq.question}
                    </h3>
                    <svg 
                      className="w-5 h-5 text-gray-500 transition-transform duration-200 group-open:rotate-180" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 pt-0 -mt-2 text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </div>
                </details>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-mangla-gold/10 dark:bg-mangla-gold/20 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Can't find the answer you're looking for? Our team is happy to help.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-mangla-gold hover:bg-mangla-gold-dark shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mangla-gold transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
