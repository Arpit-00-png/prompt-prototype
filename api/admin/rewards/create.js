import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function handleAdminRewardCreate({ user, body }) {
  const { title, description, cost_tokens, sponsor, coupon_code, inventory } =
    body || {};
  if (!title || !cost_tokens) {
    throw new Error("Title and cost_tokens are required");
  }

  const payload = {
    title,
    description: description || "",
    cost_tokens: Number(cost_tokens),
    sponsor: sponsor || "Community Sponsor",
    coupon_code: coupon_code || null,
    inventory: inventory === "" || inventory === undefined ? null : Number(inventory)
  };

  const { data, error } = await supabaseAdmin
    .from("reward_catalog")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;

  await supabaseAdmin.from("audits").insert({
    action: "admin.reward.create",
    user_id: user.id,
    details: { reward_id: data.id }
  });

  return {
    status: 201,
    data: { reward: data }
  };
}

