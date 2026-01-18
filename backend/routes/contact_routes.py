import logging
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from services.email_service import EmailService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/contact", tags=["Contact"])

# Service instance
email_service_instance = None


class ContactFormRequest(BaseModel):
    """Request model for contact form"""
    name: str
    email: EmailStr
    message: str


class ContactFormResponse(BaseModel):
    """Response model for contact form"""
    success: bool
    message: str


def set_email_service(email_service: EmailService):
    """Set email service instance for routes"""
    global email_service_instance
    email_service_instance = email_service


def get_email_service():
    """Get email service instance"""
    if not email_service_instance:
        raise HTTPException(status_code=500, detail="Email service not initialized")
    return email_service_instance


@router.post("/submit", response_model=ContactFormResponse)
async def submit_contact_form(request: ContactFormRequest):
    """
    Handle contact form submission

    Args:
        request: ContactFormRequest with name, email, and message

    Returns:
        ContactFormResponse indicating success or failure
    """
    email_service = get_email_service()

    # Validate inputs
    if not request.name.strip():
        raise HTTPException(status_code=400, detail="Name is required")
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message is required")
    if len(request.message) > 5000:
        raise HTTPException(status_code=400, detail="Message is too long")

    try:
        # Send notification email to admin
        admin_email = os.getenv("ADMIN_EMAIL", "syntheight@gmail.com")

        success = await email_service.send_contact_notification(
            admin_email=admin_email,
            sender_name=request.name.strip(),
            sender_email=request.email,
            message=request.message.strip()
        )

        if success:
            logger.info(f"Contact form submitted by {request.email}")
            return ContactFormResponse(
                success=True,
                message="Message sent successfully. We'll get back to you within 24 hours."
            )
        else:
            logger.error(f"Failed to send contact form email from {request.email}")
            raise HTTPException(
                status_code=500,
                detail="Failed to send message. Please try again or email us directly."
            )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Contact form error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Something went wrong. Please try again later."
        )
