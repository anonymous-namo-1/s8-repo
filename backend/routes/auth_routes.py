import logging
import os
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, HTTPException, Depends, Header
from jose import jwt, JWTError

from models.user import (
    SendOTPRequest,
    VerifyOTPRequest,
    AuthResponse,
    UserPurchasesResponse
)
from services.otp_service import OTPService, get_otp_service
from services.email_service import EmailService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'syntheight-jwt-secret-key-change-in-production')
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_DAYS = 30

# Download URLs for each product
DOWNLOAD_URLS = {
    "automation-workflows": "https://drive.google.com/drive/u/1/folders/1-y-_Ck_JAcWCSBdTf1pedORN3MQZ1uyR",
    "whatsapp-automation-workflows": "https://drive.google.com/drive/u/1/folders/1YpeUgwiNT9MingxS4sBEwVUbBQG7HuI-"
}


def create_jwt_token(email: str) -> str:
    """
    Create a JWT token for the user

    Args:
        email: User email

    Returns:
        JWT token string
    """
    expires = datetime.utcnow() + timedelta(days=JWT_EXPIRY_DAYS)
    payload = {
        "email": email,
        "exp": expires,
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_jwt_token(token: str) -> Optional[str]:
    """
    Verify JWT token and extract email

    Args:
        token: JWT token

    Returns:
        Email if valid, None otherwise
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload.get("email")
    except JWTError as e:
        logger.warning(f"JWT verification failed: {e}")
        return None


async def get_current_user_email(authorization: str = Header(None)) -> str:
    """
    Dependency to get current user email from JWT token

    Args:
        authorization: Authorization header

    Returns:
        User email

    Raises:
        HTTPException: If token is invalid or missing
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header format")

    token = authorization[7:]  # Remove "Bearer " prefix
    email = verify_jwt_token(token)

    if not email:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return email


# Dependency to get OTP service
otp_service_instance: Optional[OTPService] = None
email_service_instance: Optional[EmailService] = None


def set_services(otp_service: OTPService, email_service: EmailService):
    """Set service instances for routes"""
    global otp_service_instance, email_service_instance
    otp_service_instance = otp_service
    email_service_instance = email_service


def get_services():
    """Get service instances"""
    if not otp_service_instance:
        raise HTTPException(status_code=500, detail="Services not initialized")
    return otp_service_instance, email_service_instance


@router.post("/send-otp", response_model=AuthResponse)
async def send_otp(request: SendOTPRequest):
    """
    Send OTP to user's email

    Args:
        request: SendOTPRequest with email

    Returns:
        AuthResponse indicating success or failure
    """
    otp_service, email_service = get_services()

    try:
        # Create OTP
        otp = await otp_service.create_otp(request.email)

        # Send OTP email
        if email_service:
            await email_service.send_otp_email(
                to_email=request.email,
                otp_code=otp.otp
            )

        logger.info(f"OTP sent to {request.email}")

        return AuthResponse(
            success=True,
            message="OTP sent successfully. Please check your email."
        )

    except Exception as e:
        logger.error(f"Error sending OTP: {e}")
        raise HTTPException(status_code=500, detail="Failed to send OTP")


@router.post("/verify-otp", response_model=AuthResponse)
async def verify_otp(request: VerifyOTPRequest):
    """
    Verify OTP and return JWT token

    Args:
        request: VerifyOTPRequest with email and otp

    Returns:
        AuthResponse with JWT token if successful
    """
    otp_service, _ = get_services()

    try:
        # Verify OTP
        is_valid = await otp_service.verify_otp(request.email, request.otp)

        if not is_valid:
            return AuthResponse(
                success=False,
                message="Invalid or expired OTP. Please try again."
            )

        # Get or create user
        user = await otp_service.get_or_create_user(request.email)

        # Create JWT token
        token = create_jwt_token(request.email)

        logger.info(f"User {request.email} logged in successfully")

        return AuthResponse(
            success=True,
            message="Login successful",
            token=token,
            user={
                "email": user.email,
                "purchases": user.purchases
            }
        )

    except Exception as e:
        logger.error(f"Error verifying OTP: {e}")
        raise HTTPException(status_code=500, detail="Failed to verify OTP")


@router.get("/me", response_model=UserPurchasesResponse)
async def get_current_user(email: str = Depends(get_current_user_email)):
    """
    Get current user's information and purchases

    Args:
        email: User email from JWT token

    Returns:
        UserPurchasesResponse with user info and assets
    """
    otp_service, _ = get_services()

    try:
        user = await otp_service.get_user_by_email(email)

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Build assets list with download URLs
        assets = []
        for template_id in user.purchases:
            download_url = DOWNLOAD_URLS.get(template_id)
            if download_url:
                assets.append({
                    "template_id": template_id,
                    "download_url": download_url
                })

        return UserPurchasesResponse(
            email=user.email,
            purchases=user.purchases,
            assets=assets
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting user info: {e}")
        raise HTTPException(status_code=500, detail="Failed to get user info")


@router.get("/download/{template_id}")
async def get_download_link(
    template_id: str,
    email: str = Depends(get_current_user_email)
):
    """
    Get download link for a purchased product

    Args:
        template_id: Product template ID
        email: User email from JWT token

    Returns:
        Download URL if user has purchased the product
    """
    otp_service, _ = get_services()

    try:
        user = await otp_service.get_user_by_email(email)

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Check if user has purchased this product
        if template_id not in user.purchases:
            raise HTTPException(
                status_code=403,
                detail="You have not purchased this product"
            )

        # Get download URL
        download_url = DOWNLOAD_URLS.get(template_id)
        if not download_url:
            raise HTTPException(status_code=404, detail="Download not found")

        return {
            "success": True,
            "template_id": template_id,
            "download_url": download_url
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting download link: {e}")
        raise HTTPException(status_code=500, detail="Failed to get download link")
