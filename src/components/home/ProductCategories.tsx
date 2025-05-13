
import React, { useEffect } from 'react';

interface CategoryProps {
  title: string;
  icon: string;
  description: string;
}

const categories: CategoryProps[] = [
  {
    title: "Precision Rifles",
    icon: "https://images.unsplash.com/photo-1584178668396-37ae4e4bbb2b?q=80&w=1000&auto=format&fit=crop",
    description: "Elite selection of competition-grade precision rifles for target shooting and sport."
  },
  {
    title: "Performance Handguns",
    icon: "https://images.unsplash.com/photo-1584178045080-cffef477173a?q=80&w=1000&auto=format&fit=crop",
    description: "Competition-ready handguns designed for precision, reliability, and performance."
  },
  {
    title: "Advanced Optics",
    icon: "https://images.unsplash.com/photo-1617124074721-767bc360aafc?q=80&w=1000&auto=format&fit=crop",
    description: "Premium scopes and sights for unparalleled accuracy and clarity in any condition."
  },
  {
    title: "Essential Accessories",
    icon: "https://images.unsplash.com/photo-1585589266883-32e9457ec269?q=80&w=1000&auto=format&fit=crop",
    description: "Professional-grade accessories to enhance your shooting experience and performance."
  }
];

const CategoryCard: React.FC<CategoryProps> = ({ title, icon, description }) => {
  return (
    <div className="reveal-animation bg-mangla-dark-gray rounded-lg overflow-hidden border border-gray-800 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-mangla-gold group">
      <div className="h-48 overflow-hidden">
        <img 
          src={icon} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-mangla-gold transition-colors">{title}</h3>
        <p className="text-gray-400 mb-4">{description}</p>
        <a 
          href="#" 
          className="text-mangla-gold flex items-center font-medium group-hover:translate-x-2 transition-transform"
        >
          Explore {title}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 ml-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M14 5l7 7m0 0l-7 7m7-7H3" 
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

const ProductCategories = () => {
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
    <section className="section-padding bg-mangla">
      <div className="container-custom">
        <h2 className="section-title text-center reveal-animation">Featured Collections</h2>
        <div className="w-20 h-1 bg-mangla-gold mx-auto mb-8 reveal-animation"></div>
        <p className="section-subtitle text-center reveal-animation">
          Explore our curated selection of premium shooting sports equipment, designed for champions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {categories.map((category, index) => (
            <CategoryCard 
              key={index} 
              title={category.title} 
              icon={category.icon} 
              description={category.description}
            />
          ))}
        </div>
        
        <div className="text-center mt-12 reveal-animation">
          <button className="btn-secondary">
            View All Product Ranges
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
