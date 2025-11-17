import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { burnTokens } from "../../utils/tokenLogic";

export async function handleRewardRedeem({ user, body }) {
  const rewardId = body?.rewardId;
  if (!rewardId) throw new Error("rewardId is required");

  const { data: reward, error } = await supabaseAdmin
    .from("reward_catalog")
    .select("*")
    .eq("id", rewardId)
    .single();
  if (error) throw error;

  if (!reward) throw new Error("Reward not found");
  if (reward.inventory !== null && reward.inventory <= 0) {
    throw new Error("Reward out of stock");
  }

  await burnTokens(user.id, reward.cost_tokens, { rewardId });

  const { data: redemption, error: redemptionError } = await supabaseAdmin
    .from("reward_redemptions")
    .insert({
      reward_id: reward.id,
      user_id: user.id,
      status: "pending"
    })
    .select("*, reward:reward_catalog(title, sponsor, coupon_code)")
    .single();
  if (redemptionError) throw redemptionError;

  if (reward.inventory !== null) {
    await supabaseAdmin
      .from("reward_catalog")
      .update({ inventory: reward.inventory - 1 })
      .eq("id", reward.id);
  }

  await supabaseAdmin.from("audits").insert({
    action: "rewards.redeem",
    user_id: user.id,
    details: {
      reward_id: reward.id,
      cost: reward.cost_tokens
    }
  });

  return {
    status: 200,
    data: {
      redemption,
      message: "Reward redeemed. Sponsor will reach out shortly."
    }
  };
}

