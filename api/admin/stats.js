import { supabaseAdmin } from "../../lib/supabaseAdmin";

export async function handleAdminStats() {
  const [
    profilesMeta,
    tasksMeta,
    stakesRes,
    tokensRes,
    rewardsMeta,
    redemptionsMeta,
    ordersMeta
  ] = await Promise.all([
    supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("tasks").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("stakes").select("hours_staked"),
    supabaseAdmin.from("tokens").select("amount"),
    supabaseAdmin.from("reward_catalog").select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("reward_redemptions")
      .select("*", { count: "exact", head: true }),
    supabaseAdmin.from("token_orders").select("*", { count: "exact", head: true })
  ]);

  if (stakesRes.error) throw stakesRes.error;
  if (tokensRes.error) throw tokensRes.error;

  const totalHours =
    stakesRes.data?.reduce((sum, stake) => sum + (stake.hours_staked || 0), 0) ||
    0;
  const tokenSupply =
    tokensRes.data?.reduce((sum, token) => sum + (token.amount || 0), 0) || 0;

  return {
    status: 200,
    data: {
      profiles: profilesMeta.count || 0,
      tasks: tasksMeta.count || 0,
      staked_hours: totalHours,
      token_supply: tokenSupply,
      rewards: rewardsMeta.count || 0,
      redemptions: redemptionsMeta.count || 0,
      token_orders: ordersMeta.count || 0
    }
  };
}

