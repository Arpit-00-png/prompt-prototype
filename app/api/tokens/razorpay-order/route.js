import { handleRazorpayOrder } from "@/api/tokens/razorpay-order";
import { withAuth } from "@/lib/apiAuth";

export async function POST(request) {
  return withAuth(request, handleRazorpayOrder);
}

