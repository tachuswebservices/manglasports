import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all reviews for a product
export async function getProductReviews(req, res) {
  try {
    const { productId } = req.params;
    
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
}

// Check if user has purchased the product
async function hasUserPurchasedProduct(userId, productId) {
  try {
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        productId: productId,
        order: {
          userId: userId
        }
      },
      include: {
        order: {
          select: {
            id: true,
            createdAt: true
          }
        }
      }
    });

    return orderItem ? true : false;
  } catch (error) {
    console.error('Error checking purchase:', error);
    return false;
  }
}

// Create a new review
export async function createReview(req, res) {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId; // From JWT token

    // Validate input
    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    if (comment.trim().length < 10) {
      return res.status(400).json({ error: 'Comment must be at least 10 characters long' });
    }

    // Check if user has purchased this product
    const hasPurchased = await hasUserPurchasedProduct(userId, productId);
    if (!hasPurchased) {
      return res.status(403).json({ 
        error: 'You can only review products you have purchased. Please purchase this product first to write a review.' 
      });
    }

    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        productId_userId: {
          productId,
          userId
        }
      }
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        rating,
        comment: comment.trim()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Update product rating and review count
    await updateProductRating(productId);

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
}

// Update a review
export async function updateReview(req, res) {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId;

    // Validate input
    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    if (comment.trim().length < 10) {
      return res.status(400).json({ error: 'Comment must be at least 10 characters long' });
    }

    // Check if user has purchased this product (for existing reviews, we still verify purchase)
    const hasPurchased = await hasUserPurchasedProduct(userId, productId);
    if (!hasPurchased) {
      return res.status(403).json({ 
        error: 'You can only review products you have purchased. Please purchase this product first to write a review.' 
      });
    }

    // Find and update the review
    const review = await prisma.review.update({
      where: {
        productId_userId: {
          productId,
          userId
        }
      },
      data: {
        rating,
        comment: comment.trim(),
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Update product rating and review count
    await updateProductRating(productId);

    res.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.status(500).json({ error: 'Failed to update review' });
  }
}

// Delete a review
export async function deleteReview(req, res) {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    // Delete the review
    await prisma.review.delete({
      where: {
        productId_userId: {
          productId,
          userId
        }
      }
    });

    // Update product rating and review count
    await updateProductRating(productId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.status(500).json({ error: 'Failed to delete review' });
  }
}

// Get user's review for a product
export async function getUserReview(req, res) {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    const review = await prisma.review.findUnique({
      where: {
        productId_userId: {
          productId,
          userId
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json(review);
  } catch (error) {
    console.error('Error fetching user review:', error);
    res.status(500).json({ error: 'Failed to fetch user review' });
  }
}

// Check if user can review a product (has purchased it)
export async function canUserReview(req, res) {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    const hasPurchased = await hasUserPurchasedProduct(userId, productId);
    
    res.json({ 
      canReview: hasPurchased,
      message: hasPurchased 
        ? 'You can review this product' 
        : 'You need to purchase this product first to review it'
    });
  } catch (error) {
    console.error('Error checking review eligibility:', error);
    res.status(500).json({ error: 'Failed to check review eligibility' });
  }
}

// Helper function to update product rating and review count
async function updateProductRating(productId) {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true }
    });

    if (reviews.length === 0) {
      // No reviews, set default values
      await prisma.product.update({
        where: { id: productId },
        data: {
          rating: 0,
          reviewCount: 0
        }
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        reviewCount: reviews.length
      }
    });
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
} 