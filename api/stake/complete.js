import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { increaseReputation } from "../../utils/reputation";

export async function handleStakeComplete({ user, body }) {
  const stakeId = body?.stakeId;
  if (!stakeId) throw new Error("Stake ID is required");

  const { data: stake, error } = await supabaseAdmin
    .from("stakes")
    .select("*")
    .eq("id", stakeId)
    .single();
  if (error) throw error;

  if (stake.user_id !== user.id) {
    throw new Error("You can only complete your own stakes");
  }
  if (stake.status === "completed") {
    return { status: 200, data: { stake } };
  }

  const { error: updateError } = await supabaseAdmin
    .from("stakes")
    .update({ status: "completed" })
    .eq("id", stakeId);
  if (updateError) throw updateError;

  await increaseReputation(user.id, stake.hours_staked);

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("available_hours")
    .eq("id", user.id)
    .single();
  if (profileError) throw profileError;

  const available = Math.max(
    0,
    (profile?.available_hours || 0) - stake.hours_staked
  );
  await supabaseAdmin
    .from("profiles")
    .update({ available_hours: available })
    .eq("id", user.id);

  await supabaseAdmin.from("audits").insert({
    action: "stake.complete",
    user_id: user.id,
    details: { stake_id: stake.id }
  });

  return {
    status: 200,
    data: { stake: { ...stake, status: "completed" } }
  };
}

