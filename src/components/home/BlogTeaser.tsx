
import React, { useEffect } from 'react';

interface BlogPostProps {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
}

const blogPosts: BlogPostProps[] = [
  {
    title: "The Future of Sport Shooting in India",
    excerpt: "An in-depth analysis of how the shooting sports landscape in India is evolving and what to expect in the coming years.",
    image: "https://images.unsplash.com/photo-1553043724-b9bede3e3031?q=80&w=1000&auto=format&fit=crop",
    date: "May 5, 2025",
    author: "Ravi Sharma"
  },
  {
    title: "Choosing Your First Precision Rifle",
    excerpt: "Essential considerations and expert recommendations for beginners looking to invest in their first precision rifle.",
    image: "https://images.unsplash.com/photo-1576669802218-77ef1134af57?q=80&w=1000&auto=format&fit=crop",
    date: "May 1, 2025",
    author: "Neha Gupta"
  }
];

const BlogPostCard: React.FC<BlogPostProps> = ({ title, excerpt, image, date, author }) => {
  return (
    <div className="reveal-animation bg-mangla-dark-gray rounded-lg overflow-hidden border border-gray-800 group">
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center text-sm text-mangla-light-gray mb-4">
          <span>{date}</span>
          <span>By {author}</span>
        </div>
        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-mangla-gold transition-colors">{title}</h3>
        <p className="text-gray-400 mb-4">{excerpt}</p>
        <a 
          href="#" 
          className="text-mangla-gold flex items-center font-medium group-hover:translate-x-2 transition-transform"
        >
          Read More
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

const BlogTeaser = () => {
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
        <h2 className="section-title text-center reveal-animation">Insights from the Range</h2>
        <div className="w-20 h-1 bg-mangla-gold mx-auto mb-8 reveal-animation"></div>
        <p className="section-subtitle text-center reveal-animation">
          Stay informed with the latest news, expert advice, and insights from the world of shooting sports.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {blogPosts.map((post, index) => (
            <BlogPostCard 
              key={index} 
              title={post.title} 
              excerpt={post.excerpt}
              image={post.image}
              date={post.date}
              author={post.author}
            />
          ))}
        </div>
        
        <div className="text-center mt-12 reveal-animation">
          <button className="btn-secondary">
            View All Articles
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogTeaser;
