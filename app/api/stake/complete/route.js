import { handleStakeComplete } from "@/api/stake/complete";
import { withAuth } from "@/lib/apiAuth";

export async function POST(request) {
  return withAuth(request, handleStakeComplete);
}

