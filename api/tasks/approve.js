import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { releaseEscrow, refundEscrow } from "../../utils/tokenLogic";
import { increaseReputation, decreaseReputation } from "../../utils/reputation";

export async function handleTaskApprove({ user, body }) {
  const taskId = body?.taskId;
  const approve = body?.approve ?? true;
  if (!taskId) throw new Error("taskId is required");

  const { data: task, error } = await supabaseAdmin
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .single();
  if (error) throw error;

  if (task.created_by !== user.id) {
    throw new Error("Only the creator can approve this task");
  }
  if (task.status !== "submitted") {
    throw new Error("Task must be submitted before approval");
  }

  if (approve) {
    if (task.reward > 0) {
      await releaseEscrow(task.assigned_to, task.reward, task.id);
    }
    await increaseReputation(task.assigned_to, task.reward || 1);
    
    // Reduce available hours from assignee's staked hours
    const hoursToDeduct = task.estimated_hours || 1;
    const { data: assigneeProfile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("available_hours")
      .eq("id", task.assigned_to)
      .single();
    
    if (!profileError && assigneeProfile) {
      const newAvailableHours = Math.max(0, (assigneeProfile.available_hours || 0) - hoursToDeduct);
      await supabaseAdmin
        .from("profiles")
        .update({ available_hours: newAvailableHours })
        .eq("id", task.assigned_to);
    }
    
    await supabaseAdmin
      .from("tasks")
      .update({ status: "completed" })
      .eq("id", taskId);
  } else {
    if (task.reward > 0) {
      await refundEscrow(task.created_by, task.reward, task.id);
    }
    await decreaseReputation(task.assigned_to, task.reward || 1);
    await supabaseAdmin
      .from("tasks")
      .update({ status: "open", assigned_to: null })
      .eq("id", taskId);
  }

  await supabaseAdmin.from("audits").insert({
    action: approve ? "tasks.approve" : "tasks.reject",
    user_id: user.id,
    details: { task_id: taskId }
  });

  return {
    status: 200,
    data: {
      task: {
        ...task,
        status: approve ? "completed" : "open",
        assigned_to: approve ? task.assigned_to : null
      }
    }
  };
}

