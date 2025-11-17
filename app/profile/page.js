"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import RatingStars from "../../components/RatingStars";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/auth/login");
        return;
      }
      setToken(session.access_token);
      await ensureProfileRecord(session);
      await fetchProfile(session.user.id);
    };
    load();
  }, [router]);

  const ensureProfileRecord = async (session) => {
    if (!session?.access_token) return;
    await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({})
    });
  };

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data);
  };

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(profile)
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Unable to update profile");
    } else {
      setMessage("Profile updated");
    }
    setSaving(false);
  };

  if (!profile) {
    return <p className="glass-panel text-sm text-slate-300">Loading…</p>;
  }

  return (
    <div className="space-y-8">
      <section className="glass-panel space-y-4">
        <header>
          <p className="text-xs uppercase tracking-widest text-brand-200">
            Profile
          </p>
          <h1 className="text-3xl font-bold">Your contributor identity</h1>
        </header>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSave}>
          <label className="text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
              Name
            </span>
            <input
              value={profile.name || ""}
              onChange={(event) => handleChange("name", event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 p-4"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
              Skills
            </span>
            <input
              value={profile.skills || ""}
              onChange={(event) => handleChange("skills", event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 p-4"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
              Available hours
            </span>
            <input
              type="number"
              min="0"
              value={profile.available_hours || 0}
              onChange={(event) =>
                handleChange("available_hours", Number(event.target.value))
              }
              className="w-full rounded-2xl border border-white/10 bg-black/30 p-4"
            />
          </label>
          <div className="text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
              Reputation
            </span>
            <RatingStars reputation={profile.reputation || 0} />
          </div>
          <button
            type="submit"
            className="btn-primary md:col-span-2"
            disabled={saving}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
        {message && (
          <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100">
            {message}
          </p>
        )}
      </section>
    </div>
  );
}

