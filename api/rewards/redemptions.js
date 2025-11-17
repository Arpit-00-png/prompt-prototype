import { supabaseAdmin } from "../../lib/supabaseAdmin";

export async function handleRewardRedemptions({ user }) {
  const { data, error } = await supabaseAdmin
    .from("reward_redemptions")
    .select("*, reward:reward_catalog(title, sponsor, coupon_code, cost_tokens)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return {
    status: 200,
    data: { redemptions: data || [] }
  };
}

