import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus('error');
        setMessage('No verification token found. Please check your email for the correct verification link.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:4000/api/auth/verify-email/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setVerificationStatus('success');
          setMessage(data.message);
          toast({
            title: "Email Verified!",
            description: "Your email has been successfully verified. You can now log in to your account.",
          });
        } else {
          setVerificationStatus('error');
          setMessage(data.error || 'Verification failed. Please try again.');
          toast({
            title: "Verification Failed",
            description: data.error || 'Verification failed. Please try again.',
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        setMessage('Network error. Please check your connection and try again.');
        toast({
          title: "Network Error",
          description: "Please check your connection and try again.",
          variant: "destructive",
        });
      }
    };

    verifyEmail();
  }, [token, toast]);

  return (
    <div className="min-h-screen bg-mangla-light-bg dark:bg-mangla flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="https://res.cloudinary.com/dvltehb8j/image/upload/v1753353064/msa-logo_ln09co.png"
              alt="Mangla Sports"
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-mangla-gold mb-2">Mangla Sports</h1>
          <p className="text-gray-600 dark:text-gray-400">Your Premier Shooting Sports Equipment Store</p>
        </div>

        {/* Verification Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 p-8">
          <div className="text-center">
            {verificationStatus === 'loading' && (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mangla-gold mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Verifying Your Email
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Please wait while we verify your email address...
                </p>
              </>
            )}

            {verificationStatus === 'success' && (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Email Verified Successfully!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {message}
                </p>
                <Button asChild className="w-full bg-mangla-gold hover:bg-mangla-blue text-white">
                  <Link to="/login">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go to Login
                  </Link>
                </Button>
              </>
            )}

            {verificationStatus === 'error' && (
              <>
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Verification Failed
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {message}
                </p>
                <div className="space-y-3">
                  <Button asChild className="w-full bg-mangla-gold hover:bg-mangla-blue text-white">
                    <Link to="/login">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Login
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/resend-verification">
                      <Mail className="w-4 h-4 mr-2" />
                      Resend Verification
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 Mangla Sports. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail; 