import { handleRazorpayVerify } from "@/api/tokens/razorpay-verify";

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await handleRazorpayVerify({ body });
    return Response.json(result.data, { status: result.status || 200 });
  } catch (error) {
    return Response.json(
      { error: error.message || "Payment verification failed" },
      { status: 400 }
    );
  }
}

