import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Navigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '../components/theme/ThemeProvider';
import ProductsSidebar, { ProductFilters } from '../components/products/ProductsSidebar';
import StockIndicator from '../components/products/StockIndicator';
import PageLayout from '../components/layout/PageLayout';

// Define product type
interface ProductDetails {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  category: string;
  brand: string;
  isNew: boolean;
  isOnSale: boolean;
  shortDescription?: string;
  stockLevel?: 'high' | 'medium' | 'low' | 'out-of-stock';
}

// Mock product data - will be replaced with API call
const mockProducts: ProductDetails[] = [
  {
    id: 'air-rifle-1',
    name: 'Precision Air Rifle Pro X',
    price: 45999,
    originalPrice: 52999,
    image: '/placeholder-rifle-1.jpg',
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    category: 'air-rifles',
    brand: 'Precision Pro',
    isNew: true,
    isOnSale: true,
    shortDescription: 'Professional grade air rifle with precision barrel and advanced recoil reduction system.',
    stockLevel: 'medium'
  },
  {
    id: 'air-rifle-2',
    name: 'Olympic Target Air Rifle',
    price: 68999,
    originalPrice: 75999,
    image: '/placeholder-rifle-2.jpg',
    rating: 4.9,
    reviewCount: 87,
    inStock: true,
    category: 'air-rifles',
    brand: 'Olympic Arms',
    isNew: false,
    isOnSale: true,
    shortDescription: 'Competition ready Olympic-grade air rifle with advanced sighting system and ergonomic design.',
    stockLevel: 'high'
  },
  {
    id: 'air-pistol-1',
    name: 'Competition Air Pistol Elite',
    price: 38999,
    image: '/placeholder-pistol-1.jpg',
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    category: 'air-pistols',
    brand: 'Precision Pro',
    isNew: true,
    isOnSale: false,
    shortDescription: 'Elite competition air pistol featuring precision engineering and tournament-grade materials.',
    stockLevel: 'low'
  },
  {
    id: 'co2-pistol-1',
    name: 'CO2 Target Pistol Pro',
    price: 28999,
    originalPrice: 32999,
    image: '/placeholder-co2-1.jpg',
    rating: 4.5,
    reviewCount: 92,
    inStock: false,
    category: 'co2-pistols',
    brand: 'Target Master',
    isNew: false,
    isOnSale: true,
    shortDescription: 'Professional CO2 pistol with adjustable trigger and advanced balance system.',
    stockLevel: 'out-of-stock'
  },
  {
    id: 'pellets-1',
    name: 'Match Grade Air Pellets (500)',
    price: 1299,
    image: '/placeholder-pellets-1.jpg',
    rating: 4.8,
    reviewCount: 342,
    inStock: true,
    category: 'air-pellets',
    brand: 'Precision Pro',
    isNew: false,
    isOnSale: false,
    shortDescription: 'Match-grade competition pellets for superior accuracy and consistent flight path.',
    stockLevel: 'high'
  }
];

// Define collection type
interface Collection {
  title: string;
  slug: string;
  description: string;
  emoji: string; // Made emoji required since all our collections have it
}

