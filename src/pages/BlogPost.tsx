import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Tag, ArrowLeft, Share2, Bookmark, Eye, Clock, ChevronLeft } from 'lucide-react';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import { useTheme } from '../components/theme/ThemeProvider';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/use-toast';
import { buildApiUrl, buildApiUrlWithParams, API_CONFIG } from '../config/api';

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

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Fetch blog post data
  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!slug) return;
      
      setLoading(true);
      setError('');
      
      try {
        const response = await fetch(buildApiUrl(API_CONFIG.BLOG.POST_BY_SLUG(slug)));
        if (!response.ok) {
          if (response.status === 404) {
            setError('Blog post not found');
          } else {
            throw new Error('Failed to fetch blog post');
          }
          return;
        }
        
        const data = await response.json();
        setPost(data);
        
        // Fetch related posts
        if (data.category) {
          const relatedResponse = await fetch(buildApiUrlWithParams(API_CONFIG.BLOG.POSTS, { 
            category: data.category, 
            limit: '3' 
          }));
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            setRelatedPosts(relatedData.posts.filter((post: any) => post.slug !== slug));
          }
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* No Navbar on blog post pages */}
        <main className="flex-grow pt-8 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-8"></div>
              <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* No Navbar on blog post pages */}
        <main className="flex-grow pt-8 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              {error || 'Blog post not found'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild className="relative z-10">
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* No Navbar on blog post pages */}
      
      <main className="flex-grow pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto relative">
                     {/* Fixed Back Button */}
           <div className="fixed top-4 left-4 z-[60]">
             <Link 
               to="/blog" 
               className="inline-flex items-center text-mangla-gold hover:text-mangla-gold-dark transition-colors bg-white dark:bg-slate-900 px-3 py-2 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all backdrop-blur-sm"
             >
               <ChevronLeft className="w-5 h-5 mr-1" />
               Back to Blog
             </Link>
           </div>

                     {/* Breadcrumb */}
           <nav className="flex items-center mb-8">
             <div className="h-16"></div> {/* Spacer for fixed button */}
           </nav>

          {/* Blog Post Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                <span className="px-3 py-1 bg-mangla-gold/10 text-mangla-gold rounded-full">
                  {post.category}
                </span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.publishedAt || post.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime} min read
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.views} views
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {post.title}
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                {post.excerpt}
              </p>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-slate-500" />
                  <span className="text-slate-600 dark:text-slate-400">
                    By {post.authorName || 'Unknown Author'}
                  </span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="mb-8">
                <img 
                  src={post.featuredImage} 
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                {post.content}
              </div>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Related Posts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <Link 
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="group block"
                  >
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      {relatedPost.featuredImage && (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={relatedPost.featuredImage} 
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-mangla-gold transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>{formatDate(relatedPost.createdAt)}</span>
                          <span>{relatedPost.readTime} min read</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost; 