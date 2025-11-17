import { supabaseAdmin } from "../../lib/supabaseAdmin";

export async function handleTaskComplete({ user, body }) {
  const taskId = body?.taskId;
  if (!taskId) throw new Error("taskId is required");

  const { data: task, error } = await supabaseAdmin
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .single();
  if (error) throw error;

  if (task.assigned_to !== user.id) {
    throw new Error("You are not assigned to this task");
  }

  if (task.status !== "assigned") {
    throw new Error("Task cannot be completed in current state");
  }

  const { error: updateError } = await supabaseAdmin
    .from("tasks")
    .update({
      status: "submitted"
    })
    .eq("id", taskId);
  if (updateError) throw updateError;

  await supabaseAdmin.from("audits").insert({
    action: "tasks.submit",
    user_id: user.id,
    details: { task_id: taskId }
  });

  return {
    status: 200,
    data: { task: { ...task, status: "submitted" } }
  };
}

