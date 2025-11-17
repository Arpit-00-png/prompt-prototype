import { handlePurchaseTokens } from "@/api/admin/purchase_tokens";
import { withAuth } from "@/lib/apiAuth";

export async function POST(request) {
  return withAuth(request, handlePurchaseTokens);
}

