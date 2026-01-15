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


# Singleton instance
_email_service: Optional[EmailService] = None


def get_email_service() -> EmailService:
    """Get or create email service singleton"""
    global _email_service
    if _email_service is None:
        _email_service = EmailService()
    return _email_service
