import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import apiClient from '../utils/api';

export const useRazorpay = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const initiatePayment = useCallback(async (template) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      // Get customer email
      const customerEmail = prompt(
        `Enter your email to receive the download link:\n\nPurchasing: ${template.name} for ₹${template.price.toLocaleString('en-IN')}`
      );

      if (!customerEmail || !customerEmail.trim()) {
        toast.error('Email is required to complete the purchase');
        setIsProcessing(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerEmail.trim())) {
        toast.error('Please enter a valid email address');
        setIsProcessing(false);
        return;
      }

      // Load Razorpay script
      toast.loading('Loading payment gateway...');
      const scriptLoaded = await loadRazorpayScript();
      toast.dismiss();

      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please refresh and try again.');
        setIsProcessing(false);
        return;
      }

      // Create order via backend
      toast.loading('Creating order...');
      const orderResponse = await apiClient.post('/orders/create', {
        template_id: template.slug,
        customer_email: customerEmail.trim(),
        customer_name: null
      });
      toast.dismiss();

      const orderData = orderResponse.data;

      // Configure Razorpay options
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.order_id,
        name: 'S8 Automation',
        description: template.name,
        image: '/logo.png', // Optional: Add your logo
        prefill: {
          email: customerEmail.trim()
        },
        theme: {
          color: '#3B82F6'
        },
        handler: async function (response) {
          // Payment successful - verify with backend
          try {
            toast.loading('Verifying payment...');

            const verifyResponse = await apiClient.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            toast.dismiss();

            if (verifyResponse.data.success) {
              toast.success(
                verifyResponse.data.message ||
                'Payment successful! Check your email for the download link.',
                { duration: 5000 }
              );
            } else {
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch (verifyError) {
            console.error('Payment verification error:', verifyError);
            toast.dismiss();
            toast.error(
              verifyError.response?.data?.detail ||
              'Payment verification failed. Please contact support with your order ID.'
            );
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function() {
            toast.info('Payment cancelled');
            setIsProcessing(false);
          }
        }
      };

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        toast.error(
          response.error.description ||
          'Payment failed. Please try again.'
        );
        setIsProcessing(false);
      });

      rzp.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.dismiss();
      toast.error(
        error.response?.data?.detail ||
        error.message ||
        'Failed to initiate payment. Please try again.'
      );
      setIsProcessing(false);
    }
  }, [isProcessing, loadRazorpayScript]);

  return {
    initiatePayment,
    loadRazorpayScript,
    isProcessing
  };
};
