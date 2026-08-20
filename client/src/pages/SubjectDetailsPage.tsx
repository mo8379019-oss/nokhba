import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, BookOpen } from "lucide-react";
import { subjectsApi } from "../api/subjects.api";
import { lecturesApi } from "../api/lectures.api";
import { LectureCard } from "../components/educational/LectureCard";
import { Loader } from "../components/common/Loader";
import { EmptyState, ErrorState } from "../components/common/States";
import { ProgressBadge } from "../components/educational/ProgressBar";

export function SubjectDetailsPage() {
  const { subjectId } = useParams<{ subjectId: string }>();

  const subjectQuery = useQuery({
    queryKey: ["subject", subjectId],
    queryFn: () => subjectsApi.get(subjectId!),
    enabled: !!subjectId,
  });
  const lecturesQuery = useQuery({
    queryKey: ["lectures", subjectId],
    queryFn: () => lecturesApi.listBySubject(subjectId!),
    enabled: !!subjectId,
  });

  if (subjectQuery.isLoading) return <Loader />;
  if (subjectQuery.isError || !subjectQuery.data) return <ErrorState message="تعذر تحميل بيانات المادة" />;

  const subject = subjectQuery.data;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm text-dark-light">
        <Link to="/teams" className="hover:text-primary">الفرق الدراسية</Link>
        <ChevronLeft className="h-3.5 w-3.5" />
        <Link to={`/teams/${subject.teamId}`} className="hover:text-primary">{subject.team?.name}</Link>
        <ChevronLeft className="h-3.5 w-3.5" />
        <span className="font-medium text-dark">{subject.name}</span>
      </nav>

      <div className="mb-8 rounded-2xl border border-gray-light/60 bg-white p-6 shadow-soft">
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/5">
            <BookOpen className="h-7 w-7 text-primary" />
          </span>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold text-dark">{subject.name}</h1>
            {subject.description && <p className="mt-1 text-sm text-dark-light">{subject.description}</p>}
            <p className="mt-1 text-xs text-dark-light/80">{subject._count?.lectures ?? 0} محاضرة</p>
          </div>
        </div>
        {subject.progress && (
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-dark-light">
              <span>نسبة إنجازك</span>
              <span>{subject.progress.completed} / {subject.progress.total} محاضرة</span>
            </div>
            <ProgressBadge percent={subject.progress.percent} />
          </div>
        )}
      </div>

      <h2 className="mb-4 text-lg font-extrabold text-dark">المحاضرات</h2>

      {lecturesQuery.isLoading && <Loader />}
      {lecturesQuery.isError && <ErrorState message="تعذر تحميل المحاضرات" onRetry={() => lecturesQuery.refetch()} />}
      {lecturesQuery.data && lecturesQuery.data.length === 0 && <EmptyState title="لا توجد محاضرات متاحة حاليًا" />}
      {lecturesQuery.data && lecturesQuery.data.length > 0 && (
        <div className="flex flex-col gap-3">
          {lecturesQuery.data.map((lecture) => (
            <LectureCard key={lecture.id} lecture={lecture} />
          ))}
        </div>
      )}
    </div>
  );
}
