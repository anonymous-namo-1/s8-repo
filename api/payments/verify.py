from http.server import BaseHTTPRequestHandler
import json
import os
import razorpay
import resend

# Initialize clients
def get_razorpay_client():
    key_id = os.environ.get('RAZORPAY_KEY_ID')
    key_secret = os.environ.get('RAZORPAY_KEY_SECRET')
    if not key_id or not key_secret:
        raise ValueError("Razorpay credentials not configured")
    return razorpay.Client(auth=(key_id, key_secret))

# Google Drive download link
DOWNLOAD_LINK = "https://drive.google.com/drive/u/1/folders/1-y-_Ck_JAcWCSBdTf1pedORN3MQZ1uyR"

def send_download_email(customer_email, order_id):
    """Send email with download link"""
    try:
        api_key = os.environ.get('RESEND_API_KEY')
        from_email = os.environ.get('FROM_EMAIL', 'onboarding@resend.dev')

        if not api_key:
            print("Warning: RESEND_API_KEY not configured")
            return False

        resend.api_key = api_key

        html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="background-color: #3B82F6; padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Thank You for Your Purchase!</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="font-size: 16px; color: #333333; line-height: 1.6; margin: 0 0 20px 0;">
                                Hi there,
                            </p>
                            <p style="font-size: 16px; color: #333333; line-height: 1.6; margin: 0 0 20px 0;">
                                Thank you for purchasing <strong>10,000+ Automation Workflows</strong>! Your order has been confirmed.
                            </p>
                            <p style="font-size: 14px; color: #666666; margin: 0 0 30px 0;">
                                Order ID: <strong>{order_id}</strong>
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="{DOWNLOAD_LINK}"
                                           style="display: inline-block; padding: 15px 40px; background-color: #3B82F6; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                                            Access Your Workflows
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="font-size: 14px; color: #666666; line-height: 1.6; margin: 20px 0 0 0;">
                                If the button doesn't work, copy and paste this link:
                            </p>
                            <p style="font-size: 12px; color: #3B82F6; word-break: break-all; margin: 10px 0 0 0;">
                                {DOWNLOAD_LINK}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="font-size: 14px; color: #666666; margin: 0 0 10px 0;">
                                Need help? Contact us at <a href="mailto:support@syntheight.com" style="color: #3B82F6;">support@syntheight.com</a>
                            </p>
                            <p style="font-size: 12px; color: #999999; margin: 10px 0 0 0;">
                                This is an automated email. Please do not reply.
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

        text_body = f"""
Thank you for purchasing 10,000+ Automation Workflows!

Order ID: {order_id}

Access your workflows here:
{DOWNLOAD_LINK}

Need help? Contact us at support@syntheight.com
"""

        params = {
            "from": from_email,
            "to": [customer_email],
            "subject": "Your Purchase: 10,000+ Automation Workflows",
            "html": html_body,
            "text": text_body
        }

        response = resend.Emails.send(params)
        print(f"Email sent successfully to {customer_email}")
        return True

    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Parse request body
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))

            # Get payment details
            order_id = data.get('razorpay_order_id')
            payment_id = data.get('razorpay_payment_id')
            signature = data.get('razorpay_signature')

            if not all([order_id, payment_id, signature]):
                self.send_error_response(400, "Missing required fields")
                return

            # Verify signature
            client = get_razorpay_client()

            params_dict = {
                'razorpay_order_id': order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature': signature
            }

            try:
                client.utility.verify_payment_signature(params_dict)
                print(f"Payment verified: {order_id}")
            except razorpay.errors.SignatureVerificationError:
                self.send_error_response(400, "Invalid payment signature")
                return

            # Fetch payment to get customer email
            payment = client.payment.fetch(payment_id)
            customer_email = payment.get('email', '')

            # If no email in payment, try to get from order notes
            if not customer_email:
                try:
                    order = client.order.fetch(order_id)
                    customer_email = order.get('notes', {}).get('customer_email', '')
                except:
                    pass

            # Send email with download link
            if customer_email:
                email_sent = send_download_email(customer_email, order_id)
                if not email_sent:
                    print(f"Warning: Failed to send email to {customer_email}")
            else:
                print("Warning: No customer email found")

            # Return success response
            response = {
                "success": True,
                "message": "Payment successful! Check your email for the download link.",
                "order_id": order_id
            }

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())

        except Exception as e:
            print(f"Error: {str(e)}")
            self.send_error_response(500, f"Payment verification failed: {str(e)}")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def send_error_response(self, code, message):
        self.send_response(code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({"detail": message}).encode())
