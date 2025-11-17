"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function AdminPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState({
    organization: "",
    amount: 0,
    recipientId: ""
  });
  const [rewardForm, setRewardForm] = useState({
    title: "",
    description: "",
    cost_tokens: 10,
    sponsor: "",
    coupon_code: "",
    inventory: ""
  });
  const [message, setMessage] = useState("");
  const [rewardMessage, setRewardMessage] = useState("");

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
      await fetchStats(session.access_token);
    };
    load();
  }, [router]);

  const fetchStats = async (accessToken) => {
    const response = await fetch("/api/admin/stats", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const data = await response.json();
    if (response.ok) {
      setStats(data);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) return;
    setMessage("");
    const response = await fetch("/api/admin/purchase_tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Unable to purchase tokens");
    } else {
      setMessage("Tokens purchased and recorded");
      setForm({ organization: "", amount: 0, recipientId: "" });
      await fetchStats(token);
    }
  };

  const handleRewardCreate = async (event) => {
    event.preventDefault();
    if (!token) return;
    setRewardMessage("");
    const response = await fetch("/api/admin/rewards/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(rewardForm)
    });
    const data = await response.json();
    if (!response.ok) {
      setRewardMessage(data.error || "Unable to add reward");
    } else {
      setRewardMessage("Reward added to catalog");
      setRewardForm({
        title: "",
        description: "",
        cost_tokens: 10,
        sponsor: "",
        coupon_code: "",
        inventory: ""
      });
      await fetchStats(token);
    }
  };

  return (
    <div className="space-y-8">
      <section className="glass-panel space-y-4">
        <header>
          <p className="text-xs uppercase tracking-widest text-brand-200">
            Admin console
          </p>
          <h1 className="text-3xl font-bold">
            Fuel the TBM economy with on-chain like controls
          </h1>
        </header>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
              Organization
            </span>
            <input
              value={form.organization}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, organization: event.target.value }))
              }
              className="w-full rounded-2xl border border-white/10 bg-black/30 p-4"
              placeholder="TBM Labs"
              required
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
              Token amount
            </span>
            <input
              type="number"
              min="1"
              value={form.amount}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, amount: Number(event.target.value) }))
              }
              className="w-full rounded-2xl border border-white/10 bg-black/30 p-4"
              required
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
              Recipient profile (optional)
            </span>
            <input
              value={form.recipientId}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, recipientId: event.target.value }))
              }
              className="w-full rounded-2xl border border-white/10 bg-black/30 p-4"
              placeholder="Profile UUID"
            />
          </label>
          <button type="submit" className="btn-primary md:col-span-2">
            Purchase tokens
          </button>
        </form>
        {message && (
          <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100">
            {message}
          </p>
        )}
      </section>

      <section className="glass-panel space-y-4">
        <header>
          <p className="text-xs uppercase tracking-widest text-brand-200">
            Sponsor rewards
          </p>
          <h2 className="text-2xl font-semibold">List a coupon or perk</h2>
        </header>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleRewardCreate}>
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
              Reward title
            </span>
            <input
              value={rewardForm.title}
              onChange={(event) =>
                setRewardForm((prev) => ({ ...prev, title: event.target.value }))
              }
              className="w-full rounded-2xl border border-white/10 bg-black/30 p-4"
              placeholder="1:1 Mentorship Slot"
              required
            />
          </label>
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
              Description
            </span>
            <textarea
              value={rewardForm.description}
              onChange={(event) =>
                setRewardForm((prev) => ({
                  ...prev,
                  description: event.target.value
                }))
              }
              className="w-full rounded-2xl border border-white/10 bg-black/30 p-4"
              rows={3}
              placeholder="Explain what the member receives"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
              Cost (TBM)
            </span>
            <input
              type="number"
              min="1"
              value={rewardForm.cost_tokens}
              onChange={(event) =>
                setRewardForm((prev) => ({
                  ...prev,
                  cost_tokens: Number(event.target.value)
                }))
              }
              className="w-full rounded-2xl border border-white/10 bg-black/30 p-4"
              required
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
              Sponsor
            </span>
            <input
              value={rewardForm.sponsor}
              onChange={(event) =>
                setRewardForm((prev) => ({ ...prev, sponsor: event.target.value }))
              }
              className="w-full rounded-2xl border border-white/10 bg-black/30 p-4"
              placeholder="Acme Corp"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
              Coupon code (optional)
            </span>
            <input
              value={rewardForm.coupon_code}
              onChange={(event) =>
                setRewardForm((prev) => ({
                  ...prev,
                  coupon_code: event.target.value
                }))
              }
              className="w-full rounded-2xl border border-white/10 bg-black/30 p-4"
              placeholder="TBM-THANKS-2025"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
              Inventory (leave blank for unlimited)
            </span>
            <input
              value={rewardForm.inventory}
              onChange={(event) =>
                setRewardForm((prev) => ({
                  ...prev,
                  inventory: event.target.value
                }))
              }
              className="w-full rounded-2xl border border-white/10 bg-black/30 p-4"
              placeholder="10"
            />
          </label>
          <button type="submit" className="btn-secondary md:col-span-2">
            Add reward
          </button>
        </form>
        {rewardMessage && (
          <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100">
            {rewardMessage}
          </p>
        )}
      </section>

      <section className="glass-panel space-y-4">
        <header>
          <p className="text-xs uppercase tracking-widest text-brand-200">
            Economy stats
          </p>
          <h2 className="text-2xl font-semibold">Live overview</h2>
        </header>
        {stats ? (
          <dl className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <dt className="text-xs uppercase tracking-wide text-slate-400">
                Contributors
              </dt>
              <dd className="text-3xl font-bold text-white">
                {stats.profiles}
              </dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <dt className="text-xs uppercase tracking-wide text-slate-400">
                Tasks
              </dt>
              <dd className="text-3xl font-bold text-white">{stats.tasks}</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <dt className="text-xs uppercase tracking-wide text-slate-400">
                Hours staked
              </dt>
              <dd className="text-3xl font-bold text-white">
                {stats.staked_hours}
              </dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <dt className="text-xs uppercase tracking-wide text-slate-400">
                Token supply
              </dt>
              <dd className="text-3xl font-bold text-white">
                {stats.token_supply}
              </dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <dt className="text-xs uppercase tracking-wide text-slate-400">
                Rewards
              </dt>
              <dd className="text-3xl font-bold text-white">{stats.rewards}</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <dt className="text-xs uppercase tracking-wide text-slate-400">
                Redemptions
              </dt>
              <dd className="text-3xl font-bold text-white">
                {stats.redemptions}
              </dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <dt className="text-xs uppercase tracking-wide text-slate-400">
                Token orders
              </dt>
              <dd className="text-3xl font-bold text-white">
                {stats.token_orders}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-slate-300">Fetching stats…</p>
        )}
      </section>
    </div>
  );
}

