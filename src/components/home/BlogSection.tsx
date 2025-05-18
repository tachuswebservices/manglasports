import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeProvider';
import { CalendarDays, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Ultimate Guide to Competitive Shooting Gear",
    excerpt: "Discover the essential equipment you need to get started in competitive shooting sports.",
    image: "/lovable-uploads/blog-1.jpg",
    category: "Guides",
    date: "May 15, 2025",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Maintaining Your Air Rifle: A Complete Guide",
    excerpt: "Learn the best practices for keeping your air rifle in top condition for peak performance.",
    image: "/lovable-uploads/blog-2.jpg",
    category: "Maintenance",
    date: "April 28, 2025",
    readTime: "7 min read"
  },
  {
    id: 3,
    title: "Top 5 Air Pistols for Beginners in 2025",
    excerpt: "Our expert picks for the best air pistols for those new to the sport.",
    image: "/lovable-uploads/blog-3.jpg",
    category: "Reviews",
    date: "April 10, 2025",
    readTime: "4 min read"
  }
];

const BlogSection = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section id="blog" className={`py-16 ${isDark ? 'bg-mangla' : 'bg-slate-50'}`}>
      <div className="container-custom">
        <motion.div 
          className="text-center mb-12"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`section-title ${isDark ? 'text-white' : 'text-slate-900'}`}>Latest Articles</h2>
          <motion.div 
            className="w-20 h-1 bg-mangla-gold mx-auto mt-2 mb-6"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 80, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <p className={`max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
            Stay updated with the latest news, tips, and guides from the world of shooting sports.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {blogPosts.map((post) => (
            <motion.article 
              key={post.id}
              variants={item}
              className={`group overflow-hidden rounded-lg ${isDark ? 'bg-mangla-dark-gray' : 'bg-white'} border ${isDark ? 'border-gray-800' : 'border-gray-200'} hover:shadow-lg transition-shadow duration-300 h-full flex flex-col`}
            >
              <div className="overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center mb-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${isDark ? 'bg-mangla-gold/10 text-mangla-gold' : 'bg-blue-100 text-blue-800'}`}>
                    {post.category}
                  </span>
                  <div className="flex items-center ml-4 text-xs text-gray-500">
                    <CalendarDays className="w-3.5 h-3.5 mr-1" />
                    {post.date}
                  </div>
                </div>
                <h3 className={`text-xl font-semibold mb-2 group-hover:text-mangla-gold transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {post.title}
                </h3>
                <p className={`mb-4 flex-grow ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                  {post.excerpt}
                </p>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {post.readTime}
                  </div>
                  <Link 
                    to={`/blog/${post.id}`} 
                    className="inline-flex items-center text-sm font-medium text-mangla-gold hover:text-yellow-500 transition-colors"
                  >
                    Read more <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link 
            to="/blog"
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md ${isDark ? 'bg-mangla-gold text-mangla-dark-gray hover:bg-yellow-500' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-colors`}
          >
            View All Articles
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

export default BlogSection;
