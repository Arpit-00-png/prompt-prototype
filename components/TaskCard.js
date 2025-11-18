"use client";

export default function TaskCard({
  task,
  actionLabel,
  onAction,
  disabled = false
}) {
  return (
    <article className="glass-panel flex flex-col gap-3">
      <div>
        <p className="text-xs uppercase tracking-widest text-brand-200">
          Task
        </p>
        <h3 className="text-xl font-semibold">{task.title}</h3>
      </div>
      <p className="text-sm text-slate-300">{task.description}</p>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="rounded-full border border-white/15 px-3 py-1 text-xs">
          Reward: <strong>{task.reward} TBM</strong>
        </span>
        <span className="rounded-full border border-white/15 px-3 py-1 text-xs">
          Status: <strong className="capitalize">{task.status}</strong>
        </span>
      </div>
      {actionLabel && (
        <button
          type="button"
          onClick={() => onAction(task)}
          disabled={disabled}
          className="btn-primary text-center disabled:cursor-not-allowed disabled:opacity-60"
        >
          {disabled ? "Processing..." : actionLabel}
        </button>
      )}
    </article>
  );
}

