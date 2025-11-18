import { handleAdminStats } from "@/api/admin/stats";
import { withAuth } from "@/lib/apiAuth";

export async function GET(request) {
  return withAuth(request, handleAdminStats);
}

