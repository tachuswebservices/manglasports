import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Navigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, SlidersHorizontal, HeartOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatIndianPrice } from '@/lib/utils';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import ProductsSidebar, { ProductFilters } from '../components/products/ProductsSidebar';
import StockIndicator from '../components/products/StockIndicator';
import PageLayout from '../components/layout/PageLayout';
import { Product, products, getAllCategories, getAllBrands, getMaxPrice } from '../data/products';

// Define collection type
interface Collection {
  title: string;
  slug: string;
  description: string;
  emoji: string;
}

// Define all required collections even if some don't have products yet
const allCollections: Collection[] = [
  { 
    title: "Air Rifles", 
    slug: "air-rifles",
    description: "Premium quality air rifles for professional shooters and enthusiasts.",
    emoji: "🎯"
  },
  { 
    title: "Air Pistols", 
    slug: "air-pistols",
    description: "Competition-grade air pistols for precision target shooting.",
    emoji: "🔫"
  },
  { 
    title: "CO2 Pistols", 
    slug: "co2-pistols",
    description: "Reliable CO2-powered pistols for training and recreational shooting.",
    emoji: "🔫"
  },
  { 
    title: "Pellets", 
    slug: "pellets",
    description: "High-quality pellets for optimal accuracy and performance.",
    emoji: "⚪"
  },
  { 
    title: "Air Rifle Accessories", 
    slug: "air-rifle-accessories",
    description: "Specialized accessories to enhance your air rifle experience.",
    emoji: "🎯"
  },
  { 
    title: "Air Pistol Accessories", 
    slug: "air-pistol-accessories",
    description: "Professional accessories for air pistol shooting.",
    emoji: "🔫"
  },
  { 
    title: "Electronic Target Systems", 
    slug: "electronic-target-systems",
    description: "Advanced electronic target systems for precision scoring.",
    emoji: "🎯"
  },
  { 
    title: "Scatt", 
    slug: "scatt",
    description: "Professional Scatt training systems for competitive shooters.",
    emoji: "🎯"
  },
  { 
    title: "Consumables", 
    slug: "consumables",
    description: "Essential consumables for your shooting equipment.",
    emoji: "📦"
  }
];

// Add any categories from products that might not be in our predefined list
const ensureAllProductCategoriesAreIncluded = () => {
  const existingCategories = allCollections.map(c => c.title);
  const productCategories = getAllCategories();
  
  productCategories.forEach(category => {
    if (!existingCategories.includes(category)) {
      const slug = category.toLowerCase().replace(/\s+/g, '-');
      allCollections.push({
        title: category,
        slug,
        description: `Premium quality ${category.toLowerCase()} for professional shooters and enthusiasts.`,
        emoji: '🎯'
      });
    }
  });
};

// Ensure all product categories are represented
ensureAllProductCategoriesAreIncluded();

// Sort options
interface SortOption {
  label: string;
  value: string;
  sortFn: (a: Product, b: Product) => number;
}

