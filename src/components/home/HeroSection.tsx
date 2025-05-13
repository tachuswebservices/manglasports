
import React, { useEffect } from 'react';

const HeroSection = () => {
  // Function to handle animation on page load
  useEffect(() => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Add animation classes with slight delay between elements
    animatedElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animate-fade-up');
      }, 200 * (index + 1));
    });
  }, []);
  
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-mangla bg-fixed overflow-hidden pt-16">
      {/* Background overlay & image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-mangla to-black opacity-70 z-10"></div>
        <div 
          className="absolute inset-0 bg-center bg-cover z-0" 
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1530424272458-06235f040299?q=80&w=2070&auto=format&fit=crop')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        ></div>
      </div>

      <div className="container-custom relative z-20 text-center py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="animate-on-scroll opacity-0 text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Mangla Sports: <br />
            <span className="text-mangla-gold">Precision. Performance. Passion</span>
          </h1>
          
          <p className="animate-on-scroll opacity-0 text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-300">
            India's premier destination for elite shooting sports equipment, expertise and guidance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-on-scroll opacity-0">
            <button className="btn-primary text-base md:text-lg">
              Explore Our Elite Collection
            </button>
            <button className="btn-secondary text-base md:text-lg">
              Learn About Our Legacy
            </button>
          </div>
          
          <p className="animate-on-scroll opacity-0 mt-8 text-mangla-gold italic">
            Trusted by India's Elite Shooters
          </p>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20 hidden md:block">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-mangla-gold">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
