import { supabaseAdmin } from "../../lib/supabaseAdmin";

export async function handleTaskCreate({ user, body }) {
  const { title, description, reward, estimatedHours } = body || {};
  if (!title || !description) {
    throw new Error("Title and description are required");
  }
  const rewardInt = Number(reward) || 0;
  if (rewardInt < 0) {
    throw new Error("Reward cannot be negative");
  }
  const estimatedHoursInt = Number(estimatedHours) || 1;
  if (estimatedHoursInt < 1) {
    throw new Error("Estimated hours must be at least 1");
  }

  const { data, error } = await supabaseAdmin
    .from("tasks")
    .insert({
      title,
      description,
      reward: rewardInt,
      estimated_hours: estimatedHoursInt,
      status: "open",
      created_by: user.id
    })
    .select()
    .single();
  if (error) throw error;

  await supabaseAdmin.from("audits").insert({
    action: "tasks.create",
    user_id: user.id,
    details: { task_id: data.id }
  });

  return {
    status: 201,
    data: { task: data }
  };
}

