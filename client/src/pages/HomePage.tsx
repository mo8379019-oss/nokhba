import { useQuery } from "@tanstack/react-query";
import { teamsApi } from "../api/teams.api";
import { bannersApi } from "../api/misc.api";
import { BannerSlider } from "../components/educational/BannerSlider";
import { TeamCard } from "../components/educational/TeamCard";
import { CardSkeletonGrid } from "../components/common/Loader";
import { EmptyState, ErrorState } from "../components/common/States";

export function HomePage() {
  const bannersQuery = useQuery({ queryKey: ["banners"], queryFn: () => bannersApi.list() });
  const teamsQuery = useQuery({ queryKey: ["teams"], queryFn: () => teamsApi.list() });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {bannersQuery.data && bannersQuery.data.length > 0 && (
        <section className="mb-10">
          <BannerSlider banners={bannersQuery.data} />
        </section>
      )}

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-dark sm:text-2xl">الفرق الدراسية</h2>
        </div>

        {teamsQuery.isLoading && <CardSkeletonGrid />}
        {teamsQuery.isError && <ErrorState message="تعذر تحميل الفرق الدراسية" onRetry={() => teamsQuery.refetch()} />}
        {teamsQuery.data && teamsQuery.data.length === 0 && (
          <EmptyState title="لا توجد فرق دراسية متاحة حاليًا" />
        )}
        {teamsQuery.data && teamsQuery.data.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {teamsQuery.data.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