// Define all collections - ensure consistency between links and what's used in the URLs
const allCollections: Collection[] = [
  { 
    title: "Air Rifles", 
    slug: "air-rifles", 
    description: "High-precision air rifles for target shooting and competition",
    emoji: "🎯"
  },
  { 
    title: "Air Pistols", 
    slug: "air-pistols", 
    description: "Competition-grade air pistols for precision shooting",
    emoji: "🔫"
  },
  { 
    title: "CO2 Pistols", 
    slug: "co2-pistols", 
    description: "Powerful CO2 powered pistols for training and competition",
    emoji: "💨"
  },
  { 
    title: "Air Pellets", 
    slug: "air-pellets", 
    description: "High-quality pellets for all types of air guns",
    emoji: "⚡"
  },
  { 
    title: "Spares", 
    slug: "spares", 
    description: "Replacement parts and accessories for your equipment",
    emoji: "🔧"
  },
  { 
    title: "Air Rifle Accessories", 
    slug: "air-rifle-accessories", 
    description: "Enhance your air rifle with our premium accessories",
    emoji: "🎯"
  },
  { 
    title: "Air Pistol Accessories", 
    slug: "air-pistol-accessories", 
    description: "Upgrade your air pistol with our selection of accessories",
    emoji: "🔫"
  },
  { 
    title: "Manual Target Systems", 
    slug: "manual-target-systems", 
    description: "Traditional target systems for training and competition",
    emoji: "🎯"
  },
  { 
    title: "Electronic Target Systems", 
    slug: "electronic-target-systems", 
    description: "Advanced electronic scoring systems for precision shooting",
    emoji: "📊"
  },
  { 
    title: "Scatt Training Systems", 
    slug: "scatt-training-systems", 
    description: "Professional training systems to improve your shooting technique",
    emoji: "🎯"
  },
  { 
    title: "Consumables", 
    slug: "consumables", 
    description: "Essential consumables for your shooting needs",
    emoji: "🧰"
  }
];

interface ProductCardProps extends ProductDetails {}

const ProductCard: React.FC<ProductCardProps> = (product) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className={cn(
        "group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300",
        isDark ? "bg-mangla-dark-gray border border-gray-800" : "bg-white border border-gray-200"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/products/product/${product.id}`} className="block">
        <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
          <div className="relative w-full h-full">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-contain p-4 transition-transform duration-300"
              style={{
                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
              }}
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              {product.isNew && (
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                  New
                </span>
              )}
              {product.isOnSale && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Sale
                </span>
              )}
            </div>
            
            {!product.inStock && (
              <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                Out of Stock
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 h-12">
              {product.name}
            </h3>
            <button 
              className="text-gray-400 hover:text-red-500 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Add to wishlist logic
              }}
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={cn(
                    "w-4 h-4",
                    star <= Math.floor(product.rating) 
                      ? "fill-mangla-gold text-mangla-gold" 
                      : isDark 
                        ? "text-gray-700" 
                        : "text-gray-300"
                  )} 
                />
              ))}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                ({product.reviewCount})
              </span>
            </div>
          </div>
          
          <div className="flex items-baseline">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
            {product.originalPrice && (
              <span className="ml-2 text-xs font-medium text-green-600 dark:text-green-400">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>
          
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {product.brand}
          </div>
          <div className="mt-2">
            <StockIndicator 
              level={product.stockLevel === 'high' ? 'high' : 
                     product.stockLevel === 'medium' ? 'medium' : 
                     product.stockLevel === 'low' ? 'low' : 'out-of-stock'} 
              compact 
            />
          </div>
        </div>
      </Link>
      
      <div className="px-4 pb-4">
        <Button 
          variant={product.inStock ? "default" : "secondary"}
          className={cn(
            "w-full py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2",
            product.inStock 
              ? "bg-mangla-gold hover:bg-mangla-gold/90 text-slate-900"
              : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          )}
          disabled={!product.inStock}
          onClick={(e) => {
            if (!product.inStock) return;
            e.preventDefault();
            // Add to cart logic
          }}
        >
          {product.inStock ? (
            <>
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </>
          ) : (
            'Out of Stock'
          )}
        </Button>
      </div>
      
      {/* View Details hover overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button 
            variant="outline" 
            className="bg-white text-slate-900 hover:bg-white/90"
            asChild
          >
            <Link to={`/products/product/${product.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      )}
    </motion.div>
  );
};

// Define product type
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  category: string;
  brand: string;
  isNew: boolean;
  isOnSale: boolean;
}

// Get unique brands from mock products
const allBrands = [...new Set(mockProducts.map(product => product.brand))].sort();

// Sort options
type SortOption = {
  label: string;
  value: string;
  sortFn: (a: Product, b: Product) => number;
};

