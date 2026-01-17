import logging
import os
from fastapi import APIRouter, HTTPException, Request
from motor.motor_asyncio import AsyncIOMotorDatabase

from models.payment import (
    OrderCreateRequest,
    OrderResponse,
    PaymentVerificationRequest,
    PaymentVerificationResponse
)
from services.razorpay_service import get_razorpay_service
from services.email_service import get_email_service
from services.order_service import get_order_service

logger = logging.getLogger(__name__)

# Template pricing (in paise: ₹99 = 9900 paise)
TEMPLATE_PRICING = {
    "automation-workflows": 9900,  # ₹99
    "whatsapp-automation-workflows": 2900,  # ₹29
}


def create_payment_router(db: AsyncIOMotorDatabase) -> APIRouter:
    """
    Create payment routes

    Args:
        db: MongoDB database instance

    Returns:
        APIRouter with payment endpoints
    """
    router = APIRouter(prefix="/api", tags=["payments"])

    razorpay_service = get_razorpay_service()
    email_service = get_email_service()
    order_service = get_order_service(db)

    @router.post("/orders/create", response_model=OrderResponse)
    async def create_order(request: OrderCreateRequest):
        """
        Create a new Razorpay order

        Args:
            request: Order creation request

        Returns:
            Order details including Razorpay order ID
        """
        try:
            # Get template price
            amount = TEMPLATE_PRICING.get(request.template_id)
            if not amount:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid template_id: {request.template_id}"
                )

            # Create order in Razorpay
            razorpay_order = razorpay_service.create_order(
                amount=amount,
                receipt=f"order_{request.template_id}",
                metadata={
                    "template_id": request.template_id,
                    "customer_email": request.customer_email
                }
            )

            # Store order in database
            await order_service.create_order(
                order_id=razorpay_order["id"],
                amount=amount,
                template_id=request.template_id,
                customer_email=request.customer_email,
                customer_name=request.customer_name
            )

            logger.info(
                f"Order created: {razorpay_order['id']} for {request.customer_email}"
            )

            return OrderResponse(
                order_id=razorpay_order["id"],
                amount=razorpay_order["amount"],
                currency=razorpay_order["currency"],
                key_id=razorpay_service.get_key_id(),
                receipt=razorpay_order["receipt"]
            )

        except ValueError as e:
            logger.error(f"Validation error: {str(e)}")
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            logger.error(f"Failed to create order: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Failed to create order. Please try again."
            )

    @router.post("/payments/verify", response_model=PaymentVerificationResponse)
    async def verify_payment(request: PaymentVerificationRequest):
        """
        Verify payment signature and process successful payment

        Args:
            request: Payment verification request with Razorpay IDs and signature

        Returns:
            Verification result
        """
        try:
            # Verify signature
            is_valid = razorpay_service.verify_payment_signature(
                order_id=request.razorpay_order_id,
                payment_id=request.razorpay_payment_id,
                signature=request.razorpay_signature
            )

            if not is_valid:
                logger.warning(
                    f"Invalid payment signature for order: {request.razorpay_order_id}"
                )
                raise HTTPException(
                    status_code=400,
                    detail="Payment verification failed. Invalid signature."
                )

            # Get order from database
            order = await order_service.get_order_by_order_id(
                request.razorpay_order_id
            )
            if not order:
                raise HTTPException(
                    status_code=404,
                    detail="Order not found"
                )

            # Mark order as paid and generate download token
            expiry_hours = int(os.getenv("DOWNLOAD_LINK_EXPIRY_HOURS", "48"))
            updated_order = await order_service.mark_order_paid(
                order_id=request.razorpay_order_id,
                payment_id=request.razorpay_payment_id,
                expiry_hours=expiry_hours
            )

            if not updated_order:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to update order"
                )

            # Generate download link
            frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
            download_link = f"{frontend_url}/api/downloads/{updated_order.download_token}"

            # Send email with download link
            email_sent = await email_service.send_download_email(
                to_email=updated_order.customer_email,
                customer_name=updated_order.customer_name,
                download_link=download_link,
                order_id=updated_order.order_id,
                expiry_hours=expiry_hours
            )

            if not email_sent:
                logger.error(
                    f"Failed to send email for order: {updated_order.order_id}"
                )
                # Don't fail the payment, just log the error
                # Admin can manually resend the email

            logger.info(
                f"Payment verified and processed: {request.razorpay_order_id}"
            )

            return PaymentVerificationResponse(
                success=True,
                message="Payment successful! Check your email for the download link.",
                order_id=request.razorpay_order_id
            )

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Payment verification error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Payment verification failed. Please contact support."
            )

    @router.get("/downloads/{download_token}")
    async def download_file(download_token: str):
        """
        Handle file download using secure token

        Args:
            download_token: Secure download token

        Returns:
            File download or redirect to S3
        """
        try:
            # Get order by download token
            order = await order_service.get_order_by_download_token(download_token)

            if not order:
                raise HTTPException(
                    status_code=404,
                    detail="Download link not found or has expired"
                )

            # Validate token
            if not order_service.is_download_token_valid(order):
                raise HTTPException(
                    status_code=404,
                    detail="Download link has expired or is invalid"
                )

            # Increment download count
            await order_service.increment_download_count(order.order_id)

            # For MVP, return a simple message
            # In production, this would redirect to S3 or serve the actual file
            logger.info(
                f"Download requested for order {order.order_id} "
                f"(count: {order.download_count + 1})"
            )

            # TODO: Implement actual file serving
            # Option 1: Generate S3 pre-signed URL and redirect
            # Option 2: Stream file from GridFS
            # Option 3: Serve static file from filesystem

            return {
                "message": "Download ready",
                "order_id": order.order_id,
                "template_id": order.template_id,
                "download_count": order.download_count + 1,
                "note": "File download implementation pending. Add S3 or GridFS integration."
            }

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Download error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Download failed. Please contact support."
            )

    @router.post("/payments/webhook")
    async def razorpay_webhook(request: Request):
        """
        Handle Razorpay webhook events

        Args:
            request: Raw request with webhook payload

        Returns:
            Success response
        """
        try:
            # Get raw body and signature
            body = await request.body()
            signature = request.headers.get("X-Razorpay-Signature", "")

            # Verify webhook signature
            is_valid = razorpay_service.verify_webhook_signature(
                payload=body.decode("utf-8"),
                signature=signature
            )

            if not is_valid:
                logger.warning("Invalid webhook signature")
                raise HTTPException(status_code=400, detail="Invalid signature")

            # Parse webhook payload
            payload = await request.json()
            event = payload.get("event")
            logger.info(f"Webhook received: {event}")

            # Handle different webhook events
            if event == "payment.authorized":
                # Payment was authorized (card charged successfully)
                payment = payload.get("payload", {}).get("payment", {}).get("entity", {})
                order_id = payment.get("order_id")
                payment_id = payment.get("id")

                if order_id and payment_id:
                    logger.info(f"Payment authorized webhook: {order_id}")
                    # The verification endpoint already handles this
                    # This is a backup in case the frontend verification fails

            elif event == "payment.failed":
                # Payment failed
                payment = payload.get("payload", {}).get("payment", {}).get("entity", {})
                order_id = payment.get("order_id")

                if order_id:
                    await order_service.mark_order_failed(order_id)
                    logger.info(f"Payment failed webhook: {order_id}")

            return {"status": "ok"}

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Webhook processing error: {str(e)}")
            raise HTTPException(status_code=500, detail="Webhook processing failed")

    return router
