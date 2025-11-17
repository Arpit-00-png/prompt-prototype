"use client";

export default function StakeCard({ stake }) {
  return (
    <article className="glass-panel flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-brand-200">
          Stake #{stake.id}
        </p>
        <span className="text-xs font-semibold uppercase text-slate-300">
          {stake.status}
        </span>
      </div>
      <div className="text-4xl font-bold text-white">
        {stake.hours_staked}h
      </div>
      <p className="text-sm text-slate-300">
        Created{" "}
        {stake.created_at
          ? new Date(stake.created_at).toLocaleDateString()
          : "—"}
      </p>
    </article>
  );
}

