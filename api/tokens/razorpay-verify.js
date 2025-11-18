import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { mintTokens } from "../../utils/tokenLogic";

// Verify Razorpay payment and mint tokens
// This endpoint should be called from a webhook or after payment success

export async function handleRazorpayVerify({ body }) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderRecordId } = body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new Error("Missing payment verification data");
  }

  try {
    const crypto = await import("crypto");
    const Razorpay = (await import("razorpay")).default;

    if (!process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay secret not configured");
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      throw new Error("Invalid payment signature");
    }

    // Get order record
    const { data: orderRecord, error: orderError } = await supabaseAdmin
      .from("token_orders")
      .select("*")
      .eq("id", orderRecordId)
      .single();

    if (orderError || !orderRecord) {
      throw new Error("Order record not found");
    }

    if (orderRecord.status === "paid") {
      return {
        status: 200,
        data: { message: "Payment already processed", order: orderRecord }
      };
    }

    // Mint tokens to user
    await mintTokens(orderRecord.user_id, orderRecord.amount);

    // Update order status
    await supabaseAdmin
      .from("token_orders")
      .update({
        status: "paid",
        metadata: {
          razorpay_order_id,
          razorpay_payment_id,
          verified_at: new Date().toISOString()
        }
      })
      .eq("id", orderRecordId);

    // Update organization if applicable
    if (orderRecord.organization) {
      const { data: orgRecord, error: orgError } = await supabaseAdmin
        .from("organizations")
        .select("*")
        .eq("name", orderRecord.organization)
        .single();

      if (orgError && orgError.code !== "PGRST116") throw orgError;

      if (orgRecord) {
        await supabaseAdmin
          .from("organizations")
          .update({ tokens_purchased: (orgRecord.tokens_purchased || 0) + orderRecord.amount })
          .eq("id", orgRecord.id);
      } else {
        await supabaseAdmin
          .from("organizations")
          .insert({ name: orderRecord.organization, tokens_purchased: orderRecord.amount });
      }
    }

    await supabaseAdmin.from("audits").insert({
      action: "tokens.purchase",
      user_id: orderRecord.user_id,
      details: {
        order_id: orderRecord.id,
        amount: orderRecord.amount,
        razorpay_order_id,
        razorpay_payment_id
      }
    });

    return {
      status: 200,
      data: {
        message: "Payment verified and tokens minted",
        order: { ...orderRecord, status: "paid" }
      }
    };
  } catch (error) {
    throw new Error(`Payment verification failed: ${error.message}`);
  }
}