const sortOptions: SortOption[] = [
  { 
    label: 'Featured', 
    value: 'featured', 
    sortFn: () => 0 // No sorting, keep original order
  },
  { 
    label: 'Price: Low to High', 
    value: 'price-asc', 
    sortFn: (a, b) => a.numericPrice - b.numericPrice
  },
  { 
    label: 'Price: High to Low', 
    value: 'price-desc', 
    sortFn: (a, b) => b.numericPrice - a.numericPrice
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

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Use numericPrice if available, else parse price string, else 0
  const displayPrice = formatIndianPrice(
    typeof product.numericPrice === 'number' && !isNaN(product.numericPrice)
      ? product.numericPrice
      : (typeof product.price === 'string' && product.price.trim() !== '' && !isNaN(parseFloat(product.price.replace(/[^\d.]/g, '')))
          ? parseFloat(product.price.replace(/[^\d.]/g, ''))
          : (typeof product.price === 'number' && !isNaN(product.price)
              ? product.price
              : 0
            )
        )
  );
  
  // Check if product is in wishlist
  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id));
  }, [isInWishlist, product.id]);
  
  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist', {
        duration: 2000 // 2 seconds
      });
    } else {
      // The product is already in the correct format for the wishlist
      addToWishlist(product);
      toast.success('Added to wishlist', {
        duration: 2000 // 2 seconds
      });
    }
    
    setIsWishlisted(!isWishlisted);
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.inStock) return;
    
    // Just call addToCart - the toast is shown in CartContext
    addToCart(product, 1);
  };
  
  return (
    <motion.div
      className="h-full group"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className={cn(
        "h-full rounded-lg overflow-hidden border transition-all hover:shadow-lg relative",
        isDark ? "bg-mangla-dark-gray border-gray-800" : "bg-white border-gray-200"
      )}>
        <div className="relative h-full flex flex-col">
          <Link to={`/products/product/${product.id}`} className="block flex-1 relative">
            {/* Product tags */}
            <div className="absolute top-3 left-3 z-20 flex flex-col items-start gap-2">
              {product.isNew && (
                <motion.span 
                  className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-semibold shadow-md"
                  initial={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  NEW
                </motion.span>
              )}
              {product.isHot && (
                <motion.span 
                  className="bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold shadow-md"
                  initial={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  HOT
                </motion.span>
              )}
              {product.numericPrice && product.numericPrice > 100000 && (
                <motion.span 
                  className="bg-purple-500 text-white text-xs px-2 py-1 rounded font-semibold shadow-md"
                  initial={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  PREMIUM
                </motion.span>
              )}
            </div>
          
          {/* Wishlist button - always visible */}
          <div className="absolute top-3 right-3 z-20">
            <motion.button
              onClick={toggleWishlist}
              className={cn(
                'p-2 rounded-full backdrop-blur-sm transition-colors',
                'flex items-center justify-center',
                'shadow-md',
                isDark ? 'bg-gray-800/90 hover:bg-gray-700/90' : 'bg-white/90 hover:bg-white',
                isWishlisted ? 'text-rose-500' : 'text-gray-600 dark:text-gray-300'
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isWishlisted ? (
                <Heart className="w-5 h-5 fill-current" />
              ) : (
                <Heart className="w-5 h-5" />
              )}
            </motion.button>
          </div>
          
          {/* Image container with fixed aspect ratio */}
          <div className="relative w-full pt-[100%] bg-white overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          
          {/* Product details */}
          <div className="p-4">
            <div className="mb-2">
              <p className={cn(
                "text-sm",
                isDark ? "text-mangla-gold" : "text-blue-600"
              )}>
                {product.category}
              </p>
              <h3 className={cn(
                "font-medium line-clamp-2 h-12",
                isDark ? "text-white" : "text-slate-900"
              )}>
                {product.name}
              </h3>
              
              {/* Ratings */}
              <div className="flex items-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={cn(
                      "mr-0.5",
                      star <= product.rating 
                        ? "fill-mangla-gold text-mangla-gold" 
                        : isDark 
                          ? "text-gray-700" 
                          : "text-gray-300"
                    )}
                  />
                ))}
                <span className={cn(
                  "text-xs ml-1",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  ({product.reviewCount || product.soldCount || 0})
                </span>
              </div>
            </div>
            
            {/* Price */}
            <div className="mt-2 flex items-center">
              <p className={cn(
                "text-lg font-bold",
                isDark ? "text-white" : "text-slate-900"
              )}>
                {displayPrice}
              </p>
              
              {/* Placeholder for original price if we want to show discount */}
              {product.originalPrice && (
                <p className={cn(
                  "text-sm line-through ml-2",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  {formatIndianPrice(product.originalPrice)}
                </p>
              )}
            </div>
            

          </div>
          </Link>
        
          {/* Action buttons */}
          <div className="px-4 pb-4 mt-auto">
            <Button
              onClick={handleAddToCart}
              className={cn(
                "w-full py-2 text-sm font-medium transition-colors",
                product.inStock
                  ? isDark 
                    ? "bg-mangla-gold hover:bg-mangla-gold/90 text-mangla-dark-gray"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              )}
              disabled={!product.inStock}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProductsContent: React.FC = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // Get max price for the range slider
  const maxPrice = getMaxPrice();
  
  // Get all unique brands
  const allBrands = getAllBrands();
  
  // Filter state initialization
  const [filters, setFilters] = useState<ProductFilters>({
    priceRange: [0, maxPrice],
    categories: [], // Don't add the current URL category to filters
    brands: [],
    availability: [],
    ratings: [],
    onSale: false
  });
  
  // Sort state
  const [sortBy, setSortBy] = useState<string>('featured');
  
  // Don't sync the URL category with filters - we'll handle it separately in the product filtering logic
  useEffect(() => {
    // Reset other filters when category changes but don't add the category to filters
    if (category) {
      setFilters(prev => ({
        ...prev,
        // Don't set categories here, we'll handle it in filteredProducts
      }));
    }
  }, [category]);
  
  // Scroll to top when category changes
  // Scroll to top immediately when component mounts or category changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.body.style.scrollBehavior = 'auto';
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Reset scroll behavior after loading
      document.body.style.scrollBehavior = '';
    }, 500);
    
    return () => clearTimeout(timer);
  }, [category]);
  
  // Get current category details
  const currentCategory = allCollections.find(c => c.slug === category);
  
  // Apply filters to products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    // Apply search query filter if provided
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.shortDescription?.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    // Apply category filter if provided (only if no search query)
    else if (category) {
      // Get category title from slug
      const categoryTitle = currentCategory?.title || '';
      filtered = filtered.filter(p => p.category === categoryTitle);
    } 
    // Otherwise apply multiple category filters if selected
    else if (filters.categories.length > 0) {
      // Need to map from slugs back to actual category names
      const selectedCategoryTitles = filters.categories
        .map(slug => {
          const collection = allCollections.find(c => c.slug === slug);
          return collection?.title || '';
        })
        .filter(title => title !== '');
        
      filtered = filtered.filter(p => selectedCategoryTitles.includes(p.category));
    }
    
    // Apply price filter
    filtered = filtered.filter(p => {
      return p.numericPrice >= filters.priceRange[0] && p.numericPrice <= filters.priceRange[1];
    });
    
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
      filtered = filtered.filter(p => p.originalPrice !== undefined);
    }
    
    // Apply sorting
    const sortOption = sortOptions.find(option => option.value === sortBy);
    if (sortOption) {
      filtered = [...filtered].sort(sortOption.sortFn);
    }
    
    return filtered;
  }, [category, filters, sortBy, currentCategory]);
  
  // --- SANITIZE PRODUCTS BEFORE RENDERING ---
  // Always use this array for rendering ProductCard
  const safeProducts = products.map(product => ({
    ...product,
    numericPrice:
      typeof product.numericPrice === 'number' && !isNaN(product.numericPrice)
        ? product.numericPrice
        : (typeof product.price === 'string' && product.price.trim() !== '' && !isNaN(parseFloat(product.price.replace(/[^\d.]/g, '')))
            ? parseFloat(product.price.replace(/[^\d.]/g, ''))
            : (typeof product.price === 'number' && !isNaN(product.price)
                ? product.price
                : 0
              )
          ),
    price:
      typeof product.price === 'string' && product.price.trim() !== '' && !isNaN(parseFloat(product.price.replace(/[^\d.]/g, '')))
        ? product.price
        : (typeof product.numericPrice === 'number' && !isNaN(product.numericPrice)
            ? product.numericPrice.toString()
            : '0'
          )
  }));

  // Handle filter change
  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  // Handles filter apply on mobile: applies filters and closes panel
  const handleApplyFiltersMobile = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setIsMobileFiltersOpen(false);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({
      priceRange: [0, maxPrice],
      categories: [], 
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

  // Content container animation
  const contentAnimations = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  // If viewing all collections (no category selected) but no filters applied
  // Show a grid of categories instead
  if (!category && filters.categories.length === 0 && 
      filters.brands.length === 0 && 
      filters.availability.length === 0 && 
      filters.ratings.length === 0 &&
      !filters.onSale &&
      filters.priceRange[0] === 0 && 
      filters.priceRange[1] === maxPrice) {
    
    return (
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-10"
          >
            <h1 className={cn(
              "text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8",
              isDark ? "text-white" : "text-slate-900"
            )}>
              All Products
            </h1>
            <p className={cn(
              "max-w-3xl mb-10",
              isDark ? "text-gray-300" : "text-slate-700"
            )}>
              Browse our complete range of premium shooting equipment designed for professionals and enthusiasts
            </p>
          </motion.div>
          
          {/* Show products by category */}
          <div className="space-y-16">
            {allCollections.map((collection, index) => {
              // Find products for this category
              const categoryProducts = products.filter(p => p.category === collection.title);
              
              // Only show categories that have products
              if (categoryProducts.length === 0) return null;
              
              return (
                <div key={index} className="space-y-6">
                  <div className="flex justify-between items-center">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <h2 className={cn(
                        "text-2xl font-bold",
                        isDark ? "text-white" : "text-slate-900"
                      )}>
                        {collection.title}
                      </h2>
                      <motion.div 
                        className="w-20 h-1 bg-mangla-gold mt-2"
                        initial={{ width: 0 }}
                        animate={{ width: 80 }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                      />
                    </motion.div>
                    
                    <Link to={`/products/${collection.slug}`}>
                      <motion.button 
                        className={cn(
                          "px-4 py-2 rounded-md text-sm transition-colors",
                          isDark 
                            ? "text-mangla-gold hover:bg-mangla-gold/10 border border-mangla-gold"
                            : "text-blue-600 hover:bg-blue-50 border border-blue-600"
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        View All
                      </motion.button>
                    </Link>
                  </div>
                  
                  {/* Products in this category - limit to 4 */}
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                  >
                    {categoryProducts.slice(0, 4).map((product, idx) => (
                      <ProductCard key={idx} product={safeProducts.find(p => p.id === product.id) || product} />
                    ))}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  }

  // Show filtered products view (when category is selected or filters applied)
  return (
    <motion.div 
      className={cn(
        "min-h-screen",
        isDark ? "bg-mangla" : "bg-slate-50"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container-custom pt-28 pb-16 md:pt-32 md:pb-20">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-2 text-sm mb-4">
            <Link 
              to="/" 
              className={cn(
                "hover:underline",
                isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
              )}
            >
              Home
            </Link>
            <span className={isDark ? "text-gray-600" : "text-gray-400"}>/</span>
            <Link 
              to="/products" 
              className={cn(
                "hover:underline",
                isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
              )}
            >
              Products
            </Link>
            {currentCategory && (
              <>
                <span className={isDark ? "text-gray-600" : "text-gray-400"}>/</span>
                <span className={isDark ? "text-gray-300" : "text-gray-900"}>
                  {currentCategory.title}
                </span>
              </>
            )}
          </div>
          
          <h1 className={cn(
            "text-3xl font-bold mb-2",
            isDark ? "text-white" : "text-slate-900"
          )}>
            {searchQuery ? (
              `Search Results for "${searchQuery}"`
            ) : currentCategory ? (
              <>
                <span className="text-3xl mr-2">{currentCategory.emoji}</span>
                {currentCategory.title}
              </>
            ) : 'All Products'}
          </h1>
          
          <p className={cn(
            isDark ? "text-gray-400" : "text-gray-600"
          )}>
            {searchQuery 
              ? `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} matching "${searchQuery}"`
              : currentCategory?.description || 'Browse our wide range of premium shooting sports equipment and accessories.'
            }
          </p>
        </motion.div>
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <Button 
            onClick={toggleMobileFilters}
            variant="outline"
            className={cn(
              "w-full flex items-center justify-center",
              isDark ? "border-gray-700 text-white" : "border-gray-300 text-gray-700"
            )}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            {isMobileFiltersOpen ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - desktop always visible, mobile conditional */}
          <motion.aside 
            className={cn(
              "lg:w-64 shrink-0",
              isMobileFiltersOpen ? "block" : "hidden lg:block"
            )}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductsSidebar 
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              onApplyFiltersMobile={handleApplyFiltersMobile}
              allCategories={allCollections.map(c => ({ slug: c.slug, title: c.title }))}
              slug={category || ''}
              title={currentCategory?.title || 'All Products'}
              allBrands={allBrands}
              maxPrice={maxPrice}
              hideCategories={!!currentCategory}
            />
          </motion.aside>
          
          {/* Main content */}
          <motion.div 
            className="flex-1"
            {...contentAnimations}
          >
            {/* Sorting and results info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className={isDark ? "text-gray-300" : "text-gray-700"}>
                Showing <span className="font-semibold">{filteredProducts.length}</span> products
              </div>
              
              <div className="flex items-center space-x-2">
                <label 
                  htmlFor="sort" 
                  className={cn(
                    "text-sm whitespace-nowrap",
                    isDark ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={handleSortChange}
                  className={cn(
                    "py-2 px-3 rounded-md text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500",
                    isDark 
                      ? "bg-mangla-dark-gray border-gray-700 text-white" 
                      : "bg-white border-gray-300 text-gray-700"
                  )}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Products grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "rounded-lg h-96 animate-pulse",
                      isDark ? "bg-gray-800" : "bg-gray-200"
                    )} 
                  />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {filteredProducts.map((product, index) => {
                  // Always use sanitized products to prevent NaN prices
                  const safeProduct = safeProducts.find(p => p.id === product.id) || product;
                  return (
                    <motion.div
                      key={product.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                    >
                      <ProductCard product={safeProduct} />
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="py-12 text-center">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mb-6"
                >
                  <span className="text-6xl">🔍</span>
                </motion.div>
                <h3 className={cn(
                  "text-xl font-semibold mb-2",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  No products found
                </h3>
                <p className={cn(
                  "max-w-md mx-auto mb-8",
                  isDark ? "text-gray-400" : "text-gray-600"
                )}>
                  Try adjusting your filters or search criteria to find what you're looking for.
                </p>
                <Button
                  onClick={handleClearFilters}
                  className={cn(
                    "bg-mangla-gold hover:bg-mangla-gold/90 text-mangla-dark-gray"
                  )}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductsPage;
