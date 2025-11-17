"use client";

const TOTAL_STARS = 5;

export default function RatingStars({ reputation = 0 }) {
  const normalized = Math.max(0, Math.min(100, reputation));
  const filledStars = Math.round((normalized / 100) * TOTAL_STARS);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: TOTAL_STARS }).map((_, idx) => (
        <svg
          key={idx}
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={`h-5 w-5 ${
            idx < filledStars ? "text-amber-400" : "text-white/20"
          }`}
          fill="currentColor"
        >
          <path d="M12 2.25l2.78 6.06 6.72.52-5.13 4.42 1.57 6.55L12 16.98l-5.94 2.82 1.57-6.55-5.13-4.42 6.72-.52L12 2.25z" />
        </svg>
      ))}
      <span className="text-xs text-slate-300">{normalized} rep</span>
    </div>
  );
}

