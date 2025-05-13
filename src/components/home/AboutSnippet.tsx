
import React, { useEffect } from 'react';

const AboutSnippet = () => {
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
    <section className="section-padding bg-gradient-to-b from-mangla to-mangla-dark-gray">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-title reveal-animation">About Mangla Sports</h2>
          <div className="w-20 h-1 bg-mangla-gold mx-auto mb-8 reveal-animation"></div>
          
          <p className="reveal-animation text-xl mb-8 leading-relaxed">
            Established with a vision to elevate the shooting sports experience in India, 
            Mangla Sports represents the pinnacle of quality, expertise, and passion. 
            We curate only the finest equipment, backed by decades of collective experience 
            and an unwavering commitment to the shooting community.
          </p>
          
          <a href="#" className="reveal-animation inline-block text-mangla-gold hover:text-white border-b border-mangla-gold hover:border-white transition-colors duration-300 text-lg font-medium">
            Discover Our Story
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutSnippet;
