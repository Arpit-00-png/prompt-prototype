import { handleAdminRewardCreate } from "@/api/admin/rewards/create";
import { withAuth } from "@/lib/apiAuth";

export async function POST(request) {
  return withAuth(request, handleAdminRewardCreate);
}

