import { useQuery } from "@tanstack/react-query";
import { Users, GraduationCap, BookOpen, FileText, Headphones, TrendingUp } from "lucide-react";
import { dashboardApi } from "../../api/misc.api";
import { StatCard } from "../../components/admin/StatCard";
import { Loader } from "../../components/common/Loader";
import { ErrorState } from "../../components/common/States";
import { ProgressBadge } from "../../components/educational/ProgressBar";

interface Overview {
  stats: {
    totalUsers: number;
    totalTeams: number;
    totalSubjects: number;
    totalLectures: number;
    totalPdf: number;
    totalAudio: number;
    avgProgress: number;
  };
  recentUsers: { id: string; name: string; email: string; team?: { name: string } | null; createdAt: string }[];
  recentLectures: { id: string; title: string; subject: { name: string; team: { name: string } } }[];
  mostViewedSubjects: { name: string; views: number }[];
}

export function AdminOverviewPage() {
  const { data, isLoading, isError, refetch } = useQuery<Overview>({
    queryKey: ["admin-overview"],
    queryFn: () => dashboardApi.overview(),
  });

  if (isLoading) return <Loader />;
  if (isError || !data) return <ErrorState message="تعذر تحميل بيانات لوحة التحكم" onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-dark">نظرة عامة</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="إجمالي الطلاب" value={data.stats.totalUsers} />
        <StatCard icon={GraduationCap} label="الفرق الدراسية" value={data.stats.totalTeams} />
        <StatCard icon={BookOpen} label="المواد الدراسية" value={data.stats.totalSubjects} />
        <StatCard icon={FileText} label="المحاضرات" value={data.stats.totalLectures} accent="gold" />
        <StatCard icon={FileText} label="ملفات PDF" value={data.stats.totalPdf} accent="gold" />
        <StatCard icon={Headphones} label="ملفات صوتية" value={data.stats.totalAudio} accent="gold" />
        <StatCard icon={TrendingUp} label="متوسط تقدم الطلاب %" value={data.stats.avgProgress} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-4 font-bold text-dark">أحدث المستخدمين</h3>
          <div className="space-y-3">
            {data.recentUsers.length === 0 && <p className="text-sm text-dark-light">لا يوجد مستخدمين بعد</p>}
            {data.recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-dark">{u.name}</p>
                  <p className="text-xs text-dark-light">{u.team?.name ?? "بدون فرقة"}</p>
                </div>
                <span className="text-xs text-dark-light/70">{new Date(u.createdAt).toLocaleDateString("ar-EG")}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="mb-4 font-bold text-dark">أحدث المحاضرات</h3>
          <div className="space-y-3">
            {data.recentLectures.length === 0 && <p className="text-sm text-dark-light">لا توجد محاضرات بعد</p>}
            {data.recentLectures.map((l) => (
              <div key={l.id} className="text-sm">
                <p className="font-medium text-dark">{l.title}</p>
                <p className="text-xs text-dark-light">{l.subject.team.name} · {l.subject.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5 lg:col-span-2">
          <h3 className="mb-4 font-bold text-dark">أكثر المواد مشاهدة</h3>
          <div className="space-y-3">
            {data.mostViewedSubjects.length === 0 && <p className="text-sm text-dark-light">لا توجد بيانات كافية بعد</p>}
            {data.mostViewedSubjects.map((s, i) => (
              <div key={i}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-dark">{s.name}</span>
                  <span className="text-dark-light">{s.views} مشاهدة</span>
                </div>
                <ProgressBadge percent={Math.min(100, Math.round((s.views / (data.mostViewedSubjects[0]?.views || 1)) * 100))} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
