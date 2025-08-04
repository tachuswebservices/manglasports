import React from 'react';
import { Star, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

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

interface ReviewListProps {
  reviews: Review[];
  onEditReview: (review: Review) => void;
  onDeleteReview: (review: Review) => void;
  loading?: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  onEditReview,
  onDeleteReview,
  loading = false
}) => {
  const { user } = useAuth();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
        <p className="text-gray-500 dark:text-gray-400">Be the first to review this product</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              {/* User Avatar */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-mangla-gold rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {review.user.name ? review.user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
              </div>

              {/* Review Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-sm">
                    {review.user.name || 'Anonymous User'}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {formatDate(review.createdAt)}
                  </span>
                </div>

                                 {/* Rating Stars */}
                 <div className="flex items-center mb-2">
                   {[1, 2, 3, 4, 5].map((star) => (
                     <Star
                       key={star}
                       className={cn(
                         "w-4 h-4",
                         star <= review.rating
                           ? "fill-mangla-gold text-mangla-gold"
                           : "text-gray-300"
                       )}
                     />
                   ))}
                   <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                     {review.rating}/5
                   </span>
                   <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                     ✅ Verified Purchase
                   </span>
                 </div>

                {/* Review Comment */}
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>

            {/* Edit/Delete Buttons for User's Own Review */}
            {user && user.id === review.user.id && (
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditReview(review)}
                  className="text-xs px-3 py-1 h-7 border-mangla-gold text-mangla-gold hover:bg-mangla-gold hover:text-white"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteReview(review)}
                  className="text-xs px-3 py-1 h-7 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList; 