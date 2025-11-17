"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TaskCard from "../../components/TaskCard";
import { supabase } from "../../lib/supabaseClient";

export default function MarketplacePage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", reward: 0 });
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
      await Promise.all([fetchProfile(session.user.id), fetchTasks()]);
    };
    load();
  }, [router]);

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data);
  };

  const fetchTasks = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });
    setTasks(data || []);
    setLoading(false);
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!token) return;
    setMessage("");
    const response = await fetch("/api/tasks/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Unable to create task");
    } else {
      setMessage("Task published to marketplace");
      setForm({ title: "", description: "", reward: 0 });
      const {
        data: { session }
      } = await supabase.auth.getSession();
      await fetchTasks();
    }
  };

  const handleAssign = async (task) => {
    if (!token) return;
    setMessage("");
    const response = await fetch("/api/tasks/assign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ taskId: task.id })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Unable to accept task");
    } else {
      setMessage("Task accepted! Tokens moved to escrow.");
      const {
        data: { session }
      } = await supabase.auth.getSession();
      await fetchTasks();
    }
  };

  return (
    <div className="space-y-10">
      <section className="glass-panel space-y-4">
        <header>
          <p className="text-xs uppercase tracking-widest text-brand-200">
            Create task
          </p>
          <h1 className="text-3xl font-bold">Publish work to the collective</h1>
          {profile && (
            <p className="text-sm text-slate-300">
              Posting as <span className="text-white">{profile.name || profile.id}</span>
            </p>
          )}
        </header>
        <form
          onSubmit={handleCreate}
          className="grid gap-4 md:grid-cols-2 md:gap-6"
        >
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
              Title
            </span>
            <input
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-lg"
              placeholder="Resume review"
              required
            />
          </label>
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
              Description
            </span>
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              className="w-full rounded-2xl border border-white/10 bg-black/30 p-4"
              placeholder="Give background, deliverables, deadline…"
              rows={4}
              required
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
              Reward (TBM)
            </span>
            <input
              type="number"
              min="0"
              value={form.reward}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  reward: Number(event.target.value)
                }))
              }
              className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-lg"
            />
          </label>
          <button type="submit" className="btn-primary self-end">
            Publish task
          </button>
        </form>
        {message && (
          <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100">
            {message}
          </p>
        )}
      </section>

      <section className="space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-200">
              Marketplace
            </p>
            <h2 className="text-2xl font-semibold">Open tasks</h2>
          </div>
        </header>
        {loading ? (
          <p className="glass-panel text-sm text-slate-300">Loading tasks…</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {tasks
              .filter((task) => task.status === "open")
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  actionLabel="Assign to me"
                  onAction={() => handleAssign(task)}
                  disabled={task.created_by === profile?.id}
                />
              ))}
            {tasks.filter((task) => task.status === "open").length === 0 && (
              <p className="glass-panel text-sm text-slate-300">
                No open tasks. Create one above to keep the economy flowing.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

