import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Users } from "lucide-react";
import { teamsApi } from "../api/teams.api";
import { subjectsApi } from "../api/subjects.api";
import { SubjectCard } from "../components/educational/SubjectCard";
import { CardSkeletonGrid, Loader } from "../components/common/Loader";
import { EmptyState, ErrorState } from "../components/common/States";
import { ProgressBadge } from "../components/educational/ProgressBar";

export function TeamDetailsPage() {
  const { teamId } = useParams<{ teamId: string }>();

  const teamQuery = useQuery({ queryKey: ["team", teamId], queryFn: () => teamsApi.get(teamId!), enabled: !!teamId });
  const subjectsQuery = useQuery({
    queryKey: ["subjects", teamId],
    queryFn: () => subjectsApi.listByTeam(teamId!),
    enabled: !!teamId,
  });

  if (teamQuery.isLoading) return <Loader />;
  if (teamQuery.isError || !teamQuery.data) return <ErrorState message="تعذر تحميل بيانات الفرقة" />;

  const team = teamQuery.data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav className="mb-4 flex items-center gap-1 text-sm text-dark-light">
        <Link to="/teams" className="hover:text-primary">الفرق الدراسية</Link>
        <ChevronLeft className="h-3.5 w-3.5" />
        <span className="font-medium text-dark">{team.name}</span>
      </nav>

      <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-l from-primary to-primary-dark p-6 text-white sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/15">
              <Users className="h-7 w-7 text-gold" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold sm:text-2xl">{team.name}</h1>
              {team.description && <p className="mt-1 text-sm text-white/80">{team.description}</p>}
              <p className="mt-1 text-xs text-white/70">{team._count?.subjects ?? 0} مادة دراسية</p>
            </div>
          </div>
          {team.progress && (
            <div className="w-full sm:w-48">
              <p className="mb-1 text-xs text-white/80">نسبة إنجازك في الفرقة</p>
              <ProgressBadge percent={team.progress.percent} />
            </div>
          )}
        </div>
      </div>

      <h2 className="mb-5 text-xl font-extrabold text-dark">المواد الدراسية</h2>

      {subjectsQuery.isLoading && <CardSkeletonGrid />}
      {subjectsQuery.isError && <ErrorState message="تعذر تحميل المواد" onRetry={() => subjectsQuery.refetch()} />}
      {subjectsQuery.data && subjectsQuery.data.length === 0 && (
        <EmptyState title="لا توجد مواد دراسية متاحة حاليًا" />
      )}
      {subjectsQuery.data && subjectsQuery.data.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {subjectsQuery.data.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      )}
    </div>
  );
}
