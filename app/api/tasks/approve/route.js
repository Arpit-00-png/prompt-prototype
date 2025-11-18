import { handleTaskApprove } from "@/api/tasks/approve";
import { withAuth } from "@/lib/apiAuth";

export async function POST(request) {
  return withAuth(request, handleTaskApprove);
}

