import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'The Evolution of Air Rifles: From Past to Present',
      excerpt: 'Explore the fascinating journey of air rifles from their inception to modern precision instruments.',
      category: 'Air Guns',
      date: 'May 15, 2025',
      readTime: '6 min read',
      image: '/images/blog/air-rifle-evolution.jpg'
    },
    {
      id: 2,
      title: '5 Essential Accessories for Competitive Shooting',
      excerpt: 'Discover the must-have accessories that can give you an edge in competitive shooting sports.',
      category: 'Shooting Sports',
      date: 'May 8, 2025',
      readTime: '8 min read',
      image: '/images/blog/shooting-accessories.jpg'
    },
    {
      id: 3,
      title: 'Maintaining Your Firearm: A Complete Guide',
      excerpt: 'Learn the proper techniques to clean, maintain, and store your firearms for optimal performance and longevity.',
      category: 'Maintenance',
      date: 'April 30, 2025',
      readTime: '10 min read',
      image: '/images/blog/firearm-maintenance.jpg'
    },
    {
      id: 4,
      title: 'The Science of Ballistics: Understanding Bullet Trajectory',
      excerpt: 'Dive into the physics behind bullet trajectory and how it affects your shooting accuracy.',
      category: 'Ballistics',
      date: 'April 22, 2025',
      readTime: '12 min read',
      image: '/images/blog/ballistics-science.jpg'
    },
    {
      id: 5,
      title: 'Choosing the Right Air Pistol for Beginners',
      excerpt: 'A comprehensive guide to help beginners select their first air pistol based on skill level and purpose.',
      category: 'Air Guns',
      date: 'April 15, 2025',
      readTime: '7 min read',
      image: '/images/blog/air-pistol-guide.jpg'
    },
    {
      id: 6,
      title: 'The Mental Game: Developing Focus for Competitive Shooting',
      excerpt: 'Learn mental strategies used by professional shooters to maintain focus and composure during competitions.',
      category: 'Training',
      date: 'April 5, 2025',
      readTime: '9 min read',
      image: '/images/blog/mental-game.jpg'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <nav className="flex justify-center mb-6">
              <Link 
                to="/" 
                className="inline-flex items-center text-mangla-gold hover:text-mangla-gold-dark transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back to Home
              </Link>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Latest Articles & News
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Stay updated with the latest news, tips, and insights from the world of shooting sports and outdoor activities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <motion.article 
                key={post.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div className="relative w-full h-full overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder-blog.jpg';
                      }}
                      onLoad={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.opacity = '1';
                      }}
                      style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
                    />
                    <div className="absolute top-3 left-3 z-10">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full bg-mangla-gold/90 text-white`}>
                        {post.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-end mb-3">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      {post.date}
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime}
                    </div>
                    <Link 
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center text-mangla-gold hover:text-mangla-gold-dark font-medium transition-colors"
                    >
                      Read more
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="px-6 py-3 border border-mangla-gold text-mangla-gold rounded-md hover:bg-mangla-gold hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mangla-gold">
              Load More Articles
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
