import { supabaseAdmin } from "../../lib/supabaseAdmin";

export async function handleRewardsCatalog() {
  const { data, error } = await supabaseAdmin
    .from("reward_catalog")
    .select("*")
    .order("cost_tokens", { ascending: true });
  if (error) throw error;
  return {
    status: 200,
    data: { rewards: data || [] }
  };
}

