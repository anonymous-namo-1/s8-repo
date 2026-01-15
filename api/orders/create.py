from http.server import BaseHTTPRequestHandler
import json
import os
import razorpay
from datetime import datetime
import uuid

# Initialize Razorpay client
def get_razorpay_client():
    key_id = os.environ.get('RAZORPAY_KEY_ID')
    key_secret = os.environ.get('RAZORPAY_KEY_SECRET')
    if not key_id or not key_secret:
        raise ValueError("Razorpay credentials not configured")
    return razorpay.Client(auth=(key_id, key_secret))

# Template pricing
TEMPLATE_PRICING = {
    "automation-workflows": 9900,  # ₹99 in paise
}

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Parse request body
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))

            # Validate input
            template_id = data.get('template_id')
            customer_email = data.get('customer_email')

            if not template_id or not customer_email:
                self.send_error_response(400, "Missing required fields")
                return

            # Get template price
            amount = TEMPLATE_PRICING.get(template_id)
            if not amount:
                self.send_error_response(400, f"Invalid template_id: {template_id}")
                return

            # Create Razorpay order
            client = get_razorpay_client()
            receipt = f"receipt_{int(datetime.utcnow().timestamp())}_{str(uuid.uuid4())[:8]}"

            order = client.order.create(data={
                "amount": amount,
                "currency": "INR",
                "receipt": receipt,
                "notes": {
                    "template_id": template_id,
                    "customer_email": customer_email
                }
            })

            # Return response
            response = {
                "order_id": order["id"],
                "amount": order["amount"],
                "currency": order["currency"],
                "key_id": os.environ.get('RAZORPAY_KEY_ID'),
                "receipt": receipt
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
            self.send_error_response(500, f"Failed to create order: {str(e)}")

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
