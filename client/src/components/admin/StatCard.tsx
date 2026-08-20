import { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
  accent = "primary",
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  accent?: "primary" | "gold";
}) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span
        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${
          accent === "gold" ? "bg-gold/15 text-gold-dark" : "bg-primary/10 text-primary"
        }`}
      >
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <p className="text-2xl font-extrabold text-dark">{value}</p>
        <p className="text-xs text-dark-light">{label}</p>
      </div>
    </div>
  );
}
