# Razorpay Integration Setup Guide

## Overview
This guide will help you integrate Razorpay payment gateway for real token purchases.

## Step 1: Install Razorpay Package

```bash
npm install razorpay
```

## Step 2: Get Razorpay Credentials

1. Go to https://razorpay.com and sign up/login
2. Go to **Settings** → **API Keys**
3. Create a new API key or use existing one
4. Copy your **Key ID** and **Key Secret**

## Step 3: Add Environment Variables

Add these to your `.env` file:

```env
RAZORPAY_KEY_ID=your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

**Important**: Never commit these to git! Add `.env` to `.gitignore`.

## Step 4: Configure Token to INR Rate

In `api/tokens/razorpay-order.js`, adjust the rate:

```javascript
const TOKEN_TO_INR_RATE = 10; // Change this to your desired rate (1 token = 10 INR)
```

## Step 5: Update Frontend (Buy Tokens Page)

The buy tokens page needs to be updated to:
1. Create Razorpay order
2. Open Razorpay checkout
3. Verify payment on success

## Step 6: Set Up Webhook (Optional but Recommended)

1. Go to Razorpay Dashboard → **Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/tokens/razorpay-webhook`
3. Select events: `payment.captured`, `payment.failed`
4. Copy webhook secret and add to `.env` as `RAZORPAY_WEBHOOK_SECRET`

## Testing

### Test Mode
Razorpay provides test credentials:
- Use test Key ID and Key Secret
- Use test card numbers from Razorpay docs

### Test Cards
- Success: `4111 1111 1111 1111`
- Failure: `4000 0000 0000 0002`

## Current Implementation

The system now has:
- ✅ Razorpay order creation API
- ✅ Payment verification API
- ⚠️ Frontend integration needed (see next steps)

## Next Steps

1. Update `app/buy-tokens/page.js` to use Razorpay checkout
2. Add Razorpay script to your layout
3. Handle payment success/failure callbacks
4. Test with Razorpay test credentials

## Files Created

- `api/tokens/razorpay-order.js` - Creates Razorpay orders
- `api/tokens/razorpay-verify.js` - Verifies payments
- `app/api/tokens/razorpay-order/route.js` - API route
- `app/api/tokens/razorpay-verify/route.js` - API route

## Troubleshooting

### "Razorpay credentials not configured"
- Check `.env` file has `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
- Restart your development server after adding env variables

### "Invalid payment signature"
- Check that you're using the correct Key Secret
- Ensure signature verification logic matches Razorpay's format

### Payment not going through
- Check Razorpay dashboard for payment status
- Verify webhook is configured correctly
- Check server logs for errors

