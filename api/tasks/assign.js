import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { escrowTokens } from "../../utils/tokenLogic";

export async function handleTaskAssign({ user, body }) {
  const taskId = body?.taskId;
  if (!taskId) {
    throw new Error("taskId is required");
  }

  const { data: task, error } = await supabaseAdmin
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .single();
  if (error) throw error;

  if (task.created_by === user.id) {
    throw new Error("Creators cannot assign themselves to their tasks");
  }
  if (task.status !== "open") {
    throw new Error("Task is not open for assignment");
  }

  if (task.reward > 0) {
    try {
      await escrowTokens(task.created_by, task.reward, task.id);
    } catch (error) {
      if (error.message && error.message.includes("Insufficient tokens")) {
        throw new Error(
          `Task creator does not have enough tokens to escrow the reward of ${task.reward} TBM. ${error.message}`
        );
      }
      throw error;
    }
  }

  const { error: updateError } = await supabaseAdmin
    .from("tasks")
    .update({ status: "assigned", assigned_to: user.id })
    .eq("id", taskId);
  if (updateError) throw updateError;

  await supabaseAdmin.from("audits").insert({
    action: "tasks.assign",
    user_id: user.id,
    details: { task_id: taskId }
  });

  return {
    status: 200,
    data: { task: { ...task, status: "assigned", assigned_to: user.id } }
  };
}

