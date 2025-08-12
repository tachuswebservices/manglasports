import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../components/theme/ThemeProvider';
import Footer from '../components/layout/Footer';
import { cn } from '../lib/utils';

const TermsOfService = () => {
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
                  Terms of Service
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
                Our <span className="text-mangla-gold">Terms of Service</span>
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
                  Please read these Terms of Service carefully before using our website. Your access to and use of the service is conditioned on your acceptance of and compliance with these terms.
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
                  {/* Acceptance of Terms */}
                  <div className="pb-10 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                      <div className={cn("w-2 h-8 rounded-full mr-4", isDark ? "bg-mangla-gold" : "bg-mangla-gold")}></div>
                      <h2 className={cn("text-2xl md:text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                        Acceptance of Terms
                      </h2>
                    </div>
                    <p className={cn("text-base md:text-lg leading-relaxed ml-6", isDark ? "text-gray-300" : "text-slate-600")}>
                      By accessing or using our website, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.
                    </p>
                  </div>

                  {/* Use of the Website */}
                  <div className="pb-10 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                      <div className={cn("w-2 h-8 rounded-full mr-4", isDark ? "bg-mangla-gold" : "bg-mangla-gold")}></div>
                      <h2 className={cn("text-2xl md:text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                        Use of the Website
                      </h2>
                    </div>
                    <p className={cn("text-base md:text-lg leading-relaxed mb-4 ml-6", isDark ? "text-gray-300" : "text-slate-600")}>
                      You agree to use the website only for lawful purposes and in accordance with these Terms. You agree not to use the website:
                    </p>
                    <ul className={cn("list-disc pl-8 space-y-3 mt-4 mb-4 text-base md:text-lg leading-relaxed ml-6", isDark ? "text-gray-300" : "text-slate-600")}>
                      <li>In any way that violates any applicable law or regulation</li>
                      <li>To transmit any advertising or promotional material without our prior written consent</li>
                      <li>To impersonate or attempt to impersonate the company or another user</li>
                      <li>To engage in any other conduct that restricts or inhibits anyone's use of the website</li>
                    </ul>
                  </div>

                  {/* Intellectual Property */}
                  <div className="pb-10 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                      <div className={cn("w-2 h-8 rounded-full mr-4", isDark ? "bg-mangla-gold" : "bg-mangla-gold")}></div>
                      <h2 className={cn("text-2xl md:text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                        Intellectual Property
                      </h2>
                    </div>
                    <p className={cn("text-base md:text-lg leading-relaxed ml-6", isDark ? "text-gray-300" : "text-slate-600")}>
                      The website and its original content, features, and functionality are and will remain the exclusive property of Mangla Sports & Associates and its licensors. The website is protected by copyright, trademark, and other laws of both India and foreign countries.
                    </p>
                  </div>

                  {/* Products and Pricing */}
                  <div className="pb-10 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                      <div className={cn("w-2 h-8 rounded-full mr-4", isDark ? "bg-mangla-gold" : "bg-mangla-gold")}></div>
                      <h2 className={cn("text-2xl md:text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                        Products and Pricing
                      </h2>
                    </div>
                    <p className={cn("text-base md:text-lg leading-relaxed mb-4 ml-6", isDark ? "text-gray-300" : "text-slate-600")}>
                      We reserve the right to modify or discontinue products or services at any time without notice. We shall not be liable to you or any third-party for any modification, price change, suspension, or discontinuance of the service.
                    </p>
                    <p className={cn("text-base md:text-lg leading-relaxed ml-6", isDark ? "text-gray-300" : "text-slate-600")}>
                      All prices are in Indian Rupees (INR) and are subject to change without notice.
                    </p>
                  </div>

                  {/* Limitation of Liability */}
                  <div className="pb-10 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                      <div className={cn("w-2 h-8 rounded-full mr-4", isDark ? "bg-mangla-gold" : "bg-mangla-gold")}></div>
                      <h2 className={cn("text-2xl md:text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                        Limitation of Liability
                      </h2>
                    </div>
                    <p className={cn("text-base md:text-lg leading-relaxed ml-6", isDark ? "text-gray-300" : "text-slate-600")}>
                      In no event shall Mangla Sports & Associates, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
                    </p>
                  </div>

                  {/* Governing Law */}
                  <div className="pb-10 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                      <div className={cn("w-2 h-8 rounded-full mr-4", isDark ? "bg-mangla-gold" : "bg-mangla-gold")}></div>
                      <h2 className={cn("text-2xl md:text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                        Governing Law
                      </h2>
                    </div>
                    <p className={cn("text-base md:text-lg leading-relaxed ml-6", isDark ? "text-gray-300" : "text-slate-600")}>
                      These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Patiala, Punjab.
                    </p>
                  </div>

                  {/* Changes to Terms */}
                  <div className="pb-10 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                      <div className={cn("w-2 h-8 rounded-full mr-4", isDark ? "bg-mangla-gold" : "bg-mangla-gold")}></div>
                      <h2 className={cn("text-2xl md:text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                        Changes to Terms
                      </h2>
                    </div>
                    <p className={cn("text-base md:text-lg leading-relaxed ml-6", isDark ? "text-gray-300" : "text-slate-600")}>
                      We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.
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
                      If you have any questions about these Terms, please contact us at{' '}
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

export default TermsOfService;
