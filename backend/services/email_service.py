import os
import logging
from typing import Optional
import resend

logger = logging.getLogger(__name__)


class EmailService:
    """Service for sending emails using Resend"""

    def __init__(self):
        """Initialize Resend with API key from environment"""
        self.api_key = os.getenv("RESEND_API_KEY")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@example.com")

        if not self.api_key:
            logger.warning("RESEND_API_KEY not set - emails will not be sent")
        else:
            resend.api_key = self.api_key
            logger.info("Resend email service initialized")

    async def send_download_email(
        self,
        to_email: str,
        customer_name: Optional[str],
        download_link: str,
        order_id: str,
        expiry_hours: int = 48
    ) -> bool:
        """
        Send download link email to customer

        Args:
            to_email: Customer email address
            customer_name: Customer name (optional)
            download_link: Secure download URL
            order_id: Order ID for reference
            expiry_hours: Hours until download link expires

        Returns:
            True if email sent successfully, False otherwise
        """
        if not self.api_key:
            logger.error("Cannot send email: RESEND_API_KEY not configured")
            return False

        try:
            greeting = f"Hi {customer_name}," if customer_name else "Hi there,"

            # Create HTML email body
            html_body = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Your Purchase Confirmation</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="background-color: #3B82F6; padding: 30px; text-align: center;">
                                        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Thank You for Your Purchase!</h1>
                                    </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <p style="font-size: 16px; color: #333333; line-height: 1.6; margin: 0 0 20px 0;">
                                            {greeting}
                                        </p>

                                        <p style="font-size: 16px; color: #333333; line-height: 1.6; margin: 0 0 20px 0;">
                                            Thank you for purchasing <strong>10,000+ Automation Workflows</strong>! Your order has been confirmed and is ready for download.
                                        </p>

                                        <p style="font-size: 14px; color: #666666; margin: 0 0 30px 0;">
                                            Order ID: <strong>{order_id}</strong>
                                        </p>

                                        <!-- Download Button -->
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" style="padding: 20px 0;">
                                                    <a href="{download_link}"
                                                       style="display: inline-block; padding: 15px 40px; background-color: #3B82F6; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                                                        Download Now
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>

                                        <!-- Important Notice -->
                                        <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0;">
                                            <p style="margin: 0; font-size: 14px; color: #92400E;">
                                                <strong>Important:</strong> This download link will expire in <strong>{expiry_hours} hours</strong>. Please download your files before the link expires.
                                            </p>
                                        </div>

                                        <p style="font-size: 14px; color: #666666; line-height: 1.6; margin: 20px 0 0 0;">
                                            If the button doesn't work, you can copy and paste this link into your browser:
                                        </p>

                                        <p style="font-size: 12px; color: #3B82F6; word-break: break-all; margin: 10px 0 0 0;">
                                            {download_link}
                                        </p>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                        <p style="font-size: 14px; color: #666666; margin: 0 0 10px 0;">
                                            Need help? Contact us at <a href="mailto:support@example.com" style="color: #3B82F6;">support@example.com</a>
                                        </p>

                                        <p style="font-size: 12px; color: #999999; margin: 10px 0 0 0;">
                                            This is an automated email. Please do not reply to this message.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """

            # Plain text version
            text_body = f"""
{greeting}

Thank you for purchasing 10,000+ Automation Workflows! Your order has been confirmed and is ready for download.

Order ID: {order_id}

Download your files here:
{download_link}

IMPORTANT: This download link will expire in {expiry_hours} hours. Please download your files before the link expires.

Need help? Contact us at support@example.com

