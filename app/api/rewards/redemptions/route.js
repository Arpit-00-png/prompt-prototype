import { handleRewardRedemptions } from "@/api/rewards/redemptions";
import { withAuth } from "@/lib/apiAuth";

export async function GET(request) {
  return withAuth(request, handleRewardRedemptions);
}

