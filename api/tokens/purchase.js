import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { mintTokens } from "../../utils/tokenLogic";

export async function handleTokenPurchase({ user, body }) {
  const amount = Number(body?.amount);
  const buyerType = body?.buyerType || "individual";
  const buyerName = body?.buyerName || user.user_metadata?.full_name || user.email;
  const buyerEmail = body?.buyerEmail || user.email;
  const organization = body?.organization || null;

  if (!amount || amount <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  await mintTokens(user.id, amount);

  const { data: order, error } = await supabaseAdmin
    .from("token_orders")
    .insert({
      user_id: user.id,
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      buyer_type: buyerType,
      organization,
      amount,
      status: "paid"
    })
    .select()
    .single();
  if (error) throw error;

  if (organization) {
    const { data: orgRecord, error: orgError } = await supabaseAdmin
      .from("organizations")
      .select("*")
      .eq("name", organization)
      .single();
    if (orgError && orgError.code !== "PGRST116") throw orgError;

    if (orgRecord) {
      await supabaseAdmin
        .from("organizations")
        .update({ tokens_purchased: (orgRecord.tokens_purchased || 0) + amount })
        .eq("id", orgRecord.id);
    } else {
      await supabaseAdmin
        .from("organizations")
        .insert({ name: organization, tokens_purchased: amount });
    }
  }

  await supabaseAdmin.from("audits").insert({
    action: "tokens.purchase",
    user_id: user.id,
    details: { order_id: order.id, amount, buyerType, organization }
  });

  return {
    status: 201,
    data: { order, message: "Tokens purchased successfully" }
  };
}

