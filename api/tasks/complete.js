import { supabaseAdmin } from "../../lib/supabaseAdmin";

export async function handleTaskComplete({ user, body }) {
  const taskId = body?.taskId;
  const submissionText = body?.submissionText || "";
  const submissionFiles = body?.submissionFiles || [];
  
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

  if (!submissionText.trim() && (!submissionFiles || submissionFiles.length === 0)) {
    throw new Error("Please provide submission content (text or files)");
  }

  const updateData = {
    status: "submitted",
    submission_text: submissionText.trim() || null,
    submission_files: submissionFiles.length > 0 ? submissionFiles : null,
    submitted_at: new Date().toISOString()
  };

  const { error: updateError } = await supabaseAdmin
    .from("tasks")
    .update(updateData)
    .eq("id", taskId);
  if (updateError) throw updateError;

  await supabaseAdmin.from("audits").insert({
    action: "tasks.submit",
    user_id: user.id,
    details: { 
      task_id: taskId,
      has_text: !!submissionText.trim(),
      has_files: submissionFiles.length > 0
    }
  });

  return {
    status: 200,
    data: { 
      task: { 
        ...task, 
        ...updateData,
        status: "submitted" 
      } 
    }
  };
}

