"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TokenBalance from "../../components/TokenBalance";
import TaskCard from "../../components/TaskCard";
import RatingStars from "../../components/RatingStars";
import { supabase } from "../../lib/supabaseClient";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const ensureProfileRecord = useCallback(async () => {
    const {
      data: { session }
    } = await supabase.auth.getSession();
    if (!session?.access_token) return;
    await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({})
    });
  }, []);

  const fetchProfile = useCallback(
    async (userId) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) {
        await ensureProfileRecord();
        const retry = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        setProfile(retry.data);
      } else {
        setProfile(data);
      }
    },
    [ensureProfileRecord]
  );

  const fetchTasks = useCallback(async (userId) => {
    setLoadingTasks(true);
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .or(`created_by.eq.${userId},assigned_to.eq.${userId}`)
      .order("created_at", { ascending: false })
      .limit(5);
    setTasks(data || []);
    setLoadingTasks(false);
  }, []);

  useEffect(() => {
    const load = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/auth/login");
        return;
      }
      await Promise.all([fetchProfile(session.user.id), fetchTasks(session.user.id)]);
    };
    load();
  }, [router, fetchProfile, fetchTasks]);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-2">
        <TokenBalance />
        <article className="glass-panel space-y-4">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-200">
                Reputation
              </p>
              <h2 className="text-4xl font-bold">
                {profile?.reputation ?? "—"}
              </h2>
            </div>
            <RatingStars reputation={profile?.reputation || 0} />
          </header>
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-200">
              Available hours
            </p>
            <p className="text-3xl font-semibold">
              {profile?.available_hours ?? 0}h
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-white/15 px-3 py-1">
              {profile?.name || "Contributor"}
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1">
              {profile?.skills || "Add skills"}
            </span>
          </div>
        </article>
      </section>

      <section className="glass-panel space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-200">
              Current flow
            </p>
            <h2 className="text-2xl font-bold">Your TBM workstream</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/stake" className="btn-secondary text-sm">
              Stake hours
            </Link>
            <Link href="/marketplace" className="btn-primary text-sm">
              Browse tasks
            </Link>
          </div>
        </header>
        {loadingTasks ? (
          <p className="text-sm text-slate-300">Loading tasks…</p>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-slate-300">
            No active tasks yet. Stake hours and pick one from the marketplace!
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                actionLabel="View task"
                onAction={() => router.push(`/task/${task.id}`)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Link href="/stake" className="glass-panel">
          <p className="text-xs uppercase tracking-widest text-brand-200">
            Step 1
          </p>
          <h3 className="text-2xl font-semibold">Stake time</h3>
          <p className="text-sm text-slate-300">
            Commit your available hours and mint TBM tokens against them.
          </p>
        </Link>
        <Link href="/marketplace" className="glass-panel">
          <p className="text-xs uppercase tracking-widest text-brand-200">
            Step 2
          </p>
          <h3 className="text-2xl font-semibold">Pick tasks</h3>
          <p className="text-sm text-slate-300">
            Secure trusted gigs from the marketplace or post your own needs.
          </p>
        </Link>
        <Link href="/profile" className="glass-panel">
          <p className="text-xs uppercase tracking-widest text-brand-200">
            Step 3
          </p>
          <h3 className="text-2xl font-semibold">Grow reputation</h3>
          <p className="text-sm text-slate-300">
            Complete work, release escrowed tokens, and build your TBM trust.
          </p>
        </Link>
      </section>
    </div>
  );
}

