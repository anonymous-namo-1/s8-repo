import { useCallback, useState } from 'react';
import { toast } from 'sonner';

// Default Razorpay payment link (for automation-workflows)
const DEFAULT_PAYMENT_LINK = 'https://rzp.io/rzp/97EV1mGs';

export const useRazorpay = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const initiatePayment = useCallback((template) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      // Show info toast
      toast.success('Redirecting to payment page...', { duration: 2000 });

      // Use template-specific payment URL if available, otherwise use default
      const paymentUrl = template?.paymentUrl || DEFAULT_PAYMENT_LINK;

      // Redirect to Razorpay payment link
      setTimeout(() => {
        window.open(paymentUrl, '_blank');
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
