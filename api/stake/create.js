import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { mintTokens } from "../../utils/tokenLogic";

export async function handleStakeCreate({ user, body }) {
  const hours = Number(body?.hours);
  if (!hours || hours <= 0) {
    throw new Error("Hours must be greater than zero");
  }

  const { data: stake, error } = await supabaseAdmin
    .from("stakes")
    .insert({
      user_id: user.id,
      hours_staked: hours,
      status: "active"
    })
    .select()
    .single();
  if (error) throw error;

  await mintTokens(user.id, hours);

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("available_hours")
    .eq("id", user.id)
    .single();
  if (profileError && profileError.code !== "PGRST116") throw profileError;

  const availableHours = (profile?.available_hours || 0) + hours;
  await supabaseAdmin
    .from("profiles")
    .update({ available_hours: availableHours })
    .eq("id", user.id);

  await supabaseAdmin.from("audits").insert({
    action: "stake.create",
    user_id: user.id,
    details: { stake_id: stake.id, hours }
  });

  return {
    status: 201,
    data: { stake }
  };
}

