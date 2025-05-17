import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme/ThemeProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const About = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    document.title = "About Us - Mangla Sports";
    window.scrollTo(0, 0);
  }, []);

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
              About Mangla Sports & Associates
            </h1>
            <p className={cn(
              "text-lg max-w-3xl",
              isDark ? "text-gray-300" : "text-slate-700"
            )}>
              India's premier destination for high-quality shooting sports equipment and expertise since 2005.
            </p>
          </motion.div>
          
          {/* Our Story Section */}
          <motion.section 
            className="mb-20"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className={cn(
                  "text-3xl font-bold mb-6",
                  isDark ? "text-white" : "text-slate-900"
                )}>Our Story</h2>
                <div className={cn(
                  "space-y-4",
                  isDark ? "text-gray-300" : "text-slate-700"
                )}>
                  <p>
                    Mangla Sports & Associates was founded with a vision to bring world-class shooting sports equipment to India's passionate shooting community.
                  </p>
                  <p>
                    Our journey began in 2005 when our founder, Mr. Rajinder Singh Mangla, a former national-level shooter, recognized the need for high-quality equipment and professional expertise in India's growing shooting sports sector.
                  </p>
                  <p>
                    What started as a small specialized store in Patiala has now grown into one of India's most trusted names in shooting sports equipment, serving amateur enthusiasts, professional athletes, and Olympic champions alike.
                  </p>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="/about-store.jpg" 
                  alt="Mangla Sports Store" 
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/600x400/222/fff?text=Mangla+Sports';
                  }}
                />
              </div>
            </div>
          </motion.section>
          
          {/* Our Mission Section */}
          <motion.section 
            className={cn(
              "p-10 rounded-lg mb-20",
              isDark ? "bg-slate-800" : "bg-white shadow-md"
            )}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className={cn(
              "text-3xl font-bold mb-6 text-center",
              isDark ? "text-white" : "text-slate-900"
            )}>Our Mission</h2>
            <p className={cn(
              "text-center text-lg max-w-3xl mx-auto",
              isDark ? "text-gray-300" : "text-slate-700"
            )}>
              To provide the highest quality shooting sports equipment and expert guidance to every shooter in India, 
              from beginners to Olympians, and to promote the spirit of shooting sports throughout the country.
            </p>
          </motion.section>
          
          {/* Why Choose Us Section */}
          <motion.section 
            className="mb-20"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className={cn(
              "text-3xl font-bold mb-10 text-center",
              isDark ? "text-white" : "text-slate-900"
            )}>Why Choose Mangla Sports</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Premium Quality",
                  description: "We partner with the world's top manufacturers to bring you only the highest quality equipment.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-mangla-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  )
                },
                {
                  title: "Expert Advice",
                  description: "Our team consists of active and former shooters who provide personalized guidance based on experience.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-mangla-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )
                },
                {
                  title: "After-Sales Support",
                  description: "We provide comprehensive maintenance, repair services, and a satisfaction guarantee.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-mangla-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className={cn(
                    "p-6 rounded-lg text-center",
                    isDark ? "bg-slate-800" : "bg-white shadow-md"
                  )}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className={cn(
                    "text-xl font-bold mb-3",
                    isDark ? "text-white" : "text-slate-900"
                  )}>
                    {item.title}
                  </h3>
                  <p className={cn(
                    isDark ? "text-gray-400" : "text-slate-600"
                  )}>
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>
          
          {/* Our Team Section */}
          <motion.section
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className={cn(
              "text-3xl font-bold mb-10 text-center",
              isDark ? "text-white" : "text-slate-900"
            )}>Our Leadership</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Rajinder Singh Mangla",
                  position: "Founder & CEO",
                  bio: "Former national-level shooter with over 30 years of experience in the shooting sports industry.",
                  image: "/team-1.jpg"
                },
                {
                  name: "Harjinder Kaur",
                  position: "Technical Director",
                  bio: "International-level coach with expertise in equipment optimization and technical training.",
                  image: "/team-2.jpg"
                },
                {
                  name: "Gurpreet Singh",
                  position: "Sales Manager",
                  bio: "10+ years of experience in helping athletes find the perfect equipment for their needs.",
                  image: "/team-3.jpg"
                }
              ].map((member, index) => (
                <motion.div 
                  key={index}
                  className={cn(
                    "p-6 rounded-lg text-center",
                    isDark ? "bg-slate-800" : "bg-white shadow-md"
                  )}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://placehold.co/200x200/222/fff?text=${member.name.split(' ')[0][0]}${member.name.split(' ')[1][0]}`;
                      }}
                    />
                  </div>
                  <h3 className={cn(
                    "text-xl font-bold",
                    isDark ? "text-white" : "text-slate-900"
                  )}>
                    {member.name}
                  </h3>
                  <p className="text-mangla-gold font-medium mb-2">{member.position}</p>
                  <p className={cn(
                    isDark ? "text-gray-400" : "text-slate-600"
                  )}>
                    {member.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default About;
