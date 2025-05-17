import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme/ThemeProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/components/ui/use-toast';

const Contact = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    document.title = "Contact Us - Mangla Sports";
    window.scrollTo(0, 0);
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll get back to you shortly.",
        variant: "default"
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <motion.div 
      className={cn(
        "min-h-screen flex flex-col",
        isDark ? "bg-mangla" : "bg-slate-50"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="container-custom">
          {/* Hero Section */}
          <motion.div 
            className="mb-16"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className={cn(
              "text-4xl md:text-5xl font-bold mb-6",
              isDark ? "text-white" : "text-slate-900"
            )}>
              Contact Us
            </h1>
            <p className={cn(
              "text-lg max-w-3xl",
              isDark ? "text-gray-300" : "text-slate-700"
            )}>
              We're here to help with any questions about our products or services. Reach out to us using any of the methods below.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className={cn(
                "rounded-lg p-6 lg:p-8",
                isDark ? "bg-slate-800" : "bg-white shadow-md"
              )}>
                <h2 className={cn(
                  "text-2xl font-bold mb-6",
                  isDark ? "text-white" : "text-slate-900"
                )}>
                  Send Us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label 
                      htmlFor="name" 
                      className={cn(
                        "block text-sm font-medium mb-2",
                        isDark ? "text-gray-300" : "text-gray-700"
                      )}
                    >
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={isDark ? "bg-slate-700 border-slate-600 text-white" : ""}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label 
                        htmlFor="email" 
                        className={cn(
                          "block text-sm font-medium mb-2",
                          isDark ? "text-gray-300" : "text-gray-700"
                        )}
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Your email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={isDark ? "bg-slate-700 border-slate-600 text-white" : ""}
                      />
                    </div>
                    
                    <div>
                      <label 
                        htmlFor="phone" 
                        className={cn(
                          "block text-sm font-medium mb-2",
                          isDark ? "text-gray-300" : "text-gray-700"
                        )}
                      >
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="Your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        className={isDark ? "bg-slate-700 border-slate-600 text-white" : ""}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="subject" 
                      className={cn(
                        "block text-sm font-medium mb-2",
                        isDark ? "text-gray-300" : "text-gray-700"
                      )}
                    >
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="What is your message regarding?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={isDark ? "bg-slate-700 border-slate-600 text-white" : ""}
                    />
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="message" 
                      className={cn(
                        "block text-sm font-medium mb-2",
                        isDark ? "text-gray-300" : "text-gray-700"
                      )}
                    >
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Please describe your question or request in detail"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className={isDark ? "bg-slate-700 border-slate-600 text-white" : ""}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-mangla-gold hover:bg-mangla-gold/90 text-black font-medium py-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </div>
            </motion.div>
            
            {/* Contact Information */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Store Information */}
              <div className={cn(
                "rounded-lg p-6 lg:p-8",
                isDark ? "bg-slate-800" : "bg-white shadow-md"
              )}>
                <h2 className={cn(
                  "text-2xl font-bold mb-6",
                  isDark ? "text-white" : "text-slate-900"
                )}>
                  Our Store
                </h2>
                
                <div className="space-y-5">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-mangla-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className={cn(
                        "text-base font-medium",
                        isDark ? "text-white" : "text-slate-900"
                      )}>Address</h3>
                      <p className={isDark ? "text-gray-400" : "text-slate-700"}>
                        Bhupindra Road, 22 number phatak,<br />
                        near Khoobsurat Palace,<br />
                        Patiala, Punjab-147001, India
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-mangla-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className={cn(
                        "text-base font-medium",
                        isDark ? "text-white" : "text-slate-900"
                      )}>Opening Hours</h3>
                      <p className={isDark ? "text-gray-400" : "text-slate-700"}>
                        Monday - Saturday: 10:00 AM - 7:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-mangla-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className={cn(
                        "text-base font-medium",
                        isDark ? "text-white" : "text-slate-900"
                      )}>Phone</h3>
                      <p className={isDark ? "text-gray-400" : "text-slate-700"}>
                        +91 92569 30009
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-mangla-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className={cn(
                        "text-base font-medium",
                        isDark ? "text-white" : "text-slate-900"
                      )}>Email</h3>
                      <p className={isDark ? "text-gray-400" : "text-slate-700"}>
                        <a href="mailto:officialmanglasports@gmail.com" className="hover:text-mangla-gold">
                          officialmanglasports@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Map */}
              <div className={cn(
                "rounded-lg overflow-hidden h-80",
                isDark ? "border border-slate-700" : "shadow-md"
              )}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3424.6593642881686!2d76.3825!3d30.3352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a7f77d1cdd125%3A0xa89ac6f9c3c06c90!2sPatiala%2C%20Punjab%20147001%2C%20India!5e0!3m2!1sen!2sus!4v1720459687!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mangla Sports & Associates Location"
                />
              </div>
              
              {/* Social Media */}
              <div className={cn(
                "rounded-lg p-6 lg:p-8",
                isDark ? "bg-slate-800" : "bg-white shadow-md"
              )}>
                <h2 className={cn(
                  "text-xl font-bold mb-4",
                  isDark ? "text-white" : "text-slate-900"
                )}>
                  Follow Us
                </h2>
                <div className="flex space-x-4">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-mangla-gold hover:text-mangla-gold/80 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-mangla-gold hover:text-mangla-gold/80 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://youtube.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-mangla-gold hover:text-mangla-gold/80 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://wa.me/919256930009" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-mangla-gold hover:text-mangla-gold/80 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default Contact;
