import { useQuery } from "@tanstack/react-query";
import { User, Phone, Mail, Calendar, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { progressApi } from "../api/progress.api";
import { ProgressBar } from "../components/educational/ProgressBar";
import { Loader } from "../components/common/Loader";

export function ProfilePage() {
  const { user } = useAuth();
  const overallQuery = useQuery({ queryKey: ["progress-overall"], queryFn: () => progressApi.overall() });

  if (!user) return <Loader />;

  const overall = overallQuery.data;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-extrabold text-dark">الملف الشخصي</h1>

      <div className="mb-6 rounded-2xl border border-gray-light/60 bg-white p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
            {user.name.charAt(0)}
          </span>
          <div>
            <h2 className="text-lg font-bold text-dark">{user.name}</h2>
            {user.team && <p className="text-sm text-dark-light">{user.team.name}</p>}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoRow icon={Phone} label="رقم الهاتف" value={user.phone} />
          <InfoRow icon={Mail} label="البريد الإلكتروني" value={user.email} />
          <InfoRow icon={Users} label="الفرقة الدراسية" value={user.team?.name ?? "غير محدد"} />
          <InfoRow icon={Calendar} label="تاريخ الانضمام" value={new Date(user.createdAt).toLocaleDateString("ar-EG")} />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-light/60 bg-white p-6 shadow-soft">
        <h3 className="mb-4 text-lg font-bold text-dark">نسبة التقدم</h3>

        {overallQuery.isLoading && <Loader />}

        {overall && (
          <>
            <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <StatBox label="الإجمالي" value={overall.totalLectures} />
              <StatBox label="مكتملة" value={overall.completedLectures} />
              <StatBox label="متبقية" value={overall.totalLectures - overall.completedLectures} />
            </div>
            <div className="mb-1 flex justify-between text-sm text-dark-light">
              <span>الإنجاز الكلي</span>
              <span className="font-bold text-gold-dark">{overall.percent}%</span>
            </div>
            <ProgressBar percent={overall.percent} />
          </>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-offwhite p-3">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-xs text-dark-light">{label}</p>
        <p className="text-sm font-semibold text-dark">{value}</p>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-offwhite p-4 text-center">
      <p className="text-2xl font-extrabold text-primary">{value}</p>
      <p className="mt-1 text-xs text-dark-light">{label}</p>
    </div>
  );
}
