import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '../theme/ThemeProvider';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

interface ProductsLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  title: string;
  description?: string;
  productCount?: number;
  sortComponent?: React.ReactNode;
}

const ProductsLayout: React.FC<ProductsLayoutProps> = ({
  children,
  sidebar,
  title,
  description,
  productCount,
  sortComponent
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetch('https://manglasportsbackend.onrender.com/api/categories')
      .then(res => res.json())
      .then(setCategories);
    fetch('https://manglasportsbackend.onrender.com/api/brands')
      .then(res => res.json())
      .then(setBrands);
  }, []);

  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900"
    )}>
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 pt-24 pb-12">
          {/* Breadcrumb and Title Section */}
          <div className="mb-10">
            <motion.nav 
              className="flex mb-2" 
              aria-label="Breadcrumb"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <Link to="/" className={cn(
                    "inline-flex items-center text-sm font-medium", 
                    isDark ? "text-gray-300 hover:text-mangla-gold" : "text-gray-600 hover:text-amber-600"
                  )}>
                    <svg className="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L4 10.414V17a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-6.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                    </svg>
                    Home
                  </Link>
                </li>
                <li className="inline-flex items-center">
                  <Link to="/products" className={cn(
                    "inline-flex items-center text-sm font-medium", 
                    isDark ? "text-gray-300 hover:text-mangla-gold" : "text-gray-600 hover:text-amber-600"
                  )}>
                    <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <span className="ml-1">Products</span>
                  </Link>
                </li>
                {title !== 'Products' && (
                  <li aria-current="page">
                    <div className="flex items-center">
                      <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                      </svg>
                      <span className={cn(
                        "ml-1 text-sm font-medium md:ml-2",
                        isDark ? "text-mangla-gold" : "text-amber-600"
                      )}>
                        {title}
                      </span>
                    </div>
                  </li>
                )}
              </ol>
            </motion.nav>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className={cn(
                "text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2",
                isDark ? "text-white" : "text-slate-900"
              )}>
                {title}
              </h1>
              {description && (
                <p className={cn(
                  "text-sm md:text-base mb-3",
                  isDark ? "text-gray-300" : "text-gray-600"
                )}>
                  {description}
                </p>
              )}
              {productCount !== undefined && (
                <div className={cn(
                  "text-sm py-1 px-2 rounded-full inline-flex items-center",
                  isDark ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-700"
                )}>
                  <span className="font-medium">{productCount}</span>
                  <span className="ml-1">{productCount === 1 ? 'product' : 'products'} found</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full md:w-1/4 lg:w-1/5">
              <div className="sticky top-24">
                {sidebar}
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {productCount || 0} {productCount === 1 ? 'product' : 'products'}
                </div>
                {sortComponent ? (
                  sortComponent
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
                    <select 
                      className={cn(
                        "bg-transparent rounded-md border px-2 py-1 text-sm",
                        isDark ? "text-white border-gray-700" : "text-gray-900 border-gray-300"
                      )}
                      disabled
                    >
                      <option>Featured</option>
                    </select>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsLayout;