This is an automated email. Please do not reply to this message.
            """

            # Send email using Resend
            params = {
                "from": self.from_email,
                "to": [to_email],
                "subject": "Your Purchase: 10,000+ Automation Workflows",
                "html": html_body,
                "text": text_body
            }

            response = resend.Emails.send(params)
            logger.info(f"Email sent successfully to {to_email}, Message ID: {response.get('id')}")
            return True

        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False

    async def send_otp_email(
        self,
        to_email: str,
        otp_code: str
    ) -> bool:
        """
        Send OTP email to user for login verification

        Args:
            to_email: User email address
            otp_code: Generated OTP code

        Returns:
            True if email sent successfully, False otherwise
        """
        if not self.api_key:
            logger.error("Cannot send email: RESEND_API_KEY not configured")
            # In development, log OTP to console
            logger.info(f"[DEV] OTP for {to_email}: {otp_code}")
            return True

        try:
            # Create HTML email body
            html_body = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Your Login Code</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="background-color: #000000; padding: 30px; text-align: center;">
                                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Syntheight</h1>
                                    </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                    <td style="padding: 40px 30px; text-align: center;">
                                        <h2 style="font-size: 20px; color: #333333; margin: 0 0 20px 0;">
                                            Your Login Code
                                        </h2>

                                        <p style="font-size: 16px; color: #666666; line-height: 1.6; margin: 0 0 30px 0;">
                                            Enter this code to sign in to your Syntheight account:
                                        </p>

                                        <!-- OTP Code -->
                                        <div style="background-color: #f4f4f4; padding: 20px; display: inline-block; border-radius: 8px; margin: 20px 0;">
                                            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #000000;">
                                                {otp_code}
                                            </span>
                                        </div>

                                        <p style="font-size: 14px; color: #999999; margin: 30px 0 0 0;">
                                            This code will expire in 5 minutes.
                                        </p>

                                        <p style="font-size: 14px; color: #999999; margin: 10px 0 0 0;">
                                            If you didn't request this code, you can safely ignore this email.
                                        </p>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                                        <p style="font-size: 12px; color: #999999; margin: 0;">
                                            &copy; 2024 Syntheight. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """

            # Plain text version
            text_body = f"""
Your Syntheight Login Code

Enter this code to sign in: {otp_code}

This code will expire in 5 minutes.

If you didn't request this code, you can safely ignore this email.

© 2024 Syntheight. All rights reserved.
            """

            # Send email using Resend
            params = {
                "from": self.from_email,
                "to": [to_email],
                "subject": f"Your Syntheight login code: {otp_code}",
                "html": html_body,
                "text": text_body
            }

            response = resend.Emails.send(params)
            logger.info(f"OTP email sent successfully to {to_email}, Message ID: {response.get('id')}")
            return True

        except Exception as e:
            logger.error(f"Failed to send OTP email to {to_email}: {str(e)}")
            return False

    async def send_contact_notification(
        self,
        admin_email: str,
        sender_name: str,
        sender_email: str,
        message: str
    ) -> bool:
        """
        Send contact form notification to admin

        Args:
            admin_email: Admin email to receive the notification
            sender_name: Name of the person who submitted the form
            sender_email: Email of the sender
            message: The message content

        Returns:
            True if email sent successfully, False otherwise
        """
        if not self.api_key:
            logger.error("Cannot send email: RESEND_API_KEY not configured")
            # In development, log to console
            logger.info(f"[DEV] Contact form from {sender_name} ({sender_email}): {message}")
            return True

        try:
            # Create HTML email body
            html_body = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Contact Form Submission</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="background-color: #000000; padding: 30px; text-align: center;">
                                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
                                    </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <h2 style="font-size: 18px; color: #333333; margin: 0 0 20px 0;">
                                            Contact Details
                                        </h2>

                                        <table width="100%" style="margin-bottom: 30px;">
                                            <tr>
                                                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                                                    <strong style="color: #666666;">Name:</strong>
                                                </td>
                                                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #333333;">
                                                    {sender_name}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                                                    <strong style="color: #666666;">Email:</strong>
                                                </td>
                                                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                                                    <a href="mailto:{sender_email}" style="color: #3B82F6;">{sender_email}</a>
                                                </td>
                                            </tr>
                                        </table>

                                        <h3 style="font-size: 16px; color: #333333; margin: 0 0 15px 0;">
                                            Message:
                                        </h3>
                                        <div style="background-color: #f9fafb; padding: 20px; border-left: 4px solid #000000;">
                                            <p style="margin: 0; color: #333333; line-height: 1.6; white-space: pre-wrap;">{message}</p>
                                        </div>

                                        <div style="margin-top: 30px;">
                                            <a href="mailto:{sender_email}?subject=Re: Your Syntheight Inquiry"
                                               style="display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; font-weight: bold;">
                                                Reply to {sender_name}
                                            </a>
                                        </div>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                                        <p style="font-size: 12px; color: #999999; margin: 0;">
                                            This email was sent from the Syntheight contact form.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """

            # Plain text version
            text_body = f"""
New Contact Form Submission

Name: {sender_name}
Email: {sender_email}

Message:
{message}

---
Reply to this person at: {sender_email}
            """

            # Send email using Resend
            params = {
                "from": self.from_email,
                "to": [admin_email],
                "reply_to": sender_email,
                "subject": f"[Syntheight Contact] Message from {sender_name}",
                "html": html_body,
                "text": text_body
            }

            response = resend.Emails.send(params)
            logger.info(f"Contact notification sent to {admin_email}, Message ID: {response.get('id')}")
            return True

        except Exception as e:
            logger.error(f"Failed to send contact notification: {str(e)}")
            return False


# Singleton instance
_email_service: Optional[EmailService] = None


def get_email_service() -> EmailService:
    """Get or create email service singleton"""
    global _email_service
    if _email_service is None:
        _email_service = EmailService()
    return _email_service
