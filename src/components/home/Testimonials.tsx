
import React, { useEffect } from 'react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
}

const testimonials: TestimonialProps[] = [
  {
    quote: "The expertise and quality of equipment provided by Mangla Sports has dramatically improved my competition performance. Their guidance was invaluable in selecting the perfect setup for my needs.",
    author: "Rajesh Kumar",
    role: "National Level Competitor"
  },
  {
    quote: "As a shooting coach, I've found Mangla Sports to be an invaluable resource. Their knowledge, selection of premium equipment, and commitment to the sport is unmatched in the Indian market.",
    author: "Priya Singh",
    role: "Professional Shooting Coach"
  },
  {
    quote: "When I decided to pursue shooting sports professionally, Mangla Sports provided exceptional guidance. Their equipment recommendations and ongoing support have been crucial to my development.",
    author: "Amit Patel",
    role: "Olympic Hopeful"
  }
];

const TestimonialCard: React.FC<TestimonialProps> = ({ quote, author, role }) => {
  return (
    <div className="reveal-animation bg-mangla-dark-gray p-8 rounded-lg border border-gray-800 relative">
      <div className="absolute -top-5 -left-2 text-mangla-gold text-6xl opacity-30">"</div>
      <p className="italic text-gray-300 mb-6 relative z-10">{quote}</p>
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-mangla-gold flex items-center justify-center text-mangla-dark-gray font-bold text-xl">
          {author.charAt(0)}
        </div>
        <div className="ml-4">
          <p className="font-medium text-white">{author}</p>
          <p className="text-mangla-gold text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
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
        <h2 className="section-title text-center reveal-animation">What Our Clients Say</h2>
        <div className="w-20 h-1 bg-mangla-gold mx-auto mb-8 reveal-animation"></div>
        <p className="section-subtitle text-center reveal-animation">
          Hear from the shooting sports community about their experience with Mangla Sports.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index} 
              quote={testimonial.quote} 
              author={testimonial.author}
              role={testimonial.role}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
