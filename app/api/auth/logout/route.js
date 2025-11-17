import { handleLogout } from "@/api/auth/logout";
import { withAuth } from "@/lib/apiAuth";

export async function POST(request) {
  return withAuth(request, handleLogout, { optional: true });
}

