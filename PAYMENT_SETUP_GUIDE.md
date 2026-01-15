# Payment Integration Setup Guide

This guide will help you set up and test the Razorpay payment integration for your S8 Automation platform.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Environment Configuration](#environment-configuration)
4. [Testing](#testing)
5. [Deployment](#deployment)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### 1. Razorpay Account
- Sign up at [https://razorpay.com](https://razorpay.com)
- Complete KYC verification (required for live mode)
- Navigate to Dashboard → Settings → API Keys
- Copy your **Test** and **Live** API keys

### 2. Resend Account (Email Service)
- Sign up at [https://resend.com](https://resend.com)
- Verify your domain (or use their test domain for development)
- Create an API key from the dashboard
- Copy your API key

### 3. MongoDB
- Ensure MongoDB is running (local or cloud)
- Have your connection string ready

---

## Backend Setup

### Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

This installs:
- `razorpay==1.4.2` - Razorpay Python SDK
- `resend>=0.7.0` - Email service
- All existing dependencies

### Step 2: Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```bash
# MongoDB
MONGO_URL=mongodb://localhost:27017/
DB_NAME=s8_db

# CORS (add your frontend URL)
CORS_ORIGINS=http://localhost:3000,http://localhost:8000

# Razorpay (Test Mode - Start Here)
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_TEST_SECRET
RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET

# Resend Email
RESEND_API_KEY=re_YOUR_API_KEY
FROM_EMAIL=noreply@yourdomain.com

# Application
FRONTEND_URL=http://localhost:3000
DOWNLOAD_LINK_EXPIRY_HOURS=48
```

**Important:**
- Start with Razorpay **test mode** credentials (starts with `rzp_test_`)
- Use Resend's test domain initially: `onboarding@resend.dev`
- Keep your secret keys secure - never commit them to git

### Step 3: Start Backend Server

```bash
cd backend
python server.py
```

Or with uvicorn directly:

```bash
uvicorn server:app --reload --port 8000
```

The server should start at `http://localhost:8000`

---

## Environment Configuration

### Frontend Configuration

The frontend is already configured. Verify the API URL in `frontend/src/config/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
```

### Backend Routes

The following endpoints are now available:

1. **POST /api/orders/create**
   - Creates a Razorpay order
   - Input: `{ template_id, customer_email, customer_name }`
   - Returns: Order details for Razorpay checkout

2. **POST /api/payments/verify**
   - Verifies payment signature
   - Sends email with download link
   - Input: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }`

3. **GET /api/downloads/{token}**
   - Validates and serves downloads
   - Token-based secure access

4. **POST /api/payments/webhook**
   - Handles Razorpay webhooks
   - Processes async payment events

---

## Testing

### Test Mode Setup

Razorpay provides test cards that work in test mode:

**Successful Payment:**
- Card: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits
- Name: Any name

**Failed Payment:**
- Card: `4111 1111 1111 1234`

### Testing Flow

1. **Start Backend:**
   ```bash
   cd backend
   python server.py
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm start
   ```

3. **Complete a Test Purchase:**
   - Navigate to http://localhost:3000
   - Click "Buy Now" on the template
   - Enter your email address
   - Razorpay modal will open
   - Use test card: `4111 1111 1111 1111`
   - Complete payment
   - Check your email for download link

4. **Verify in Database:**
   ```bash
   # Connect to MongoDB
   mongosh
   use s8_db
   db.orders.find().pretty()
   ```

   You should see:
   - Order with status "paid"
   - Payment ID populated
   - Download token generated
   - Token expiry set

5. **Test Download Link:**
   - Click the download link from email
   - Should see download confirmation
   - Check download count incremented

### Testing Edge Cases

1. **Expired Token:**
   - Manually update token expiry in DB to past date
   - Try downloading - should fail with 404

2. **Invalid Signature:**
   - Modify signature in verification request
   - Should fail verification

3. **Email Failure:**
   - Set invalid RESEND_API_KEY
   - Payment should succeed but email will fail
   - Check logs for email error

---

## Database Indexes

For production, create indexes for better performance:

```javascript
// MongoDB shell
use s8_db

db.orders.createIndex({ "order_id": 1 }, { unique: true })
db.orders.createIndex({ "download_token": 1 })
db.orders.createIndex({ "customer_email": 1 })
db.orders.createIndex({ "created_at": 1 })
```

The order service includes a `create_indexes()` method you can call on startup.

---

## Deployment

### Moving to Production

1. **Get Live Razorpay Keys:**
   - Complete KYC on Razorpay dashboard
   - Generate **Live** API keys (start with `rzp_live_`)
   - Update `.env` with live keys

2. **Configure Webhooks:**
   - Go to Razorpay Dashboard → Webhooks
   - Add webhook URL: `https://yourdomain.com/api/payments/webhook`
   - Select events: `payment.authorized`, `payment.failed`
   - Copy webhook secret to `.env`

3. **Set Up Custom Email Domain:**
   - Verify your domain in Resend
   - Update `FROM_EMAIL` in `.env`
   - Test email sending

4. **Environment Variables:**
   Update production `.env`:
   ```bash
   RAZORPAY_KEY_ID=rzp_live_XXXXX
   RAZORPAY_KEY_SECRET=live_secret_XXXXX
   FRONTEND_URL=https://yourdomain.com
   FROM_EMAIL=orders@yourdomain.com
   ```

5. **Security Checklist:**
   - [ ] Use HTTPS (required by Razorpay)
   - [ ] Never expose secret keys in frontend
   - [ ] Enable webhook signature verification
   - [ ] Set proper CORS_ORIGINS
   - [ ] Add rate limiting to payment endpoints
   - [ ] Set up error monitoring (Sentry, etc.)

### File Downloads Setup

Currently, the download endpoint returns a placeholder. Choose one option:

**Option A: AWS S3 (Recommended)**
```python
# In backend/routes/payment_routes.py download_file()
import boto3
from botocore.config import Config

s3_client = boto3.client('s3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    config=Config(signature_version='s3v4')
)

# Generate pre-signed URL (expires in 1 hour)
download_url = s3_client.generate_presigned_url(
    'get_object',
    Params={
        'Bucket': 'your-bucket-name',
        'Key': f'templates/{order.template_id}.zip'
    },
    ExpiresIn=3600
)

return RedirectResponse(url=download_url)
```

**Option B: GridFS (MongoDB)**
```python
from motor.motor_gridfs import AsyncIOMotorGridFSBucket

gridfs_bucket = AsyncIOMotorGridFSBucket(db)

# Store file
with open('template.zip', 'rb') as f:
    file_id = await gridfs_bucket.upload_from_stream(
        f'templates/{template_id}.zip',
        f
    )

# Retrieve file in download endpoint
grid_out = await gridfs_bucket.open_download_stream_by_name(
    f'templates/{order.template_id}.zip'
)
```

---

## Troubleshooting

### Common Issues

#### 1. "Module not found" errors
```bash
# Make sure you're in the backend directory
cd backend
pip install -r requirements.txt
```

#### 2. "RAZORPAY_KEY_ID not set"
- Check `.env` file exists in `backend/` directory
- Verify environment variables are set correctly
- Restart the server after changing `.env`

#### 3. Payment verification fails
- Ensure you're using matching test/live keys
- Check backend logs for signature verification errors
- Verify webhook secret matches Razorpay dashboard

#### 4. Email not received
- Check RESEND_API_KEY is valid
- Verify sender email is configured
- Check spam folder
- Look at backend logs for email sending errors
- Use Resend dashboard to view email logs

#### 5. CORS errors in frontend
- Add frontend URL to CORS_ORIGINS in `.env`
- Format: `http://localhost:3000,https://yourdomain.com`
- Restart backend after changing CORS settings

#### 6. MongoDB connection fails
- Verify MongoDB is running: `mongosh`
- Check MONGO_URL format: `mongodb://localhost:27017/`
- Ensure DB_NAME is set

### Checking Logs

Backend logs show detailed information:

```bash
# In server.py output, look for:
2024-01-15 10:30:45 - INFO - Razorpay client initialized successfully
2024-01-15 10:31:12 - INFO - Created Razorpay order: order_xxxxx
2024-01-15 10:31:45 - INFO - Payment signature verified for order: order_xxxxx
2024-01-15 10:31:46 - INFO - Email sent successfully to customer@email.com
```

### Testing Checklist

- [ ] Backend starts without errors
- [ ] MongoDB connection successful
- [ ] Razorpay credentials loaded
- [ ] Email service initialized
- [ ] Frontend connects to backend
- [ ] Order creation works
- [ ] Razorpay modal opens
- [ ] Test payment succeeds
- [ ] Payment verification works
- [ ] Email received with download link
- [ ] Download link works
- [ ] Download count increments
- [ ] Expired token returns 404

---

## API Documentation

### POST /api/orders/create

Create a new order for payment.

**Request:**
```json
{
  "template_id": "automation-workflows",
  "customer_email": "customer@example.com",
  "customer_name": "John Doe"
}
```

**Response:**
```json
{
  "order_id": "order_MfyGhjkl123456",
  "amount": 9900,
  "currency": "INR",
  "key_id": "rzp_test_xxxxx",
  "receipt": "receipt_1234567890_abc123de"
}
```

### POST /api/payments/verify

Verify payment and send download link.

**Request:**
```json
{
  "razorpay_order_id": "order_MfyGhjkl123456",
  "razorpay_payment_id": "pay_MfyGhjkl123456",
  "razorpay_signature": "signature_string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment successful! Check your email for the download link.",
  "order_id": "order_MfyGhjkl123456"
}
```

### GET /api/downloads/{token}

Download file using secure token.

**Response:**
```json
{
  "message": "Download ready",
  "order_id": "order_MfyGhjkl123456",
  "template_id": "automation-workflows",
  "download_count": 1
}
```

---

## Support

For issues or questions:
- Check backend logs for detailed error messages
- Review Razorpay dashboard for payment status
- Check Resend dashboard for email delivery status
- MongoDB logs for database issues

### Useful Links
- [Razorpay Docs](https://razorpay.com/docs/)
- [Razorpay Test Cards](https://razorpay.com/docs/payments/payments/test-card-details/)
- [Resend Docs](https://resend.com/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com/)

---

## Next Steps

After successfully testing:

1. Add file storage (S3 or GridFS)
2. Set up webhook endpoint on public URL
3. Add order history page for customers
4. Implement refund functionality
5. Add analytics and reporting
6. Set up monitoring and alerts
7. Add multiple product support
8. Implement discount codes

Congratulations! Your payment system is now set up and ready to use! 🎉
