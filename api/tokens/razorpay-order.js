import { supabaseAdmin } from "../../lib/supabaseAdmin";

// This will be used to create Razorpay orders
// You'll need to install: npm install razorpay
// And set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env

export async function handleRazorpayOrder({ user, body }) {
  const { amount, buyerName, buyerEmail, buyerType, organization } = body || {};
  
  if (!amount || amount < 5) {
    throw new Error("Amount must be at least 5 tokens");
  }

  // Calculate amount in INR (assuming 1 token = 10 INR, adjust as needed)
  const TOKEN_TO_INR_RATE = 10;
  const amountInPaise = amount * TOKEN_TO_INR_RATE * 100; // Razorpay uses paise (smallest currency unit)

  try {
    // Dynamic import for Razorpay (only load if available)
    const Razorpay = (await import("razorpay")).default;
    
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.");
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    // Create order in Razorpay
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `tbm_${Date.now()}_${user.id.substring(0, 8)}`,
      notes: {
        user_id: user.id,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        buyer_type: buyerType,
        organization: organization || "",
        tokens: amount
      }
    });

    // Create pending order record in database
    const { data: orderRecord, error: orderError } = await supabaseAdmin
      .from("token_orders")
      .insert({
        user_id: user.id,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        buyer_type: buyerType,
        organization: organization || null,
        amount: amount,
        status: "pending"
      })
      .select()
      .single();

    if (orderError) throw orderError;

    return {
      status: 200,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
        orderRecord
      }
    };
  } catch (error) {
    // If Razorpay is not installed or configured, fall back to simulation
    if (error.message.includes("Razorpay") || error.message.includes("razorpay")) {
      throw new Error("Razorpay integration not fully configured. Please install razorpay package and set credentials.");
    }
    throw error;
  }
}

