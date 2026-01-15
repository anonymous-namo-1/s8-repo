import { useCallback, useState } from 'react';
import { toast } from 'sonner';

// Direct Razorpay payment link
const RAZORPAY_PAYMENT_LINK = 'https://rzp.io/rzp/97EV1mGs';

export const useRazorpay = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const initiatePayment = useCallback((template) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      // Show info toast
      toast.success('Redirecting to payment page...', { duration: 2000 });

      // Redirect to Razorpay payment link
      setTimeout(() => {
        window.open(RAZORPAY_PAYMENT_LINK, '_blank');
        setIsProcessing(false);
      }, 500);

    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Failed to open payment page. Please try again.');
      setIsProcessing(false);
    }
  }, [isProcessing]);

  const loadRazorpayScript = useCallback(() => {
    return Promise.resolve(true);
  }, []);

  return {
    initiatePayment,
    loadRazorpayScript,
    isProcessing
  };
};
