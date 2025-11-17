import { handleTaskCreate } from "@/api/tasks/create";
import { withAuth } from "@/lib/apiAuth";

export async function POST(request) {
  return withAuth(request, handleTaskCreate);
}

