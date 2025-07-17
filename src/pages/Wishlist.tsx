import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { cn, formatIndianPrice } from '@/lib/utils';

// Helper function to safely extract numeric price from product
const getNumericPrice = (product: any): number => {
  // First try to get numericPrice if it exists and is valid
  if (typeof product.numericPrice === 'number' && !isNaN(product.numericPrice)) {
    return product.numericPrice;
  }
  
  // If price is a string, try to parse it
  if (typeof product.price === 'string' && product.price.trim() !== '') {
    const numericString = product.price.replace(/[^\d.]/g, '');
    const parsed = parseFloat(numericString);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }
  
  // If price is a valid number, use it
  if (typeof product.price === 'number' && !isNaN(product.price)) {
    return product.price;
  }
  
  // Default to 0 if no valid price found
  return 0;
};

export default function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromWishlist(productId);
    toast.success(`${productName} has been removed from your wishlist.`, {
      duration: 2000 // 2 seconds
    });
  };

  const handleClearWishlist = () => {
    clearWishlist();
    toast.success('All items have been removed from your wishlist.', {
      duration: 2000 // 2 seconds
    });
  };
  


  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <nav className="flex items-center mb-6">
              <Link 
                to="/" 
                className={cn(
                  "inline-flex items-center text-mangla-gold hover:text-mangla-gold-dark transition-colors",
                  "dark:text-yellow-400 dark:hover:text-yellow-300"
                )}
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                Back to Home
              </Link>
            </nav>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  My Wishlist
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
                </p>
              </div>
              
              {wishlist.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300 gap-2"
                  onClick={handleClearWishlist}
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {wishlist.length === 0 ? (
              <motion.div 
                key="empty-wishlist"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16"
              >
                <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <Heart className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Your wishlist is empty
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Save your favorite items to your wishlist and they'll appear here.
                </p>
                <Button asChild>
                  <Link to="/products" className="gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Browse Products
                  </Link>
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                key="wishlist-items"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence>
                    {wishlist.map((product) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        className="relative group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700"
                      >
                        <Link
                          to={`/products/product/${product.id}`}
                          className="block"
                        >
                          <div className="aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
                            <img
                              src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.png'}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                              {product.name}
                            </h3>
                            <p className="text-mangla-gold font-semibold">
                              {formatIndianPrice(getNumericPrice(product))}
                            </p>
                            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {typeof product.category === 'string' ? product.category : product.category?.name || ''}
                            </span>
                          </div>
                        </Link>
                        
                        <div className="absolute top-3 right-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm",
                              "text-red-500 hover:bg-red-50 hover:text-red-600",
                              "dark:bg-gray-800/80 dark:hover:bg-red-900/30 dark:text-red-400"
                            )}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemoveItem(product.id, product.name);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove from wishlist</span>
                          </Button>
                        </div>
                        
                        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                          <Button className="w-full" size="sm">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <Button variant="outline" asChild>
                    <Link to="/products" className="gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
