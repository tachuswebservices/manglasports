import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  existingReview?: {
    id: number;
    rating: number;
    comment: string;
  } | null;
  onReviewSubmitted: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
  existingReview,
  onReviewSubmitted
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { user, token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    } else {
      setRating(0);
      setComment('');
    }
  }, [existingReview, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !token) {
      toast({
        title: "Authentication Required",
        description: "Please login to submit a review.",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating from 1 to 5 stars.",
        variant: "destructive",
      });
      return;
    }

    if (comment.trim().length < 10) {
      toast({
        title: "Comment Too Short",
        description: "Please write a comment with at least 10 characters.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const url = existingReview 
        ? `http://localhost:4000/api/reviews/product/${productId}`
        : `http://localhost:4000/api/reviews/product/${productId}`;
      
      const method = existingReview ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: existingReview ? "Review Updated" : "Review Submitted",
          description: existingReview 
            ? "Your review has been updated successfully."
            : "Thank you for your review!",
        });
        onReviewSubmitted();
        onClose();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit review. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !token) return;

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:4000/api/reviews/product/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast({
          title: "Review Deleted",
          description: "Your review has been deleted successfully.",
        });
        onReviewSubmitted();
        onClose();
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to delete review.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {existingReview ? 'Edit Your Review' : 'Write a Review'}
          </DialogTitle>
        </DialogHeader>
        
                 <div className="space-y-4">
           <div className="text-center">
             <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
               {productName}
             </p>
             <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
               <p className="text-sm text-green-800 dark:text-green-200">
                 ✅ <strong>Verified Purchase:</strong> You can review this product because you have purchased it.
               </p>
             </div>
           </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating Stars */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating *</label>
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={cn(
                        "w-8 h-8 transition-colors",
                        (hoveredRating >= star || rating >= star)
                          ? "fill-mangla-gold text-mangla-gold"
                          : "text-gray-300 hover:text-mangla-gold"
                      )}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center">
                {rating === 0 && "Click to rate"}
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label htmlFor="comment" className="text-sm font-medium">
                Your Review *
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                className="min-h-[100px] resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 text-right">
                {comment.length}/500 characters
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              {existingReview && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Deleting...' : 'Delete Review'}
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading || rating === 0 || comment.trim().length < 10}
                className="flex-1 bg-mangla-gold hover:bg-mangla-blue text-white"
              >
                {loading 
                  ? (existingReview ? 'Updating...' : 'Submitting...') 
                  : (existingReview ? 'Update Review' : 'Submit Review')
                }
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal; 