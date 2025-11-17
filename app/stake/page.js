"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import StakeCard from "../../components/StakeCard";
import { supabase } from "../../lib/supabaseClient";

export default function StakePage() {
  const router = useRouter();
  const [hours, setHours] = useState(5);
  const [stakes, setStakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
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
      await fetchStakes(session.user.id);
    };
    load();
  }, [router]);

  const fetchStakes = async (userId) => {
    const { data } = await supabase
      .from("stakes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setStakes(data || []);
  };

  const totalHours = useMemo(
    () => stakes.reduce((sum, stake) => sum + stake.hours_staked, 0),
    [stakes]
  );

  const handleStake = async (event) => {
    event.preventDefault();
    if (!token) return;
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/stake/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ hours })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Unable to stake");
    } else {
      setMessage(`Staked ${hours}h and minted tokens!`);
      const {
        data: { session }
      } = await supabase.auth.getSession();
      await fetchStakes(session.user.id);
    }
    setLoading(false);
  };

  const handleComplete = async (stakeId) => {
    if (!token) return;
    setLoading(true);
    const response = await fetch("/api/stake/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ stakeId })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Unable to complete stake");
    } else {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      await fetchStakes(session.user.id);
      setMessage("Stake marked as delivered. Reputation updated!");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <section className="glass-panel space-y-4">
        <header>
          <p className="text-xs uppercase tracking-widest text-brand-200">
            Stake hours
          </p>
          <h1 className="text-3xl font-bold">Mint TBM by staking time</h1>
        </header>
        <form onSubmit={handleStake} className="flex flex-col gap-4 md:flex-row">
          <label className="flex-1 text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
              Hours to stake
            </span>
            <input
              type="number"
              min="1"
              max="40"
              value={hours}
              onChange={(event) => setHours(Number(event.target.value))}
              className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-2xl font-semibold"
            />
          </label>
          <button
            type="submit"
            className="btn-primary self-end"
            disabled={loading}
          >
            {loading ? "Processing…" : "Stake & Mint"}
          </button>
        </form>
        {message && (
          <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100">
            {message}
          </p>
        )}
        <p className="text-sm text-slate-300">
          1 hour = 1 TBM token. Hours stay locked until marked delivered.
        </p>
      </section>

      <section className="space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-200">
              Your stakes
            </p>
            <h2 className="text-2xl font-semibold">
              {stakes.length} commitments • {totalHours} total hours
            </h2>
          </div>
        </header>
        {stakes.length === 0 ? (
          <p className="glass-panel text-sm text-slate-300">
            No stakes yet. Stake hours to earn TBM tokens.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {stakes.map((stake) => (
              <div key={stake.id} className="space-y-3">
                <StakeCard stake={stake} />
                {stake.status !== "completed" && (
                  <button
                    type="button"
                    className="btn-secondary w-full text-center text-sm"
                    onClick={() => handleComplete(stake.id)}
                    disabled={loading}
                  >
                    Mark delivered
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

