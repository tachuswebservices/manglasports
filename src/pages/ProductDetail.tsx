import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Share2, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { WishlistButton } from '@/components/common/WishlistButton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatIndianPrice } from '@/lib/utils';
import { useTheme } from '@/components/theme/ThemeProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ReviewModal from '@/components/products/ReviewModal';
import ReviewList from '@/components/products/ReviewList';
import { useAuth } from '@/contexts/AuthContext';
// import { Product as BaseProduct, products } from '@/data/products';
import { useCart } from '@/contexts/CartContext';

// Product type based on backend API
interface Product {
  id: string;
  name: string;
  price: string;
  numericPrice: number;
  originalPrice?: number;
  image: string;
  category: { id: number; name: string } | string;
  brand: { id: number; name: string } | string;
  rating: number;
  reviewCount?: number;
  soldCount?: number;
  inStock: boolean;
  isNew?: boolean;
  isHot?: boolean;
  shortDescription?: string;
  features?: { value: string }[];
  specifications?: { key: string; value: string }[];
  offerPrice?: number;
}

interface DetailedProduct extends Product {
  description: string;
  images: string[];
  sku: string;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

const fetchProduct = async (productId: string): Promise<DetailedProduct | null> => {
  try {
    const res = await fetch(`http://localhost:4000/api/products/${productId}`);
    if (!res.ok) return null;
    const product = await res.json();
    // Enhance with additional details for UI compatibility
    return {
      ...product,
      description: product.shortDescription || '',
      features: product.features || [],
      specifications: product.specifications || [],
      images: product.images,
      sku: `MS-${product.id.toUpperCase()}-2024`,
    };
  } catch {
    return null;
  }
};

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user, token } = useAuth();
  
  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [canReview, setCanReview] = useState<boolean | null>(null);
  
  // Handle share functionality
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.name || 'Check out this product',
          text: `${product?.name} - ${product?.shortDescription || 'Amazing product from Mangla Sports'}`,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to copying to clipboard if sharing fails
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Error copying to clipboard:', err);
        alert('Failed to share. Please copy the URL manually.');
      }
    }
  };
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    if (!product) return;
    
    const added = addToCart(product, quantity);
    if (added) {
      toast.success(`${quantity > 1 ? quantity + ' items' : 'Item'} added to cart`);
    }
  };

  // Fetch reviews for the product
  const fetchReviews = async () => {
    if (!productId) return;
    
    setReviewsLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/reviews/product/${productId}`);
      if (response.ok) {
        const reviewsData = await response.json();
        setReviews(reviewsData);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Fetch user's review for the product
  const fetchUserReview = async () => {
    if (!productId || !user || !token) return;
    
    try {
      const response = await fetch(`http://localhost:4000/api/reviews/product/${productId}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const userReviewData = await response.json();
        setUserReview(userReviewData);
      } else if (response.status === 404) {
        setUserReview(null);
      }
    } catch (error) {
      console.error('Error fetching user review:', error);
    }
  };

  // Check if user can review the product
  const checkCanReview = async () => {
    if (!productId || !user || !token) {
      setCanReview(false);
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:4000/api/reviews/product/${productId}/can-review`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCanReview(data.canReview);
      } else {
        setCanReview(false);
      }
    } catch (error) {
      console.error('Error checking review eligibility:', error);
      setCanReview(false);
    }
  };

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        setError('Product not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchProduct(productId);
        
        if (!data) {
          setError('Product not found');
          navigate('/products', { replace: true });
          return;
        }
        
        setProduct(data);
        document.title = `${data.name} | Mangla Sports`;
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, navigate]);

  useEffect(() => {
    if (productId) {
      fetchReviews();
      fetchUserReview();
      checkCanReview();
    }
  }, [productId, user, token]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  const nextImage = () => {
    if (!product) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    if (!product) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const handleReviewSubmitted = () => {
    fetchReviews();
    fetchUserReview();
    // Refresh product data to update rating and review count
    if (productId) {
      fetchProduct(productId).then(setProduct);
    }
  };

  const handleWriteReview = () => {
    if (!user) {
      toast.error('Please login to write a review');
      return;
    }
    
    if (canReview === false) {
      toast.error('You need to purchase this product first to write a review');
      return;
    }
    
    setEditingReview(null);
    setIsReviewModalOpen(true);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setIsReviewModalOpen(true);
  };

  const handleDeleteReview = (review: Review) => {
    // This will be handled by the ReviewModal component
    handleReviewSubmitted();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mangla">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mangla-gold"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-mangla p-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
        <p className="text-gray-300 mb-6">The requested product could not be found.</p>
        <Button 
          onClick={() => navigate('/products')} 
          className="bg-mangla-gold hover:bg-mangla-gold/90 text-mangla"
        >
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      className={cn("min-h-screen flex flex-col", isDark ? "bg-mangla" : "bg-slate-50")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link 
                  to="/" 
                  className={cn(
                    "hover:underline",
                    isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  Home
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li>
                <Link 
                  to="/products" 
                  className={cn(
                    "hover:underline",
                    isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  Products
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-mangla-gold font-medium">{product.name}</li>
            </ol>
          </nav>
          
          {/* Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={Array.isArray(product.images) ? (typeof product.images[currentImageIndex] === 'string' ? product.images[currentImageIndex] : product.images[currentImageIndex]?.url) : ''} 
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
                
                {/* Share Button - Top Right Corner */}
                <button 
                  onClick={handleShare}
                  className={cn(
                    "absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
                    "shadow-md hover:shadow-lg transition-shadow",
                    isDark ? "text-gray-200 hover:text-white" : "text-gray-700 hover:text-gray-900"
                  )}
                  aria-label="Share this product"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                
                {/* Navigation Arrows */}
                <button 
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              
              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-3">
                {Array.isArray(product.images) && product.images.map((image, index) => {
                  const url = typeof image === 'string' ? image : image.url;
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "aspect-square rounded-md overflow-hidden border-2 transition-all",
                        currentImageIndex === index 
                          ? "border-mangla-gold" 
                          : isDark 
                            ? "border-gray-700 hover:border-gray-600" 
                            : "border-gray-200 hover:border-gray-300"
                      )}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img 
                        src={url} 
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Product Info */}
            <div className={cn("py-2", isDark ? "text-gray-200" : "text-gray-800")}>
              {/* Category and Brand */}
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
                <span className={cn(
                  "mt-2 inline-block px-3 py-1 text-sm font-medium rounded-full",
                  product.inStock 
                    ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300"
                )}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <span className="text-sm opacity-75">SKU: {product.sku}</span>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        "w-5 h-5",
                        i < Math.floor(product.rating) 
                          ? "fill-mangla-gold text-mangla-gold" 
                          : isDark 
                            ? "text-gray-700" 
                            : "text-gray-300"
                      )} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm opacity-75">
                  {product.rating} ({product.reviewCount || 0} reviews)
                </span>
              </div>
              
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline space-x-3">
                  {product.offerPrice && product.offerPrice > 0 ? (
                    <>
                      <p className="text-xl md:text-2xl font-bold mb-2">
                        {formatIndianPrice(product.offerPrice)}
                      </p>
                      <p className="text-gray-500 line-through text-lg md:text-xl mb-2">
                        {formatIndianPrice(product.numericPrice || parseFloat(product.price.replace(/[^0-9.]/g, '')))}
                      </p>
                    </>
                  ) : (
                    <p className="text-xl md:text-2xl font-bold mb-2">
                      {formatIndianPrice(product.numericPrice || parseFloat(product.price.replace(/[^0-9.]/g, '')))}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Short Description */}
              <p className="mb-6">{product.description}</p>
              
              {/* Key Features */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Key Features:</h3>
                <ul className="space-y-1.5">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-mangla-gold mr-2">•</span>
                      <span>{feature.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Add to Cart and Wishlist Row */}
              <div className="mb-8">
                <div className="flex items-center gap-3">
                  {/* Quantity Selector */}
                  <div className={cn(
                    "flex items-center border rounded-md overflow-hidden",
                    isDark ? "border-gray-700" : "border-gray-300"
                  )}>
                    <button 
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className={cn(
                        "px-3 py-1.5 text-base font-medium",
                        isDark 
                          ? "hover:bg-gray-700" 
                          : "hover:bg-gray-100"
                      )}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm">{quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className={cn(
                        "px-3 py-1.5 text-base font-medium",
                        isDark 
                          ? "hover:bg-gray-700" 
                          : "hover:bg-gray-100"
                      )}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <Button 
                    className={cn(
                      "flex-1 py-2 bg-mangla-gold hover:bg-mangla-gold/90 text-white",
                      "text-sm sm:text-base"
                    )}
                    onClick={handleAddToCart}
                    disabled={!product?.inStock}
                  >
                    {product?.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                  
                  {/* Wishlist Button */}
                  <WishlistButton 
                    product={product} 
                    className={cn(
                      "h-10 w-10 p-0 flex-shrink-0",
                      isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
                    )}
                    size="md"
                  />
                </div>
              </div>
              
              {/* Delivery Info */}
              <div className={cn("p-4 rounded-lg mb-8", isDark ? "bg-mangla-dark-gray/50" : "bg-gray-100")}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <svg className="w-6 h-6 text-mangla-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Free Shipping</h4>
                    <p className="text-sm opacity-80">Free delivery for all orders over ₹5,000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="specifications" className="w-full">
              <TabsList className={cn("w-full justify-start p-0 border-b rounded-none", isDark ? "bg-mangla border-gray-800" : "bg-transparent border-gray-200")}>
                
                <TabsTrigger 
                  value="specifications" 
                  className={cn(
                    "py-4 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-mangla-gold data-[state=active]:shadow-none",
                    isDark 
                      ? "data-[state=active]:bg-transparent data-[state=active]:text-white" 
                      : "data-[state=active]:bg-transparent data-[state=active]:text-gray-900"
                  )}
                >
                  Specifications
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className={cn(
                    "py-4 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-mangla-gold data-[state=active]:shadow-none",
                    isDark 
                      ? "data-[state=active]:bg-transparent data-[state=active]:text-white" 
                      : "data-[state=active]:bg-transparent data-[state=active]:text-gray-900"
                  )}
                >
                  Reviews ({product.reviewCount || 0})
                </TabsTrigger>
              </TabsList>
              
              <div className="py-8">
                
                
                <TabsContent value="specifications">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {product.specifications.map((spec, index) => (
                          <tr key={index}>
                            <td className="py-3 px-4 text-sm font-medium whitespace-nowrap" style={isDark ? { color: '#9ca3af' } : { color: '#6b7280' }}>
                              {spec.key}
                            </td>
                            <td className="py-3 px-4 text-sm" style={isDark ? { color: '#e5e7eb' } : { color: '#111827' }}>
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews">
                  <div className="space-y-6">
                    {/* Review Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">Customer Reviews</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {product.reviewCount || 0} reviews • {product.rating} average rating
                        </p>
                      </div>
                                             {user ? (
                         canReview === null ? (
                           <Button disabled className="bg-gray-400 text-white">
                             Loading...
                           </Button>
                         ) : canReview && !userReview ? (
                           <Button 
                             onClick={handleWriteReview}
                             className="bg-mangla-gold hover:bg-mangla-blue text-white"
                           >
                             Write a Review
                           </Button>
                         ) : null
                       ) : (
                         <Button 
                           onClick={handleWriteReview}
                           className="bg-mangla-gold hover:bg-mangla-blue text-white"
                         >
                           Login to Review
                         </Button>
                       )}
                    </div>

                    {/* Reviews List */}
                    <ReviewList
                      reviews={reviews}
                      onEditReview={handleEditReview}
                      onDeleteReview={handleDeleteReview}
                      loading={reviewsLoading}
                    />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        productId={productId!}
        productName={product.name}
        existingReview={editingReview}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </motion.div>
  );
};

export default ProductDetail;
