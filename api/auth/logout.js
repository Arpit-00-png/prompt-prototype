import { supabaseAdmin } from "../../lib/supabaseAdmin";

export async function handleLogout({ user }) {
  if (!user?.id) {
    return {
      status: 200,
      data: { message: "No active session" }
    };
  }

  await supabaseAdmin.from("audits").insert({
    action: "auth.logout",
    user_id: user.id,
    details: {}
  });

  return {
    status: 200,
    data: { message: "Logged out" }
  };
}

