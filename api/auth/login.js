import { supabaseAdmin } from "../../lib/supabaseAdmin";

export async function handleLogin({ user, body }) {
  if (!user?.id) {
    throw new Error("User session required");
  }

  const profilePayload = {
    id: user.id,
    name: body?.name || user.user_metadata?.full_name || user.email?.split("@")[0],
    skills: body?.skills || "",
    available_hours: body?.available_hours ?? 0
  };

  const { data: existingProfile, error: fetchError } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    throw fetchError;
  }

  if (!existingProfile) {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .insert(profilePayload)
      .select()
      .single();
    if (error) throw error;

    await supabaseAdmin.from("audits").insert({
      action: "auth.login",
      user_id: user.id,
      details: { type: "first_login" }
    });

    return {
      status: 201,
      data: { profile: data, created: true }
    };
  }

  const updates = {};
  if (body?.name !== undefined) updates.name = body.name;
  if (body?.skills !== undefined) updates.skills = body.skills;
  if (body?.available_hours !== undefined) {
    updates.available_hours = body.available_hours;
  }
  if (Object.keys(updates).length > 0) {
    await supabaseAdmin.from("profiles").update(updates).eq("id", user.id);
  }

  await supabaseAdmin.from("audits").insert({
    action: "auth.login",
    user_id: user.id,
    details: { type: "returning" }
  });

  return {
    status: 200,
    data: { profile: existingProfile, created: false }
  };
}

