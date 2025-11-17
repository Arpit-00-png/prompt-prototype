import { handleTokenPurchase } from "@/api/tokens/purchase";
import { withAuth } from "@/lib/apiAuth";

export async function POST(request) {
  return withAuth(request, handleTokenPurchase);
}

