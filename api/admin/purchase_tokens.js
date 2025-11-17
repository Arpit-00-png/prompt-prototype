import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { mintTokens } from "../../utils/tokenLogic";

export async function handlePurchaseTokens({ user, body }) {
  const { organization, amount, recipientId } = body || {};
  const tokens = Number(amount);
  if (!organization) throw new Error("Organization name is required");
  if (!tokens || tokens <= 0) throw new Error("Token amount must be positive");

  const { data: orgRecord, error } = await supabaseAdmin
    .from("organizations")
    .select("*")
    .eq("name", organization)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  if (orgRecord) {
    await supabaseAdmin
      .from("organizations")
      .update({ tokens_purchased: orgRecord.tokens_purchased + tokens })
      .eq("id", orgRecord.id);
  } else {
    await supabaseAdmin.from("organizations").insert({
      name: organization,
      tokens_purchased: tokens
    });
  }

  if (recipientId) {
    await mintTokens(recipientId, tokens); // treat tokens as hours
  }

  await supabaseAdmin.from("audits").insert({
    action: "admin.purchase_tokens",
    user_id: user.id,
    details: { organization, tokens, recipientId }
  });

  return {
    status: 201,
    data: { message: "Tokens purchased", tokens }
  };
}

