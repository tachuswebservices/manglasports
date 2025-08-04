import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      await signup(name, email, password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mangla-light-bg dark:bg-mangla">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-6"
      >
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/msa-logo.png" 
              alt="Mangla Sports Logo" 
              className="h-16 w-auto" 
            />
          </div>
          <h1 className="font-montserrat text-2xl font-bold text-slate-800 dark:text-white mb-2">
            Join Mangla Sports
          </h1>
          <p className="text-slate-600 dark:text-gray-400 text-sm">
            Create your account for premium shooting equipment
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 p-8">
          {success ? (
            <div className="text-center space-y-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Account Created Successfully!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please check your email to verify your account before logging in.
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full bg-mangla-gold hover:bg-mangla-blue text-white">
                  <Link to="/login">
                    Go to Login
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                    setName('');
                    setPassword('');
                  }}
                >
                  Create Another Account
                </Button>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
                  >
                    <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
                  </motion.div>
                )}

                {/* Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="pl-10 h-12 border-gray-300 dark:border-slate-600 focus:border-mangla-gold dark:focus:border-mangla-gold focus:ring-mangla-gold"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="pl-10 h-12 border-gray-300 dark:border-slate-600 focus:border-mangla-gold dark:focus:border-mangla-gold focus:ring-mangla-gold"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-gray-300 dark:border-slate-600 focus:border-mangla-gold dark:focus:border-mangla-gold focus:ring-mangla-gold"
                      placeholder="Create a password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-gray-500">
                    Password must be at least 6 characters long
                  </p>
                </div>

                {/* Signup Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-mangla-gold hover:bg-mangla-blue text-white font-medium transition-all duration-200 transform hover:scale-[1.02]" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-mangla-gold hover:text-mangla-blue font-medium transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                </p>
        </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-slate-500 dark:text-gray-500">
            © 2024 Mangla Sports. Premium Shooting Equipment.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup; 