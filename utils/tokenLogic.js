import { supabaseAdmin } from "../lib/supabaseAdmin";

const TOKENS_PER_HOUR = 1;

async function logAudit(action, userId, details) {
  await supabaseAdmin.from("audits").insert({
    action,
    user_id: userId,
    details
  });
}

function ensurePositiveNumber(value, label) {
  if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
    throw new Error(`${label} must be a positive number`);
  }
}

export async function mintTokens(userId, hours) {
  if (!userId) {
    throw new Error("User id is required");
  }
  ensurePositiveNumber(hours, "Hours");
  const amount = hours * TOKENS_PER_HOUR;

  const { error } = await supabaseAdmin.from("tokens").insert({
    user_id: userId,
    amount
  });
  if (error) throw error;

  await supabaseAdmin.from("token_transactions").insert({
    from_user: null,
    to_user: userId,
    task_id: null,
    amount
  });
  await logAudit("tokens.mint", userId, { hours, amount });
  return amount;
}

export async function getBalance(userId) {
  if (!userId) {
    throw new Error("User id is required");
  }
  const { data, error } = await supabaseAdmin
    .from("tokens")
    .select("amount")
    .eq("user_id", userId);
  if (error) throw error;

  const balance =
    data?.reduce((sum, row) => {
      return sum + (row.amount || 0);
    }, 0) || 0;

  const { data: escrowTasks, error: escrowError } = await supabaseAdmin
    .from("tasks")
    .select("reward, status")
    .eq("created_by", userId)
    .in("status", ["assigned", "submitted"]);
  if (escrowError) throw escrowError;

  const escrow =
    escrowTasks?.reduce((sum, task) => sum + (task.reward || 0), 0) || 0;
  return { balance, escrow };
}

async function assertBalance(userId, amount) {
  const { balance } = await getBalance(userId);
  if (balance < amount) {
    throw new Error("Insufficient tokens");
  }
}

export async function transferTokens(from, to, amount, taskId = null) {
  if (!from || !to) throw new Error("From and To users are required");
  ensurePositiveNumber(amount, "Amount");
  await assertBalance(from, amount);

  const { error: debitError } = await supabaseAdmin.from("tokens").insert({
    user_id: from,
    amount: -amount
  });
  if (debitError) throw debitError;

  const { error: creditError } = await supabaseAdmin.from("tokens").insert({
    user_id: to,
    amount
  });
  if (creditError) throw creditError;

  await supabaseAdmin.from("token_transactions").insert({
    from_user: from,
    to_user: to,
    task_id: taskId,
    amount
  });
  await logAudit("tokens.transfer", from, { to, amount, taskId });
  return { from, to, amount };
}

export async function escrowTokens(from, amount, taskId = null) {
  if (!from) throw new Error("From user is required");
  ensurePositiveNumber(amount, "Amount");
  await assertBalance(from, amount);

  const { error } = await supabaseAdmin.from("tokens").insert({
    user_id: from,
    amount: -amount
  });
  if (error) throw error;

  await supabaseAdmin.from("token_transactions").insert({
    from_user: from,
    to_user: null,
    task_id: taskId,
    amount
  });
  await logAudit("tokens.escrow", from, { amount, taskId });
  return { from, amount };
}

export async function releaseEscrow(to, amount, taskId = null) {
  if (!to) throw new Error("Recipient is required");
  ensurePositiveNumber(amount, "Amount");

  const { error } = await supabaseAdmin.from("tokens").insert({
    user_id: to,
    amount
  });
  if (error) throw error;

  await supabaseAdmin.from("token_transactions").insert({
    from_user: null,
    to_user: to,
    task_id: taskId,
    amount
  });
  await logAudit("tokens.release", to, { amount, taskId });
  return { to, amount };
}

export async function refundEscrow(from, amount, taskId = null) {
  if (!from) throw new Error("Creator is required");
  ensurePositiveNumber(amount, "Amount");

  const { error } = await supabaseAdmin.from("tokens").insert({
    user_id: from,
    amount
  });
  if (error) throw error;

  await supabaseAdmin.from("token_transactions").insert({
    from_user: null,
    to_user: from,
    task_id: taskId,
    amount
  });
  await logAudit("tokens.refund", from, { amount, taskId });
  return { from, amount };
}

export async function burnTokens(userId, amount, metadata = {}) {
  if (!userId) throw new Error("User id is required");
  ensurePositiveNumber(amount, "Amount");
  await assertBalance(userId, amount);

  const { error } = await supabaseAdmin.from("tokens").insert({
    user_id: userId,
    amount: -amount
  });
  if (error) throw error;

  await supabaseAdmin.from("token_transactions").insert({
    from_user: userId,
    to_user: null,
    task_id: null,
    amount: -amount
  });
  await logAudit("tokens.burn", userId, { amount, ...metadata });
  return { userId, amount };
}

