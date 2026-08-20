import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, CheckCircle2, Clock } from "lucide-react";
import { usersApi } from "../../api/misc.api";
import { Loader } from "../../components/common/Loader";
import { ErrorState, EmptyState } from "../../components/common/States";
import { ProgressBadge } from "../../components/educational/ProgressBar";

export function AdminUserDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const userQuery = useQuery({ queryKey: ["admin-user", id], queryFn: () => usersApi.get(id!), enabled: !!id });
  const progressQuery = useQuery({
    queryKey: ["admin-user-progress", id],
    queryFn: () => usersApi.getProgress(id!),
    enabled: !!id,
  });

  if (userQuery.isLoading) return <Loader />;
  if (userQuery.isError || !userQuery.data) return <ErrorState message="تعذر تحميل بيانات المستخدم" />;

  const user = userQuery.data;

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1 text-sm text-dark-light">
        <Link to="/admin/users" className="hover:text-primary">المستخدمين</Link>
        <ChevronLeft className="h-3.5 w-3.5" />
        <span className="font-medium text-dark">{user.name}</span>
      </nav>

      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
              {user.name.charAt(0)}
            </span>
            <div>
              <h1 className="text-lg font-bold text-dark">{user.name}</h1>
              <p className="text-sm text-dark-light">{user.email} · {user.phone}</p>
              <p className="text-xs text-dark-light/70">{user.team?.name ?? "بدون فرقة"}</p>
            </div>
          </div>
          {user.progress && (
            <div className="w-full sm:w-56">
              <p className="mb-1 text-xs text-dark-light">إجمالي التقدم</p>
              <ProgressBadge percent={user.progress.percent} />
              <p className="mt-1 text-xs text-dark-light">
                {user.progress.completedLectures} / {user.progress.totalLectures} محاضرة مكتملة
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="mb-4 font-bold text-dark">سجل النشاط والمحاضرات</h3>

        {progressQuery.isLoading && <Loader />}
        {progressQuery.data && progressQuery.data.length === 0 && <EmptyState title="لم يبدأ الطالب أي محاضرة بعد" />}
        {progressQuery.data && progressQuery.data.length > 0 && (
          <div className="space-y-3">
            {progressQuery.data.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl bg-offwhite p-3 text-sm">
                <div>
                  <p className="font-medium text-dark">{p.lecture?.title}</p>
                  <p className="text-xs text-dark-light">{p.lecture?.subject?.team?.name} · {p.lecture?.subject?.name}</p>
                </div>
                <span
                  className={`badge ${
                    p.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : p.status === "IN_PROGRESS"
                      ? "bg-gold/20 text-gold-dark"
                      : "bg-gray-light text-dark-light"
                  }`}
                >
                  {p.status === "COMPLETED" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                  {p.status === "COMPLETED" ? "مكتملة" : p.status === "IN_PROGRESS" ? "جارية" : "لم تبدأ"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
