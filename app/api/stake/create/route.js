import { handleStakeCreate } from "@/api/stake/create";
import { withAuth } from "@/lib/apiAuth";

export async function POST(request) {
  return withAuth(request, handleStakeCreate);
}

