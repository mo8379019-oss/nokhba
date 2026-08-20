import { Inbox, AlertTriangle, RefreshCw } from "lucide-react";

export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-light bg-white/50 py-16 text-center">
      <Inbox className="h-10 w-10 text-dark-light/40" />
      <p className="font-semibold text-dark-light">{title}</p>
      {subtitle && <p className="text-sm text-dark-light/70">{subtitle}</p>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 py-16 text-center">
      <AlertTriangle className="h-10 w-10 text-primary" />
      <p className="font-semibold text-primary">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-2">
          <RefreshCw className="h-4 w-4" />
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}
