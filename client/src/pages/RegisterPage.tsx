import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { UserPlus, GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/common/Toast";
import { teamsApi } from "../api/teams.api";

export function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const teamsQuery = useQuery({ queryKey: ["teams"], queryFn: () => teamsApi.list() });

  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", teamId: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ ...form, teamId: form.teamId || undefined });
      showToast("تم إنشاء الحساب بنجاح");
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ ما");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md animate-slideUp rounded-2xl border border-gray-light/60 bg-white p-8 shadow-card">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-gold">
            <GraduationCap className="h-6 w-6" />
          </span>
          <h1 className="text-xl font-extrabold text-dark">إنشاء حساب جديد</h1>
          <p className="text-sm text-dark-light">انضم للمنصة وابدأ رحلتك التعليمية</p>
        </div>

        {error && <p className="mb-4 rounded-xl bg-primary/10 p-3 text-center text-sm text-primary">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-dark-light">الاسم بالكامل</label>
            <input
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="input-field"
              placeholder="اكتب اسمك بالكامل"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-dark-light">رقم الهاتف</label>
            <input
              required
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="input-field"
              placeholder="01xxxxxxxxx"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-dark-light">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="input-field"
              placeholder="example@mail.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-dark-light">كلمة المرور</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="input-field"
              placeholder="6 أحرف على الأقل"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-dark-light">الفرقة الدراسية (اختياري)</label>
            <select value={form.teamId} onChange={(e) => update("teamId", e.target.value)} className="input-field">
              <option value="">اختر الفرقة...</option>
              {teamsQuery.data?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            <UserPlus className="h-4 w-4" />
            {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-dark-light">
          لديك حساب بالفعل؟{" "}
          <Link to="/login" className="font-semibold text-primary">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
