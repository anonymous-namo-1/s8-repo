import razorpay
import os
import logging
from typing import Dict, Optional

logger = logging.getLogger(__name__)


class RazorpayService:
    """Service for handling Razorpay payment operations"""

    def __init__(self):
        """Initialize Razorpay client with credentials from environment"""
        self.key_id = os.getenv("RAZORPAY_KEY_ID")
        self.key_secret = os.getenv("RAZORPAY_KEY_SECRET")
        self.webhook_secret = os.getenv("RAZORPAY_WEBHOOK_SECRET")

        if not self.key_id or not self.key_secret:
            raise ValueError("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in environment")

        self.client = razorpay.Client(auth=(self.key_id, self.key_secret))
        logger.info("Razorpay client initialized successfully")

    def create_order(self, amount: int, receipt: str, metadata: Optional[Dict] = None) -> Dict:
        """
        Create a Razorpay order

        Args:
            amount: Amount in paise (₹99 = 9900 paise)
            receipt: Internal receipt number
            metadata: Additional notes/metadata

        Returns:
            Dict containing order details from Razorpay

        Raises:
            razorpay.errors.BadRequestError: If order creation fails
        """
        try:
            order_data = {
                "amount": amount,
                "currency": "INR",
                "receipt": receipt,
                "notes": metadata or {}
            }

            order = self.client.order.create(data=order_data)
            logger.info(f"Created Razorpay order: {order['id']}")
            return order

        except Exception as e:
            logger.error(f"Failed to create Razorpay order: {str(e)}")
            raise

    def verify_payment_signature(
        self,
        order_id: str,
        payment_id: str,
        signature: str
    ) -> bool:
        """
        Verify payment signature using Razorpay utility

        Args:
            order_id: Razorpay order ID
            payment_id: Razorpay payment ID
            signature: Payment signature from frontend

        Returns:
            True if signature is valid, False otherwise
        """
        try:
            params_dict = {
                'razorpay_order_id': order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature': signature
            }

            # This will raise SignatureVerificationError if invalid
            self.client.utility.verify_payment_signature(params_dict)
            logger.info(f"Payment signature verified for order: {order_id}")
            return True

        except razorpay.errors.SignatureVerificationError as e:
            logger.warning(f"Invalid payment signature for order {order_id}: {str(e)}")
            return False
        except Exception as e:
            logger.error(f"Error verifying payment signature: {str(e)}")
            return False

    def fetch_payment(self, payment_id: str) -> Optional[Dict]:
        """
        Fetch payment details from Razorpay

        Args:
            payment_id: Razorpay payment ID

        Returns:
            Payment details dict or None if not found
        """
        try:
            payment = self.client.payment.fetch(payment_id)
            logger.info(f"Fetched payment details: {payment_id}")
            return payment

        except Exception as e:
            logger.error(f"Failed to fetch payment {payment_id}: {str(e)}")
            return None

    def verify_webhook_signature(self, payload: str, signature: str) -> bool:
        """
        Verify webhook signature from Razorpay

        Args:
            payload: Raw webhook payload as string
            signature: X-Razorpay-Signature header value

        Returns:
            True if signature is valid, False otherwise
        """
        if not self.webhook_secret:
            logger.warning("RAZORPAY_WEBHOOK_SECRET not configured, skipping webhook verification")
            return False

        try:
            self.client.utility.verify_webhook_signature(
                payload,
                signature,
                self.webhook_secret
            )
            logger.info("Webhook signature verified successfully")
            return True

        except razorpay.errors.SignatureVerificationError as e:
            logger.warning(f"Invalid webhook signature: {str(e)}")
            return False
        except Exception as e:
            logger.error(f"Error verifying webhook signature: {str(e)}")
            return False

    def get_key_id(self) -> str:
        """Get Razorpay key ID for frontend use"""
        return self.key_id


# Singleton instance
_razorpay_service: Optional[RazorpayService] = None


def get_razorpay_service() -> RazorpayService:
    """Get or create Razorpay service singleton"""
    global _razorpay_service
    if _razorpay_service is None:
        _razorpay_service = RazorpayService()
    return _razorpay_service
