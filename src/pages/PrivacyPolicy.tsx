import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../components/theme/ThemeProvider';
import Footer from '../components/layout/Footer';
import { cn } from '../lib/utils';

const PrivacyPolicy = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col"
    >
      {/* Header with Back Button */}
      <header className={cn(
        "sticky top-0 z-50 w-full border-b",
        isDark ? "bg-mangla border-gray-800" : "bg-white border-gray-200"
      )}>
        <div className="container-custom h-16 flex items-center">
          <Link 
            to="/" 
            className={cn(
              "flex items-center space-x-2 hover:opacity-80 transition-opacity",
              isDark ? "text-white" : "text-slate-900"
            )}
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo(0, 0);
              setTimeout(() => {
                window.location.href = '/';
              }, 0);
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </header>
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className={cn(
          "py-16 md:py-20 lg:py-24 relative overflow-hidden",
          isDark ? "bg-mangla" : "bg-white"
        )}>
          <div className="container-custom relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div 
                className="inline-flex items-center px-4 py-2 rounded-full bg-mangla-gold/10 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className={cn("text-sm font-medium tracking-wider", isDark ? "text-mangla-gold" : "text-mangla-gold")}>
                  Privacy Policy
                </span>
              </motion.div>
              
              <motion.h1 
                className={cn(
                  "text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight",
                  isDark ? "text-white" : "text-slate-900"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Our <span className="text-mangla-gold">Privacy Policy</span>
              </motion.h1>
              
              <motion.div 
                className={cn(
                  "max-w-3xl mx-auto leading-relaxed",
                  isDark ? "text-gray-300" : "text-slate-700"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p className="text-lg md:text-xl mb-8">
                  Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className={cn("py-16 md:py-20 lg:py-24", isDark ? "bg-slate-900" : "bg-gray-50")}>
          <div className="container-custom">
            <div className={cn("max-w-4xl mx-auto p-8 rounded-xl", isDark ? "bg-mangla" : "bg-white shadow-lg")}>
              <div className="prose max-w-none">
                <div className="space-y-8">
                  <div>
                    <h2 className={cn("text-2xl font-bold mb-4", isDark ? "text-white" : "text-slate-900")}>
                      Information We Collect
                    </h2>
                    <p className={cn("text-base leading-relaxed", isDark ? "text-gray-300" : "text-slate-600")}>
                      We may collect personal information that you provide directly to us, such as your name, email address, phone number, and shipping address when you make a purchase or create an account.
                    </p>
                  </div>

                  <div>
                    <h2 className={cn("text-2xl font-bold mb-4", isDark ? "text-white" : "text-slate-900")}>
                      How We Use Your Information
                    </h2>
                    <ul className={cn("list-disc pl-6 space-y-2 mt-2", isDark ? "text-gray-300" : "text-slate-600")}>
                      <li>Process and fulfill your orders</li>
                      <li>Communicate with you about your orders and account</li>
                      <li>Provide customer support</li>
                      <li>Improve our website and services</li>
                      <li>Send you marketing communications (with your consent)</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className={cn("text-2xl font-bold mb-4", isDark ? "text-white" : "text-slate-900")}>
                      Information Sharing
                    </h2>
                    <p className={cn("text-base leading-relaxed", isDark ? "text-gray-300" : "text-slate-600")}>
                      We do not sell or rent your personal information to third parties. We may share your information with service providers who assist us in operating our website, conducting our business, or servicing you.
                    </p>
                  </div>

                  <div>
                    <h2 className={cn("text-2xl font-bold mb-4", isDark ? "text-white" : "text-slate-900")}>
                      Data Security
                    </h2>
                    <p className={cn("text-base leading-relaxed", isDark ? "text-gray-300" : "text-slate-600")}>
                      We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.
                    </p>
                  </div>

                  <div>
                    <h2 className={cn("text-2xl font-bold mb-4", isDark ? "text-white" : "text-slate-900")}>
                      Your Rights
                    </h2>
                    <p className={cn("text-base leading-relaxed", isDark ? "text-gray-300" : "text-slate-600")}>
                      You have the right to access, correct, or delete your personal information. You may also have the right to object to or restrict certain processing of your information.
                    </p>
                  </div>

                  <div>
                    <h2 className={cn("text-2xl font-bold mb-4", isDark ? "text-white" : "text-slate-900")}>
                      Changes to This Policy
                    </h2>
                    <p className={cn("text-base leading-relaxed", isDark ? "text-gray-300" : "text-slate-600")}>
                      We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                    </p>
                  </div>

                  <div>
                    <h2 className={cn("text-2xl font-bold mb-4", isDark ? "text-white" : "text-slate-900")}>
                      Contact Us
                    </h2>
                    <p className={cn("text-base leading-relaxed", isDark ? "text-gray-300" : "text-slate-600")}>
                      If you have any questions about this Privacy Policy, please contact us at{' '}
                      <a href="mailto:officialmanglasports@gmail.com" className="text-mangla-gold hover:underline">
                        officialmanglasports@gmail.com
                      </a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default PrivacyPolicy;
