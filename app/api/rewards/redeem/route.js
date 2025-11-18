import { handleRewardRedeem } from "@/api/rewards/redeem";
import { withAuth } from "@/lib/apiAuth";

export async function POST(request) {
  return withAuth(request, handleRewardRedeem);
}

