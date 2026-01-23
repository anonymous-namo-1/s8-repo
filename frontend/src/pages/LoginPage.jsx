import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { SEO } from '../components/SEO';

import { toast, Toaster } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Mail, KeyRound, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, sendOTP, verifyOTP } = useAuth();

  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/my-assets');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await sendOTP(email);
      if (response.success) {
        toast.success('OTP sent! Check your email.');
        setStep('otp');
        setCountdown(60);
      } else {
        toast.error(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await verifyOTP(email, otp);
      if (response.success) {
        toast.success('Login successful!');
        navigate('/my-assets');
      } else {
        toast.error(response.message || 'Invalid OTP');
      }
    } catch (error) {
      toast.error('Invalid or expired OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setIsSubmitting(true);
    try {
      const response = await sendOTP(email);
      if (response.success) {
        toast.success('New OTP sent!');
        setCountdown(60);
        setOtp('');
      } else {
        toast.error(response.message || 'Failed to resend OTP');
      }
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setStep('email');
    setOtp('');
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-b from-white via-gray-50/30 to-white">
      
      <SEO
        title="Sign In"
        description="Sign in to access your purchased Syntheight workflows and downloads."
        keywords="login, sign in, my assets, syntheight"
        url="https://syntheight.com/login"
      />
      <Header />
      <main className="flex-1 flex items-center justify-center pt-20 pb-20 px-4">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {step === 'email' ? (
              <motion.div
                key="email"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Glass Card Container */}
                <div className="relative bg-white/80 backdrop-blur-2xl border border-black/5 rounded-3xl p-8 sm:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
                  {/* Decorative gradient */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-gray-100 to-transparent rounded-full blur-3xl opacity-50" />
                  
                  <div className="relative">
                    {/* Icon */}
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                      className="flex justify-center mb-8"
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                        <Mail className="w-9 h-9" />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.4 }}
                    >
                      <h1 className="text-3xl font-bold tracking-tight mb-2 text-center">
                        Welcome Back
                      </h1>
                      <p className="text-muted-foreground mb-8 text-center">
                        Sign in to access your purchased assets
                      </p>
                    </motion.div>

                    <motion.form 
                      onSubmit={handleSendOTP} 
                      className="space-y-5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                        <div className="relative">
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-14 px-5 bg-white/70 border-gray-200 rounded-xl text-base shadow-sm focus:shadow-md focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all duration-300"
                            autoComplete="email"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        variant="brutal"
                        size="lg"
                        className="w-full h-14 text-base rounded-xl shadow-lg hover:shadow-xl"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </span>
                        ) : (
                          'Send Login Code'
                        )}
                      </Button>
                    </motion.form>

                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground"
                    >
                      <Shield className="w-4 h-4" />
                      <span>We'll send a 6-digit code to verify your identity</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Back Button */}
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  onClick={handleBack}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-all duration-200 hover:-translate-x-0.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to email
                </motion.button>

                {/* Glass Card Container */}
                <div className="relative bg-white/80 backdrop-blur-2xl border border-black/5 rounded-3xl p-8 sm:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-gray-100 to-transparent rounded-full blur-3xl opacity-50" />
                  
                  <div className="relative">
                    {/* Icon */}
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                      className="flex justify-center mb-8"
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                        <KeyRound className="w-9 h-9" />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.4 }}
                    >
                      <h1 className="text-3xl font-bold tracking-tight mb-2 text-center">
                        Enter Code
                      </h1>
                      <p className="text-muted-foreground mb-8 text-center">
                        We sent a verification code to<br />
                        <span className="font-semibold text-foreground">{email}</span>
                      </p>
                    </motion.div>

                    <motion.form 
                      onSubmit={handleVerifyOTP} 
                      className="space-y-5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="otp" className="text-sm font-medium">Verification code</Label>
                        <div className="relative">
                          <Input
                            id="otp"
                            type="text"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="h-16 px-6 bg-white/70 border-gray-200 rounded-xl text-center text-3xl tracking-[0.4em] font-bold shadow-sm focus:shadow-md focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all duration-300 placeholder:text-gray-300 placeholder:tracking-[0.4em]"
                            maxLength={6}
                            autoComplete="one-time-code"
                            autoFocus
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        variant="brutal"
                        size="lg"
                        className="w-full h-14 text-base rounded-xl shadow-lg hover:shadow-xl"
                        disabled={isSubmitting || otp.length !== 6}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Verifying...
                          </span>
                        ) : (
                          'Verify & Sign In'
                        )}
                      </Button>
                    </motion.form>

                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="mt-8 text-center"
                    >
                      <p className="text-sm text-muted-foreground">
                        Didn't receive the code?{' '}
                        {countdown > 0 ? (
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground/70">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-xs font-medium">{countdown}</span>
                            seconds
                          </span>
                        ) : (
                          <button
                            onClick={handleResendOTP}
                            className="font-medium text-foreground underline underline-offset-4 hover:no-underline transition-all"
                            disabled={isSubmitting}
                          >
                            Resend code
                          </button>
                        )}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
      <Toaster position="top-center" richColors />
    </div>
  );
}
