import { handleTokenBalance } from "@/api/tokens/balance";
import { withAuth } from "@/lib/apiAuth";

export async function GET(request) {
  return withAuth(request, handleTokenBalance);
}

