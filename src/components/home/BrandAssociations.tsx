
import React, { useEffect } from 'react';

const logos = [
  "https://via.placeholder.com/200x100/1A1A1A/FFFFFF?text=Brand+1",
  "https://via.placeholder.com/200x100/1A1A1A/FFFFFF?text=Brand+2",
  "https://via.placeholder.com/200x100/1A1A1A/FFFFFF?text=Brand+3",
  "https://via.placeholder.com/200x100/1A1A1A/FFFFFF?text=Brand+4",
  "https://via.placeholder.com/200x100/1A1A1A/FFFFFF?text=Brand+5",
  "https://via.placeholder.com/200x100/1A1A1A/FFFFFF?text=Brand+6"
];

const BrandAssociations = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.reveal-animation');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section className="py-16 bg-mangla-dark-gray">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center reveal-animation">Featuring Premier Brands</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {logos.map((logo, index) => (
            <div 
              key={index}
              className="reveal-animation flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img 
                src={logo} 
                alt={`Partner brand ${index + 1}`} 
                className="max-h-12"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandAssociations;
