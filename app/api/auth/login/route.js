import { handleLogin } from "@/api/auth/login";
import { withAuth } from "@/lib/apiAuth";

export async function POST(request) {
  return withAuth(request, handleLogin);
}

