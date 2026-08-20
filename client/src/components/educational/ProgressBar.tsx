export function ProgressBar({ percent, size = "md" }: { percent: number; size?: "sm" | "md" }) {
  const clamped = Math.min(100, Math.max(0, percent));
  const height = size === "sm" ? "h-1.5" : "h-2.5";

  return (
    <div className={`w-full overflow-hidden rounded-full bg-gray-light/60 ${height}`}>
      <div
        className="h-full rounded-full bg-gradient-to-l from-gold to-gold-dark transition-all duration-500"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function ProgressBadge({ percent }: { percent: number }) {
  return (
    <div className="flex items-center gap-2">
      <ProgressBar percent={percent} size="sm" />
      <span className="whitespace-nowrap text-xs font-bold text-gold-dark">{percent}%</span>
    </div>
  );
}
