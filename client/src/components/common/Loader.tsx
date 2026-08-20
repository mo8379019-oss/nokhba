export function Loader({ label = "جاري التحميل..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-dark-light">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card animate-pulse overflow-hidden">
      <div className="h-40 w-full bg-gray-light/60" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 rounded bg-gray-light/60" />
        <div className="h-3 w-1/2 rounded bg-gray-light/40" />
        <div className="h-2 w-full rounded bg-gray-light/40" />
      </div>
    </div>
  );
}

export function CardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
