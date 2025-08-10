// API Configuration
export const API_CONFIG = {
  // Base URL for all API endpoints
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  
  // Individual service endpoints
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_ROLE: '/auth/verify-role',
    RESEND_VERIFICATION: '/auth/resend-verification',
  },
  
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id: string) => `/products/${id}`,
    DELETE_IMAGE: (publicId: string) => `/products/delete-image/${publicId}`,
  },
  
  CART: {
    BASE: '/cart',
    BY_ID: (id: string) => `/cart/${id}`,
  },
  
  WISHLIST: {
    BASE: '/wishlist',
    BY_ID: (id: string) => `/wishlist/${id}`,
  },
  
  ORDERS: {
    BASE: '/orders',
    USER_ORDERS: '/orders/user',
    ITEMS: (itemId: string) => `/orders/items/${itemId}`,
  },
  
  ADDRESSES: {
    BASE: '/addresses',
    BY_ID: (id: string) => `/addresses/${id}`,
  },
  
  REVIEWS: {
    PRODUCT: (productId: string) => `/reviews/product/${productId}`,
    USER_REVIEW: (productId: string) => `/reviews/product/${productId}/user`,
    CAN_REVIEW: (productId: string) => `/reviews/product/${productId}/can-review`,
  },
  
  BLOG: {
    POSTS: '/blog/posts',
    BY_ID: (id: string) => `/blog/posts/${id}`,
    POST_BY_SLUG: (slug: string) => `/blog/posts/${slug}`,
    UPLOAD: '/blog/upload',
  },
  
  EVENTS: {
    BASE: '/events',
    BY_ID: (id: string) => `/events/${id}`,
    BY_SLUG: (slug: string) => `/events/${slug}`,
    ADMIN_ALL: '/events/admin/all',
  },
  
  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id: string) => `/categories/${id}`,
  },
  
  BRANDS: {
    BASE: '/brands',
    BY_ID: (id: string) => `/brands/${id}`,
  },
  
  PAYMENT: {
    ORDER: '/payment/order',
    VERIFY: '/payment/verify',
  },
  
  UPLOAD: '/upload',
  
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    CHANGE_PASSWORD: (id: string) => `/users/${id}/change-password`,
    ADMIN_STATS: '/users/admin/stats',
  },
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to build full API URLs with parameters
export const buildApiUrlWithParams = (endpoint: string, params: Record<string, string>): string => {
  const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  return url.toString();
}; 