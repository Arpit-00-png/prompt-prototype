import { handleTaskAssign } from "@/api/tasks/assign";
import { withAuth } from "@/lib/apiAuth";

export async function POST(request) {
  return withAuth(request, handleTaskAssign);
}

