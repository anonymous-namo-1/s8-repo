# Go Live Checklist - Switch to Production Mode

This guide will help you switch from Razorpay test mode to live mode for real payments.

## Prerequisites

✅ You must have completed KYC verification on Razorpay
✅ Your business/account must be approved by Razorpay
✅ You should have received live API keys

---

## Step 1: Get Live Razorpay Keys

1. **Login to Razorpay Dashboard:**
   - Go to [https://dashboard.razorpay.com](https://dashboard.razorpay.com)

2. **Navigate to API Keys:**
   - Click on "Settings" → "API Keys"
   - Switch to "Live Mode" toggle (top right)

3. **Generate Live Keys:**
   - Click "Generate Live API Keys"
   - Copy both:
     - **Key ID** (starts with `rzp_live_...`)
     - **Key Secret** (keep this secure!)

4. **Important:** Live keys are **different** from test keys
   - Test keys start with: `rzp_test_...`
   - Live keys start with: `rzp_live_...`

---

## Step 2: Update Environment Variables in Vercel

1. **Go to Vercel Dashboard:**
   - Navigate to your project
   - Click "Settings" → "Environment Variables"

2. **Update These Variables:**

   Find `RAZORPAY_KEY_ID` and click "Edit":
   ```
   RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
   ```

   Find `RAZORPAY_KEY_SECRET` and click "Edit":
   ```
   RAZORPAY_KEY_SECRET=YOUR_LIVE_SECRET
   ```

3. **Verify Other Variables Are Set:**
   ```
   FROM_EMAIL=onboarding@resend.dev (or your verified domain)
   RESEND_API_KEY=re_YOUR_API_KEY
   ```

4. **Save Changes**

---

## Step 3: Redeploy on Vercel

1. **Trigger Redeploy:**
   - Go to "Deployments" tab in Vercel
   - Click the "..." menu on latest deployment
   - Click "Redeploy"
   - Check "Use existing Build Cache" is OFF
   - Click "Redeploy"

2. **Wait for Deployment:**
   - Wait 1-2 minutes for deployment to complete
   - Check deployment logs for any errors

---

## Step 4: Set Up Razorpay Webhooks (Important!)

Webhooks ensure you're notified even if the payment page is closed.

1. **Get Your Webhook URL:**
   ```
   https://your-domain.vercel.app/api/payments/webhook
   ```
   (Replace `your-domain` with your actual Vercel domain)

2. **Configure Webhook in Razorpay:**
   - Go to Razorpay Dashboard → "Webhooks"
   - Click "Add New Webhook"
   - URL: `https://your-domain.vercel.app/api/payments/webhook`
   - Secret: Generate a strong random string
   - Select Events:
     - ✅ payment.authorized
     - ✅ payment.failed
     - ✅ payment.captured
   - Click "Create Webhook"

3. **Add Webhook Secret to Vercel:**
   - Copy the webhook secret from Razorpay
   - Go to Vercel → Environment Variables
   - Add new variable:
     ```
     RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
     ```
   - Redeploy again

---

## Step 5: Test With Real Payment

⚠️ **Important:** You'll be charged for real test transactions!

1. **Visit Your Site:**
   - Go to your live domain
   - Click "Buy Now"

2. **Make a Small Test Purchase:**
   - Use a real email (your own)
   - Use a real card with small balance (₹1-10 if possible)
   - Complete the payment

3. **Verify:**
   - ✅ Payment succeeds in Razorpay dashboard
   - ✅ Email arrives with Google Drive link
   - ✅ Order shows in Razorpay "Transactions"

4. **Refund Test Transaction (Optional):**
   - Go to Razorpay Dashboard → Transactions
   - Find your test transaction
   - Click "Refund" to get your money back

---

## Step 6: Monitor First Real Transactions

1. **Watch Razorpay Dashboard:**
   - Monitor first 5-10 real transactions
   - Check for any failed payments
   - Verify emails are being sent

2. **Check Vercel Function Logs:**
   - Go to Vercel → Functions
   - Click on `/api/payments/verify`
   - Monitor logs for errors

3. **Test Different Scenarios:**
   - Try different email addresses
   - Test from different devices
   - Verify Google Drive link works for customers

---

## Step 7: Set Up Alerts (Recommended)

### Email Alerts for Failed Payments

Add error monitoring service (optional but recommended):

**Option 1: Sentry**
```bash
npm install @sentry/node
```

**Option 2: Custom Email Alerts**
- Modify payment verification function
- Send email to admin on failures

---

## Important Security Notes

### ✅ DO:
- Keep live keys in Vercel environment variables only
- Use HTTPS (Razorpay requirement - Vercel provides this)
- Verify payment signatures on server-side
- Monitor transaction logs regularly
- Set up webhook signature verification

### ❌ DON'T:
- Never commit live keys to Git
- Never expose keys in frontend code
- Don't skip webhook verification
- Don't ignore failed payment alerts

---

## Pricing Update - Live Mode

The site now shows:
- **Current Price:** ₹99
- **Original Price:** ₹199 (crossed out)
- **Discount:** 50% OFF

This creates urgency and shows value!

---

## Troubleshooting

### Issue: Payments failing in live mode

**Check:**
1. Live keys are correctly set in Vercel
2. Keys match (don't mix test and live)
3. KYC is approved in Razorpay
4. Business is activated

### Issue: Emails not being sent

**Check:**
1. RESEND_API_KEY is valid
2. FROM_EMAIL is set correctly
3. Check Vercel function logs
4. Verify Resend dashboard for failed emails

### Issue: "Invalid signature" error

**Check:**
1. Using matching key pair (ID + Secret)
2. Not mixing test/live keys
3. Webhook secret matches if using webhooks

---

## Post-Launch Checklist

After going live:

- [ ] Test complete purchase flow
- [ ] Verify email delivery works
- [ ] Check Google Drive link is accessible
- [ ] Monitor first 10 transactions
- [ ] Set up webhook and verify it works
- [ ] Test refund process (if needed)
- [ ] Add customer support email/chat
- [ ] Monitor Razorpay dashboard daily for first week
- [ ] Set up automatic reconciliation
- [ ] Keep backup of transaction records

---

## Customer Support

If customers report payment issues:

1. **Check Razorpay Dashboard:**
   - Search by email or payment ID
   - Check transaction status

2. **Check Email Logs:**
   - Verify in Resend dashboard
   - Resend manually if failed

3. **Verify Payment:**
   - If payment succeeded but no email
   - Manually send Google Drive link

4. **Issue Refunds:**
   - Go to Razorpay → Transactions
   - Find transaction → Click "Refund"
   - Refunds typically processed in 5-7 days

---

## Going Back to Test Mode

If you need to go back to test mode:

1. Replace live keys with test keys in Vercel
2. Redeploy
3. Test with test cards again

---

## Contact & Support

- **Razorpay Support:** support@razorpay.com
- **Razorpay Dashboard:** https://dashboard.razorpay.com
- **Test Cards:** https://razorpay.com/docs/payments/payments/test-card-details/

---

## 🎉 You're Live!

Once you complete this checklist, your payment system is live and ready to accept real transactions!

Monitor closely for the first week and adjust as needed. Good luck! 🚀
