"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const BUYER_TYPES = [
  { value: "individual", label: "Individual contributor" },
  { value: "company", label: "Company / Organization" }
];

export default function BuyTokensPage() {
  const [token, setToken] = useState("");
  const [form, setForm] = useState({
    buyerType: "individual",
    buyerName: "",
    buyerEmail: "",
    organization: "",
    amount: 10
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        setToken(session.access_token);
        setForm((prev) => ({
          ...prev,
          buyerName: session.user.user_metadata?.full_name || prev.buyerName,
          buyerEmail: session.user.email || prev.buyerEmail
        }));
      }
    };
    load();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) {
      setMessage("Please sign in to purchase TBM tokens.");
      return;
    }
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/tokens/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Unable to process purchase");
    } else {
      setMessage("Purchase recorded and tokens minted to your wallet.");
      setForm((prev) => ({ ...prev, amount: 10 }));
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <section className="glass-panel space-y-3">
        <p className="text-xs uppercase tracking-widest text-brand-200">
          Token desk
        </p>
        <h1 className="text-3xl font-bold">Buy TBM tokens</h1>
        <p className="text-sm text-slate-300">
          This prototype simulates payment capture. Submit the form to record a purchase,
          mint TBM to your wallet, and log the order for sponsor invoicing. Later we can
          plug in Razorpay or other PSPs.
        </p>
        {message && (
          <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
            {message}
          </p>
        )}
      </section>

      <form onSubmit={handleSubmit} className="glass-panel grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
            Buyer type
          </span>
          <select
            value={form.buyerType}
            onChange={(event) => handleChange("buyerType", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/30 p-4"
          >
            {BUYER_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
            Buyer name
          </span>
          <input
            value={form.buyerName}
            onChange={(event) => handleChange("buyerName", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/30 p-4"
            required
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
            Email
          </span>
          <input
            type="email"
            value={form.buyerEmail}
            onChange={(event) => handleChange("buyerEmail", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/30 p-4"
            required
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
            Organization (optional)
          </span>
          <input
            value={form.organization}
            onChange={(event) => handleChange("organization", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/30 p-4"
          />
        </label>
        <label className="text-sm md:col-span-2">
          <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
            Tokens to buy
          </span>
          <input
            type="number"
            min="5"
            step="5"
            value={form.amount}
            onChange={(event) => handleChange("amount", Number(event.target.value))}
            className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-2xl font-semibold"
            required
          />
        </label>
        <button
          type="submit"
          className="btn-primary md:col-span-2"
          disabled={loading}
        >
          {loading ? "Processing…" : "Submit purchase"}
        </button>
      </form>
    </div>
  );
}

