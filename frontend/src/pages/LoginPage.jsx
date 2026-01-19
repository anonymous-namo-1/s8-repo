import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast, Toaster } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Mail, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, sendOTP, verifyOTP } = useAuth();

  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/my-assets');
    }
  }, [isAuthenticated, navigate]);

  // Countdown timer for resend OTP
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

    // Basic email validation
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
        setCountdown(60); // 60 second countdown for resend
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-16 pb-16">
        <div className="w-full max-w-sm px-6">
          <AnimatePresence mode="wait">
            {step === 'email' ? (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-foreground text-background flex items-center justify-center">
                    <Mail className="w-8 h-8" />
                  </div>
                </div>

                <h1 className="text-2xl font-bold tracking-tight mb-2 text-center">
                  Sign In
                </h1>
                <p className="text-sm text-muted-foreground mb-8 text-center">
                  Access your purchased assets
                </p>

                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-border bg-background h-12"
                      autoComplete="email"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="brutal"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Login Code'}
                  </Button>
                </form>

                <p className="text-xs text-muted-foreground mt-6 text-center">
                  We'll send a 6-digit code to your email to sign you in.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors rounded-full"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-foreground text-background flex items-center justify-center">
                    <KeyRound className="w-8 h-8" />
                  </div>
                </div>

                <h1 className="text-2xl font-bold tracking-tight mb-2 text-center">
                  Enter Code
                </h1>
                <p className="text-sm text-muted-foreground mb-8 text-center">
                  We sent a code to <span className="font-medium text-foreground">{email}</span>
                </p>

                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-sm">6-digit code</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="border-border bg-background h-14 text-center text-2xl tracking-[0.5em] font-bold"
                      maxLength={6}
                      autoComplete="one-time-code"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="brutal"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting || otp.length !== 6}
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify & Sign In'}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-xs text-muted-foreground">
                    Didn't receive the code?{' '}
                    {countdown > 0 ? (
                      <span className="text-muted-foreground">
                        Resend in {countdown}s
                      </span>
                    ) : (
                      <button
                        onClick={handleResendOTP}
                        className="text-foreground underline hover:no-underline rounded-full"
                        disabled={isSubmitting}
                      >
                        Resend code
                      </button>
                    )}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}