const sortOptions: SortOption[] = [
  { 
    label: 'Featured', 
    value: 'featured', 
    sortFn: () => 0 // No sorting (default order)
  },
  { 
    label: 'Price: Low to High', 
    value: 'price-asc', 
    sortFn: (a, b) => a.price - b.price
  },
  { 
    label: 'Price: High to Low', 
    value: 'price-desc', 
    sortFn: (a, b) => b.price - a.price 
  },
  { 
    label: 'Rating', 
    value: 'rating', 
    sortFn: (a, b) => b.rating - a.rating
  },
  { 
    label: 'Newest', 
    value: 'newest', 
    sortFn: (a, b) => (a.isNew === b.isNew) ? 0 : a.isNew ? -1 : 1
  },
  { 
    label: 'Name: A-Z', 
    value: 'name-asc', 
    sortFn: (a, b) => a.name.localeCompare(b.name)
  },
  { 
    label: 'Name: Z-A', 
    value: 'name-desc', 
    sortFn: (a, b) => b.name.localeCompare(a.name)
  }
];

const ProductsPage: React.FC = () => {
  return (
    <PageLayout>
      <ProductsContent />
    </PageLayout>
  );
};

const ProductsContent: React.FC = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // Get max price for the range slider
  const maxPrice = useMemo(() => {
    const prices = mockProducts.map(p => p.price);
    return Math.ceil(Math.max(...prices, 0) / 1000) * 1000; // Round up to nearest thousand
  }, []);
  
  // Filter state initialization
  const [filters, setFilters] = useState<ProductFilters>({
    priceRange: [0, maxPrice],
    categories: category ? [category] : [],
    brands: [],
    availability: [],
    ratings: [],
    onSale: false
  });
  
  // Sort state
  const [sortBy, setSortBy] = useState<string>('featured');
  
  // Sync filters with URL params when category changes
  useEffect(() => {
    if (category) {
      setFilters(prev => ({
        ...prev,
        categories: [category]
      }));
    }
  }, [category]);
  
  // Scroll to top when category changes
  useEffect(() => {
    window.scrollTo(0, 0);
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [category]);
  
  // Get current category details
  const currentCategory = allCollections.find(c => c.slug === category);
  
  // Apply filters to products
  const filteredProducts = useMemo(() => {
    let filtered = category
      ? mockProducts.filter(p => p.category === category)
      : mockProducts;
    
    // Apply price filter
    filtered = filtered.filter(p => {
      return p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];
    });
    
    // Apply category filter (if not using URL param)
    if (!category && filters.categories.length > 0) {
      filtered = filtered.filter(p => filters.categories.includes(p.category));
    }
    
    // Apply brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter(p => filters.brands.includes(p.brand));
    }
    
    // Apply availability filter
    if (filters.availability.length > 0) {
      filtered = filtered.filter(p => {
        if (filters.availability.includes('in-stock') && p.inStock) return true;
        if (filters.availability.includes('out-of-stock') && !p.inStock) return true;
        return false;
      });
    }
    
    // Apply ratings filter
    if (filters.ratings.length > 0) {
      filtered = filtered.filter(p => {
        return filters.ratings.some(rating => p.rating >= rating);
      });
    }
    
    // Apply on-sale filter
    if (filters.onSale) {
      filtered = filtered.filter(p => p.isOnSale);
    }
    
    // Apply sorting
    const sortOption = sortOptions.find(option => option.value === sortBy);
    if (sortOption) {
      filtered = [...filtered].sort(sortOption.sortFn);
    }
    
    return filtered;
  }, [category, filters, sortBy]);
  
  // Handle filter change
  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };
  
  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({
      priceRange: [0, maxPrice],
      categories: category ? [category] : [],
      brands: [],
      availability: [],
      ratings: [],
      onSale: false
    });
    setSortBy('featured');
  };
  
  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };
  
  // Toggle mobile filters
  const toggleMobileFilters = () => {
    setIsMobileFiltersOpen(!isMobileFiltersOpen);
  };
  
  // If category is not valid, redirect to the products page
  if (category && !currentCategory) {
    return <Navigate to="/products" replace />;
  }
  
  // Set page title
  useEffect(() => {
    document.title = currentCategory 
      ? `Mangla Sports - ${currentCategory.title}`
      : "Mangla Sports - All Products";
  }, [currentCategory]);

  // If viewing all collections (no category selected)
  if (!category) {
    return (
      <PageLayout>
        <motion.div 
          className={cn(
            "min-h-screen",
            isDark ? "bg-mangla" : "bg-slate-50"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
        <div className="px-4 sm:px-6 pt-32 pb-16 md:pt-36 md:pb-20 max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <h1 className={cn(
              "text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8",
              isDark ? "text-white" : "text-slate-900"
            )}>
              All Collections
            </h1>
            <p className={cn(
              "max-w-3xl mb-10",
              isDark ? "text-gray-300" : "text-slate-700"
            )}>
              Browse our complete range of collections designed for precision shooting enthusiasts and professionals
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allCollections.map((collection) => (
              <Link 
                key={collection.slug} 
                to={`/products/${collection.slug}`}
                className="block group"
              >
                <motion.div 
                  className={cn(
                    "h-full rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300",
                    isDark ? "bg-mangla-dark-gray border border-gray-800" : "bg-white border border-gray-200"
                  )}
                  whileHover={{ y: -5 }}
                >
                  <div className="h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-6">
                    <div className="text-4xl text-gray-400">
                      {collection.emoji || '🎯'} {/* Fallback emoji */}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {collection.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {collection.description}
                    </p>
                    <div className="mt-4 text-sm font-medium text-mangla-gold group-hover:underline">
                      View Collection →
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
      </PageLayout>
    );
  }

  // Category view with products
  return (
    <PageLayout>
      <div className="container mx-auto px-4 pt-16 pb-12">
        {/* Breadcrumb and Title Section */}
        <div className="mb-10">
          <motion.nav 
            className="flex mb-2 mt-6" 
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
              {currentCategory && (
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <span className={cn(
                      "ml-1 text-sm font-medium md:ml-2",
                      isDark ? "text-mangla-gold" : "text-amber-600"
                    )}>
                      {currentCategory.title}
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
              {currentCategory?.title || 'All Products'}
            </h1>
            {currentCategory?.description && (
              <p className={cn(
                "text-sm md:text-base mb-3",
                isDark ? "text-gray-300" : "text-gray-600"
              )}>
                {currentCategory.description}
              </p>
            )}
            {filteredProducts.length > 0 && (
              <div className={cn(
                "text-sm py-1 px-2 rounded-full inline-flex items-center",
                isDark ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-700"
              )}>
                <span className="font-medium">{filteredProducts.length}</span>
                <span className="ml-1">{filteredProducts.length === 1 ? 'product' : 'products'} found</span>
              </div>
            )}
          </motion.div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-1/4 lg:w-1/5">
            <div className="sticky top-24">
              {/* Mobile filter button - only visible on small screens */}
              <div className="md:hidden mb-4">
                <Button 
                  onClick={toggleMobileFilters}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
                </Button>
              </div>
              
              {/* Responsive sidebar - always visible on desktop, toggleable on mobile */}
              <div className={cn(
                "transition-all duration-300",
                isMobileFiltersOpen ? "block" : "hidden md:block"
              )}>
                <ProductsSidebar 
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  allCategories={category ? [] : allCollections.map(c => ({ slug: c.slug, title: c.title }))} // Hide categories when viewing a specific category
                  allBrands={allBrands}
                  maxPrice={maxPrice}
                  hideCategories={!!category} // Pass a flag to hide the categories section completely
                />
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
                <select 
                  className={cn(
                    "bg-transparent rounded-md border px-2 py-1 text-sm focus:ring-1 focus:ring-amber-500",
                    isDark ? "text-white border-gray-700" : "text-gray-900 border-gray-300"
                  )}
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-800 rounded-lg aspect-square"></div>
                    <div className="mt-3 h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                    <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                    <div className="mt-2 h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                  </div>
                ))
              ) : filteredProducts.length > 0 ? (
                // Products grid
                filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    {...product} 
                  />
                ))
              ) : (
                // No products found
                <div className="col-span-full text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">No products found</h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    We couldn't find any products in this category. Please check back later.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => window.history.back()}
                  >
                    Go back
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProductsPage;
