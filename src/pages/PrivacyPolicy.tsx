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
        "sticky top-0 z-50 w-full border-b backdrop-blur-sm",
        isDark ? "bg-mangla/95 border-gray-800" : "bg-white/95 border-gray-200"
      )}>
        <div className="container-custom h-20 flex items-center">
          <Link 
            to="/" 
            className={cn(
              "flex items-center space-x-3 hover:opacity-80 transition-all duration-200 hover:scale-105",
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
              className="h-6 w-6"
            >
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            <span className="font-semibold text-lg">Back to Home</span>
          </Link>
        </div>
      </header>
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className={cn(
          "py-20 md:py-24 lg:py-32 relative overflow-hidden",
          isDark ? "bg-mangla" : "bg-white"
        )}>
          <div className="container-custom relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div 
                className="inline-flex items-center px-6 py-3 rounded-full bg-mangla-gold/10 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className={cn("text-sm md:text-base font-medium tracking-wider", isDark ? "text-mangla-gold" : "text-mangla-gold")}>
                  Privacy Policy
                </span>
              </motion.div>
              
              <motion.h1 
                className={cn(
                  "text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight",
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
                <p className="text-lg md:text-xl lg:text-2xl mb-0">
                  Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className={cn("py-20 md:py-24 lg:py-32", isDark ? "bg-slate-900" : "bg-gray-50")}>
          <div className="container-custom">
            <div className={cn("max-w-4xl mx-auto p-8 md:p-12 rounded-2xl", isDark ? "bg-mangla" : "bg-white shadow-xl")}>
              <div className="prose max-w-none">
                <div className="space-y-12">
                  {/* Information We Collect */}
                  <div className="pb-10 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                      <div className={cn("w-2 h-8 rounded-full mr-4", isDark ? "bg-mangla-gold" : "bg-mangla-gold")}></div>
                      <h2 className={cn("text-2xl md:text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                        Information We Collect
                      </h2>
                    </div>
                    <p className={cn("text-base md:text-lg leading-relaxed ml-6", isDark ? "text-gray-300" : "text-slate-600")}>
                      We may collect personal information that you provide directly to us, such as your name, email address, phone number, and shipping address when you make a purchase or create an account.
                    </p>
                  </div>

                  {/* How We Use Your Information */}
                  <div className="pb-10 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                      <div className={cn("w-2 h-8 rounded-full mr-4", isDark ? "bg-mangla-gold" : "bg-mangla-gold")}></div>
                      <h2 className={cn("text-2xl md:text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                        How We Use Your Information
                      </h2>
                    </div>
                    <ul className={cn("list-disc pl-8 space-y-3 mt-4 text-base md:text-lg leading-relaxed ml-6", isDark ? "text-gray-300" : "text-slate-600")}>
                      <li>Process and fulfill your orders</li>
                      <li>Communicate with you about your orders and account</li>
                      <li>Provide customer support</li>
                      <li>Improve our website and services</li>
                      <li>Send you marketing communications (with your consent)</li>
                    </ul>
                  </div>

                  {/* Information Sharing */}
                  <div className="pb-10 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                      <div className={cn("w-2 h-8 rounded-full mr-4", isDark ? "bg-mangla-gold" : "bg-mangla-gold")}></div>
                      <h2 className={cn("text-2xl md:text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                        Information Sharing
                      </h2>
                    </div>
                    <p className={cn("text-base md:text-lg leading-relaxed ml-6", isDark ? "text-gray-300" : "text-slate-600")}>
                      We do not sell or rent your personal information to third parties. We may share your information with service providers who assist us in operating our website, conducting our business, or servicing you.
                    </p>
                  </div>

                  {/* Data Security */}
                  <div className="pb-10 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                      <div className={cn("w-2 h-8 rounded-full mr-4", isDark ? "bg-mangla-gold" : "bg-mangla-gold")}></div>
                      <h2 className={cn("text-2xl md:text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                        Data Security
                      </h2>
                    </div>
                    <p className={cn("text-base md:text-lg leading-relaxed ml-6", isDark ? "text-gray-300" : "text-slate-600")}>
                      We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.
                    </p>
                  </div>

                  {/* Your Rights */}
                  <div className="pb-10 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                      <div className={cn("w-2 h-8 rounded-full mr-4", isDark ? "bg-mangla-gold" : "text-mangla-gold")}></div>
                      <h2 className={cn("text-2xl md:text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                        Your Rights
                      </h2>
                    </div>
                    <p className={cn("text-base md:text-lg leading-relaxed ml-6", isDark ? "text-gray-300" : "text-slate-600")}>
                      You have the right to access, correct, or delete your personal information. You may also have the right to object to or restrict certain processing of your information.
                    </p>
                  </div>

                  {/* Changes to This Policy */}
                  <div className="pb-10 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                      <div className={cn("w-2 h-8 rounded-full mr-4", isDark ? "bg-mangla-gold" : "bg-mangla-gold")}></div>
                      <h2 className={cn("text-2xl md:text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                        Changes to This Policy
                      </h2>
                    </div>
                    <p className={cn("text-base md:text-lg leading-relaxed ml-6", isDark ? "text-gray-300" : "text-slate-600")}>
                      We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                    </p>
                  </div>

                  {/* Contact Us */}
                  <div className="pt-6">
                    <div className="flex items-center mb-6">
                      <div className={cn("w-2 h-8 rounded-full mr-4", isDark ? "bg-mangla-gold" : "bg-mangla-gold")}></div>
                      <h2 className={cn("text-2xl md:text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                        Contact Us
                      </h2>
                    </div>
                    <p className={cn("text-base md:text-lg leading-relaxed ml-6", isDark ? "text-gray-300" : "text-slate-600")}>
                      If you have any questions about this Privacy Policy, please contact us at{' '}
                      <a href="mailto:officialmanglasports@gmail.com" className="text-mangla-gold hover:underline font-medium">
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
