from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


class UserModel(BaseModel):
    """User model for storing user information"""
    email: EmailStr
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    purchases: List[str] = Field(default_factory=list)  # List of template_ids


class OTPModel(BaseModel):
    """OTP model for storing OTP verification data"""
    email: EmailStr
    otp: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime
    verified: bool = False


class SendOTPRequest(BaseModel):
    """Request model for sending OTP"""
    email: EmailStr


class VerifyOTPRequest(BaseModel):
    """Request model for verifying OTP"""
    email: EmailStr
    otp: str


class AuthResponse(BaseModel):
    """Response model for authentication"""
    success: bool
    message: str
    token: Optional[str] = None
    user: Optional[dict] = None


class UserPurchasesResponse(BaseModel):
    """Response model for user purchases"""
    email: str
    purchases: List[str]
    assets: List[dict]
