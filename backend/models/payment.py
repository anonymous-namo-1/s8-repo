from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class OrderCreateRequest(BaseModel):
    """Request model for creating a new order"""
    template_id: str = Field(..., description="Product/template identifier")
    customer_email: EmailStr = Field(..., description="Customer email address")
    customer_name: Optional[str] = Field(None, description="Customer name")


class OrderResponse(BaseModel):
    """Response model for order creation"""
    order_id: str = Field(..., description="Razorpay order ID")
    amount: int = Field(..., description="Amount in paise")
    currency: str = Field(..., description="Currency code")
    key_id: str = Field(..., description="Razorpay key ID for frontend")
    receipt: str = Field(..., description="Internal receipt number")


class PaymentVerificationRequest(BaseModel):
    """Request model for payment verification"""
    razorpay_order_id: str = Field(..., description="Razorpay order ID")
    razorpay_payment_id: str = Field(..., description="Razorpay payment ID")
    razorpay_signature: str = Field(..., description="Payment signature")


class PaymentVerificationResponse(BaseModel):
    """Response model for payment verification"""
    success: bool = Field(..., description="Whether verification succeeded")
    message: str = Field(..., description="Status message")
    order_id: str = Field(..., description="Order ID")


class OrderModel(BaseModel):
    """Database model for orders"""
    order_id: str = Field(..., description="Razorpay order ID")
    receipt: str = Field(..., description="Internal receipt number")
    amount: int = Field(..., description="Amount in paise")
    currency: str = Field(default="INR", description="Currency code")
    status: str = Field(default="created", description="Order status: created, paid, failed")
    template_id: str = Field(..., description="Product/template identifier")
    customer_email: EmailStr = Field(..., description="Customer email")
    customer_name: Optional[str] = Field(None, description="Customer name")
    payment_id: Optional[str] = Field(None, description="Razorpay payment ID")
    download_token: Optional[str] = Field(None, description="Secure download token")
    download_token_expires: Optional[datetime] = Field(None, description="Token expiry time")
    download_count: int = Field(default=0, description="Number of downloads")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[dict] = Field(default_factory=dict, description="Additional metadata")

    class Config:
        json_schema_extra = {
            "example": {
                "order_id": "order_MfyGhjkl123456",
                "receipt": "receipt_123456",
                "amount": 9900,
                "currency": "INR",
                "status": "created",
                "template_id": "automation-workflows",
                "customer_email": "customer@example.com",
                "customer_name": "John Doe",
                "payment_id": None,
                "download_token": None,
                "download_token_expires": None,
                "download_count": 0,
                "metadata": {}
            }
        }
