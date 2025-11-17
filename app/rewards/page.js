"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import RewardCard from "../../components/RewardCard";
import { supabase } from "../../lib/supabaseClient";

export default function RewardsPage() {
  const [token, setToken] = useState("");
  const [rewards, setRewards] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [redeemingId, setRedeemingId] = useState(null);
  const [message, setMessage] = useState("");
  const [sessionChecked, setSessionChecked] = useState(false);

  const fetchRewards = useCallback(async (accessToken) => {
    const response = await fetch("/api/rewards/catalog", {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`
          }
        : {}
    });
    const data = await response.json();
    if (response.ok) {
      setRewards(data.rewards || []);
    }
  }, []);

  const fetchRedemptions = useCallback(async (accessToken) => {
    if (!accessToken) return;
    const response = await fetch("/api/rewards/redemptions", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const data = await response.json();
    if (response.ok) {
      setRedemptions(data.redemptions || []);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        setToken(session.access_token);
        await Promise.all([
          fetchRewards(session.access_token),
          fetchRedemptions(session.access_token)
        ]);
      } else {
        await fetchRewards();
      }
      setSessionChecked(true);
    };
    load();
  }, [fetchRewards, fetchRedemptions]);

  const handleRedeem = async (reward) => {
    if (!token) {
      setMessage("Please sign in to redeem rewards.");
      return;
    }
    setRedeemingId(reward.id);
    setMessage("");
    const response = await fetch("/api/rewards/redeem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ rewardId: reward.id })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Unable to redeem reward");
    } else {
      setMessage("Reward redeemed! Check confirmations below.");
      await Promise.all([fetchRewards(token), fetchRedemptions(token)]);
    }
    setRedeemingId(null);
  };

  if (!sessionChecked) {
    return <p className="glass-panel text-sm text-slate-300">Loading rewards…</p>;
  }

  return (
    <div className="space-y-8">
      <section className="glass-panel space-y-3">
        <p className="text-xs uppercase tracking-widest text-brand-200">
          Reward catalog
        </p>
        <h1 className="text-3xl font-bold">Redeem TBM for sponsored perks</h1>
        <p className="text-sm text-slate-300">
          Partners supply coupons, swag, mentorship slots, and more. Spend your earned
          TBM to unlock them, then our team will connect you with the sponsor.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/buy-tokens" className="btn-secondary">
            Need more tokens? Purchase
          </Link>
          <Link href="/dashboard" className="btn-primary">
            Back to dashboard
          </Link>
        </div>
        {message && (
          <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
            {message}
          </p>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {rewards.length === 0 ? (
          <p className="glass-panel text-sm text-slate-300">
            Catalog is coming soon. Sponsors are stocking up perks.
          </p>
        ) : (
          rewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              disabled={redeemingId === reward.id}
              onRedeem={handleRedeem}
            />
          ))
        )}
      </section>

      {token && (
        <section className="glass-panel space-y-3">
          <header>
            <p className="text-xs uppercase tracking-widest text-brand-200">
              Your redemptions
            </p>
            <h2 className="text-2xl font-semibold">Sponsor follow-ups</h2>
          </header>
          {redemptions.length === 0 ? (
            <p className="text-sm text-slate-300">
              Redeem a reward to see it tracked here.
            </p>
          ) : (
            <ul className="space-y-3">
              {redemptions.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm"
                >
                  <p className="font-semibold text-white">{entry.reward.title}</p>
                  <p className="text-slate-300">
                    Sponsor: {entry.reward.sponsor || "Community"}
                  </p>
                  <p className="text-slate-300 capitalize">Status: {entry.status}</p>
                  {entry.reward.coupon_code && (
                    <p className="mt-1 text-brand-200">
                      Code: <span className="font-mono">{entry.reward.coupon_code}</span>
                    </p>
                  )}
                  <p className="text-xs text-slate-400">
                    Redeemed on {new Date(entry.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

