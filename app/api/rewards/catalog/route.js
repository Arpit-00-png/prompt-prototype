import { handleRewardsCatalog } from "@/api/rewards/catalog";
import { withAuth } from "@/lib/apiAuth";

export async function GET(request) {
  return withAuth(request, handleRewardsCatalog, { optional: true });
}

