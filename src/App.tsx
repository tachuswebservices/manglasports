import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/UnifiedProducts"; // Using the unified Products page
import ProductDetail from "./pages/ProductDetail";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Wishlist from "./pages/Wishlist";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import ScrollToTop from "./components/ScrollToTop";
import { WishlistProvider } from "./contexts/WishlistContext";
import { CartProvider } from "./contexts/CartContext";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import ResendVerification from './pages/ResendVerification';
import React, { useState, useEffect } from 'react';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import WhatsappFloatingButton from './components/common/WhatsappFloatingButton';

// ProtectedRoute component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null; // or a spinner
  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }
  return <>{children}</>;
};

// AdminRoute component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, loading, verifyUserRole } = useAuth();
  const [roleVerified, setRoleVerified] = useState(false);
  const [checkingRole, setCheckingRole] = useState(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (isAuthenticated && !roleVerified && !checkingRole) {
        setCheckingRole(true);
        try {
          // Get the current token from localStorage since we need it for verification
          const currentToken = localStorage.getItem('token');
          if (!currentToken) {
            window.location.href = '/login';
            return;
          }
          
          const isValid = await verifyUserRole(currentToken);
          if (isValid && user?.role === 'admin') {
            setRoleVerified(true);
          } else {
            window.location.href = '/profile';
          }
        } catch (error) {
          console.error('Role verification failed:', error);
          window.location.href = '/profile';
        } finally {
          setCheckingRole(false);
        }
      }
    };

    checkAdminRole();
  }, [isAuthenticated, user, roleVerified, checkingRole, verifyUserRole]);

  if (loading || checkingRole) return null; // or a spinner
  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }
  if (!roleVerified) {
    return null; // Still checking role
  }
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <Toaster />
                <Sonner />
                <ScrollToTop />
                <WhatsappFloatingButton />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/products/product/:productId" element={<ProductDetail />} />
                  <Route path="/products/:category" element={<Products />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:slug" element={<EventDetail />} />
                  <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route path="/resend-verification" element={<ResendVerification />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
