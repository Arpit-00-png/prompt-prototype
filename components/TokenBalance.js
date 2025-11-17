"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function TokenBalance() {
  const [balance, setBalance] = useState(0);
  const [escrow, setEscrow] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const {
        data: { session }
      } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        setBalance(0);
        setEscrow(0);
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/tokens/balance`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      const data = await response.json();
      if (active) {
        if (response.ok) {
          setBalance(data.balance || 0);
          setEscrow(data.escrow || 0);
        } else {
          setBalance(0);
          setEscrow(0);
        }
        setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 15_000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="glass-panel flex flex-col gap-4">
      <header>
        <p className="text-xs uppercase tracking-widest text-brand-200">
          Token balance
        </p>
        <h2 className="text-4xl font-bold">
          {loading ? "…" : `${balance} TBM`}
        </h2>
      </header>
      <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-slate-300">
        <p>
          Escrowed for tasks:{" "}
          <strong className="text-white">{escrow} TBM</strong>
        </p>
        <p>
          Available now:{" "}
          <strong className="text-white">
            {Math.max(0, balance - escrow)} TBM
          </strong>
        </p>
      </div>
    </section>
  );
}

