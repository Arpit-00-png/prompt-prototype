import { supabaseAdmin } from "../lib/supabaseAdmin";

const MIN_REP = 0;
const MAX_REP = 100;

async function adjustReputation(userId, delta) {
  if (!userId) throw new Error("User id is required");

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("reputation")
    .eq("id", userId)
    .single();
  if (error && error.code !== "PGRST116") throw error;

  const current = data?.reputation ?? 50;
  const next = Math.min(MAX_REP, Math.max(MIN_REP, current + delta));

  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update({ reputation: next })
    .eq("id", userId);
  if (updateError) throw updateError;

  await supabaseAdmin.from("audits").insert({
    action: "reputation.adjust",
    user_id: userId,
    details: { delta, result: next }
  });

  return next;
}

export async function increaseReputation(userId, amount) {
  return adjustReputation(userId, Math.abs(amount));
}

export async function decreaseReputation(userId, amount) {
  return adjustReputation(userId, -Math.abs(amount));
}

