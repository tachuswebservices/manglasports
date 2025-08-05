import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, ArrowRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  readTime: number;
  views: number;
  isFeatured: boolean;
  publishedAt?: string;
  createdAt: string;
  authorName?: string;
  _count: {
    comments: number;
  };
}

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/blog/posts?status=published');
        if (!response.ok) throw new Error('Failed to fetch blog posts');
        
        const data = await response.json();
        setBlogPosts(data.posts);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mangla-gold mx-auto"></div>
              <p className="mt-2 text-slate-600">Loading blog posts...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-12">{error}</div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600">No blog posts found</p>
            </div>
          ) : (
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
                      {post.featuredImage ? (
                        <img 
                          src={post.featuredImage} 
                          alt={post.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                          onLoad={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.opacity = '1';
                          }}
                          style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
                        />
                      ) : (
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-mangla-gold/20 to-mangla-blue/20 flex items-center justify-center">
                          <span className="text-mangla-gold font-semibold">No Image</span>
                        </div>
                      )}
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
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
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
                        {post.readTime} min read
                      </div>
                      <Link 
                        to={`/blog/${post.slug}`}
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
          )}

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
