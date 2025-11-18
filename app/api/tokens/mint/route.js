import { handleMintTokens } from "@/api/tokens/mint";
import { withAuth } from "@/lib/apiAuth";

export async function POST(request) {
  return withAuth(request, handleMintTokens);
}

