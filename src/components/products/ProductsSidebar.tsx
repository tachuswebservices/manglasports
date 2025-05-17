import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '../theme/ThemeProvider';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

// Define interface for filter state
export interface ProductFilters {
  priceRange: [number, number];
  categories: string[];
  brands: string[];
  availability: string[];
  ratings: number[];
  onSale: boolean;
}

interface ProductsSidebarProps {
  filters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
  onClearFilters: () => void;
  allCategories: { slug: string; title: string }[];
  allBrands: string[];
  maxPrice: number;
  hideCategories?: boolean; // Flag to hide the categories section
}

const ProductsSidebar: React.FC<ProductsSidebarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  allCategories = [],
  allBrands = [],
  maxPrice = 100000,
  hideCategories = false
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Local state for UI
  const [priceRange, setPriceRange] = useState<[number, number]>(filters.priceRange);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    categories: true,
    brands: true,
    availability: true,
    ratings: true,
    other: true
  });
  
  // Default min and max values
  const minPrice = 0;
  
  // Update local state when filters prop changes
  useEffect(() => {
    setPriceRange(filters.priceRange);
  }, [filters.priceRange]);
  
  // Toggle section visibility
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Handle price range change
  const handlePriceChange = (minVal: number, maxVal: number) => {
    const newRange: [number, number] = [minVal, maxVal];
    setPriceRange(newRange);
    
    // Debounce the actual filter change
    const timer = setTimeout(() => {
      onFilterChange({
        ...filters,
        priceRange: newRange
      });
    }, 300);
    
    return () => clearTimeout(timer);
  };
  
  // Handle category change
  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    onFilterChange({
      ...filters,
      categories: newCategories
    });
  };
  
  // Handle brand change
  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brands, brand]
      : filters.brands.filter(b => b !== brand);
    
    onFilterChange({
      ...filters,
      brands: newBrands
    });
  };
  
  // Handle availability change
  const handleAvailabilityChange = (status: string, checked: boolean) => {
    const newAvailability = checked
      ? [...filters.availability, status]
      : filters.availability.filter(s => s !== status);
    
    onFilterChange({
      ...filters,
      availability: newAvailability
    });
  };
  
  // Handle rating change
  const handleRatingChange = (rating: number, checked: boolean) => {
    const newRatings = checked
      ? [...filters.ratings, rating]
      : filters.ratings.filter(r => r !== rating);
    
    onFilterChange({
      ...filters,
      ratings: newRatings
    });
  };
  
  // Handle on sale toggle
  const handleOnSaleChange = (checked: boolean) => {
    onFilterChange({
      ...filters,
      onSale: checked
    });
  };
  
  // Calculate the price range slider position (percentage)
  const minPosition = ((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100;
  const maxPosition = ((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100;
  
  // Section header component
  const SectionHeader = ({ title, section }: { title: string; section: keyof typeof expandedSections }) => (
    <div 
      className="flex justify-between items-center cursor-pointer"
      onClick={() => toggleSection(section)}
    >
      <h4 className="font-medium">{title}</h4>
      {expandedSections[section] ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      )}
    </div>
  );
  
  // Main filter count badge
  const activeFilterCount = (
    (filters.categories.length > 0 ? 1 : 0) +
    (filters.brands.length > 0 ? 1 : 0) +
    (filters.availability.length > 0 ? 1 : 0) +
    (filters.ratings.length > 0 ? 1 : 0) +
    (filters.onSale ? 1 : 0) +
    ((filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice) ? 1 : 0)
  );

  return (
    <div className={cn(
      "space-y-6 p-4 rounded-lg",
      isDark ? "bg-slate-800" : "bg-gray-50"
    )}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-lg">Filters</h3>
        {activeFilterCount > 0 && (
          <button 
            onClick={onClearFilters}
            className={cn(
              "text-xs flex items-center gap-1 px-2 py-1 rounded",
              isDark ? "text-red-400 hover:text-red-300" : "text-red-500 hover:text-red-600"
            )}
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>
      
      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice ? (
              <div className={cn(
                "text-xs px-2 py-1 rounded-full flex items-center gap-1",
                isDark ? "bg-slate-700" : "bg-gray-200"
              )}>
                Price: ₹{filters.priceRange[0].toLocaleString()} - ₹{filters.priceRange[1].toLocaleString()}
                <button 
                  onClick={() => handlePriceChange(minPrice, maxPrice)}
                  className="ml-1 text-gray-500 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : null}
            
            {filters.categories.map(category => (
              <div 
                key={`filter-cat-${category}`}
                className={cn(
                  "text-xs px-2 py-1 rounded-full flex items-center gap-1",
                  isDark ? "bg-slate-700" : "bg-gray-200"
                )}
              >
                {category}
                <button 
                  onClick={() => handleCategoryChange(category, false)}
                  className="ml-1 text-gray-500 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            
            {/* Display other active filters similarly */}
          </div>
        </div>
      )}
      
      {/* Price Range Filter */}
      <div className="space-y-2 pb-4 border-b border-gray-200 dark:border-gray-700">
        <SectionHeader title="Price Range" section="price" />
        
        {expandedSections.price && (
          <>
            <div className="space-y-6 mt-3">
              <div className="relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                {/* Range track */}
                <div 
                  className={cn(
                    "absolute h-full rounded-full",
                    isDark ? "bg-mangla-gold" : "bg-amber-500"
                  )}
                  style={{
                    left: `${minPosition}%`,
                    width: `${maxPosition - minPosition}%`
                  }}
                ></div>
                
                {/* Min handle */}
                <input 
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(parseInt(e.target.value), priceRange[1])}
                  className="absolute w-full h-1 opacity-0 cursor-pointer"
                />
                
                {/* Max handle */}
                <input 
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(priceRange[0], parseInt(e.target.value))}
                  className="absolute w-full h-1 opacity-0 cursor-pointer"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Min</span>
                  <input 
                    type="number"
                    min={minPrice}
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(parseInt(e.target.value) || minPrice, priceRange[1])}
                    className={cn(
                      "w-24 p-1 text-sm border rounded",
                      isDark ? "bg-slate-700 border-slate-600" : "bg-white border-gray-300"
                    )}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Max</span>
                  <input 
                    type="number"
                    min={priceRange[0]}
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(priceRange[0], parseInt(e.target.value) || maxPrice)}
                    className={cn(
                      "w-24 p-1 text-sm border rounded",
                      isDark ? "bg-slate-700 border-slate-600" : "bg-white border-gray-300"
                    )}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Categories Filter - Only show if not hidden and there are categories */}
      {!hideCategories && allCategories.length > 0 && (
        <div className="space-y-2 pb-4 border-b border-gray-200 dark:border-gray-700">
          <SectionHeader title="Categories" section="categories" />
          
          {expandedSections.categories && (
            <div className="space-y-2 mt-3">
              {allCategories.map((category) => (
                <div key={category.slug} className="flex items-center">
                  <input
                    id={`category-${category.slug}`}
                    type="checkbox"
                    checked={filters.categories.includes(category.slug)}
                    onChange={(e) => handleCategoryChange(category.slug, e.target.checked)}
                    className={cn(
                      "h-4 w-4 rounded border-gray-300",
                      isDark ? "bg-slate-700 border-slate-600 text-mangla-gold focus:ring-mangla-gold" : 
                              "text-amber-500 focus:ring-amber-500"
                    )}
                  />
                  <label htmlFor={`category-${category.slug}`} className="ml-2 text-sm">
                    {category.title}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Brands Filter */}
      <div className="space-y-2 pb-4 border-b border-gray-200 dark:border-gray-700">
        <SectionHeader title="Brands" section="brands" />
        
        {expandedSections.brands && (
          <div className="space-y-2 mt-3">
            {allBrands.map((brand) => (
              <div key={brand} className="flex items-center">
                <input
                  id={`brand-${brand}`}
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={(e) => handleBrandChange(brand, e.target.checked)}
                  className={cn(
                    "h-4 w-4 rounded border-gray-300",
                    isDark ? "bg-slate-700 border-slate-600 text-mangla-gold focus:ring-mangla-gold" : 
                            "text-amber-500 focus:ring-amber-500"
                  )}
                />
                <label htmlFor={`brand-${brand}`} className="ml-2 text-sm">
                  {brand}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Availability Filter */}
      <div className="space-y-2 pb-4 border-b border-gray-200 dark:border-gray-700">
        <SectionHeader title="Availability" section="availability" />
        
        {expandedSections.availability && (
          <div className="space-y-2 mt-3">
            {['in-stock', 'out-of-stock'].map((status) => (
              <div key={status} className="flex items-center">
                <input
                  id={`availability-${status}`}
                  type="checkbox"
                  checked={filters.availability.includes(status)}
                  onChange={(e) => handleAvailabilityChange(status, e.target.checked)}
                  className={cn(
                    "h-4 w-4 rounded border-gray-300",
                    isDark ? "bg-slate-700 border-slate-600 text-mangla-gold focus:ring-mangla-gold" : 
                            "text-amber-500 focus:ring-amber-500"
                  )}
                />
                <label htmlFor={`availability-${status}`} className="ml-2 text-sm">
                  {status === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Ratings Filter */}
      <div className="space-y-2 pb-4 border-b border-gray-200 dark:border-gray-700">
        <SectionHeader title="Ratings" section="ratings" />
        
        {expandedSections.ratings && (
          <div className="space-y-2 mt-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <input
                  id={`rating-${rating}`}
                  type="checkbox"
                  checked={filters.ratings.includes(rating)}
                  onChange={(e) => handleRatingChange(rating, e.target.checked)}
                  className={cn(
                    "h-4 w-4 rounded border-gray-300",
                    isDark ? "bg-slate-700 border-slate-600 text-mangla-gold focus:ring-mangla-gold" : 
                            "text-amber-500 focus:ring-amber-500"
                  )}
                />
                <label htmlFor={`rating-${rating}`} className="ml-2 text-sm flex items-center">
                  {Array.from({ length: rating }).map((_, i) => (
                    <svg key={i} className={cn("w-4 h-4 fill-mangla-gold text-mangla-gold")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                    </svg>
                  ))}
                  {Array.from({ length: 5 - rating }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                    </svg>
                  ))}
                  <span className="ml-1">{rating}+ stars</span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Other Filters */}
      <div className="space-y-2 pb-4 border-b border-gray-200 dark:border-gray-700">
        <SectionHeader title="Other Filters" section="other" />
        
        {expandedSections.other && (
          <div className="space-y-2 mt-3">
            <div className="flex items-center">
              <input
                id="on-sale"
                type="checkbox"
                checked={filters.onSale}
                onChange={(e) => handleOnSaleChange(e.target.checked)}
                className={cn(
                  "h-4 w-4 rounded border-gray-300",
                  isDark ? "bg-slate-700 border-slate-600 text-mangla-gold focus:ring-mangla-gold" : 
                          "text-amber-500 focus:ring-amber-500"
                )}
              />
              <label htmlFor="on-sale" className="ml-2 text-sm flex items-center">
                On Sale
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4">
        <button 
          className={cn(
            "w-full py-2 px-4 rounded-md text-sm font-medium transition",
            isDark 
              ? "bg-mangla-gold text-slate-900 hover:bg-yellow-500" 
              : "bg-amber-500 text-white hover:bg-amber-600"
          )}
          onClick={() => onFilterChange(filters)}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default ProductsSidebar;
