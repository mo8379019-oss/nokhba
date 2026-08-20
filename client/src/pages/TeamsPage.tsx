import { useQuery } from "@tanstack/react-query";
import { teamsApi } from "../api/teams.api";
import { TeamCard } from "../components/educational/TeamCard";
import { CardSkeletonGrid } from "../components/common/Loader";
import { EmptyState, ErrorState } from "../components/common/States";

export function TeamsPage() {
  const teamsQuery = useQuery({ queryKey: ["teams"], queryFn: () => teamsApi.list() });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-extrabold text-dark">الفرق الدراسية</h1>

      {teamsQuery.isLoading && <CardSkeletonGrid />}
      {teamsQuery.isError && <ErrorState message="تعذر تحميل الفرق الدراسية" onRetry={() => teamsQuery.refetch()} />}
      {teamsQuery.data && teamsQuery.data.length === 0 && <EmptyState title="لا توجد فرق دراسية متاحة حاليًا" />}
      {teamsQuery.data && teamsQuery.data.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {teamsQuery.data.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}
