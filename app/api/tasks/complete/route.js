import { handleTaskComplete } from "@/api/tasks/complete";
import { withAuth } from "@/lib/apiAuth";

export async function POST(request) {
  return withAuth(request, handleTaskComplete);
}

