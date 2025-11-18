"use client";

export default function RewardCard({ reward, disabled, onRedeem }) {
  return (
    <article className="glass-panel flex flex-col gap-4">
      <header>
        <p className="text-xs uppercase tracking-widest text-brand-200">
          Sponsored by {reward.sponsor || "Community"}
        </p>
        <h3 className="text-xl font-semibold">{reward.title}</h3>
      </header>
      <p className="text-sm text-slate-300">{reward.description}</p>
      <div className="flex flex-wrap items-center justify-between text-sm">
        <span className="rounded-full border border-white/10 px-3 py-1">
          Cost: {reward.cost_tokens} TBM
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1">
          {reward.inventory === null
            ? "Unlimited"
            : `${reward.inventory} left`}
        </span>
      </div>
      <button
        type="button"
        className="btn-primary text-sm disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => onRedeem(reward)}
        disabled={disabled || (reward.inventory !== null && reward.inventory <= 0)}
      >
        {disabled ? "Please wait…" : "Redeem reward"}
      </button>
    </article>
  );
}

