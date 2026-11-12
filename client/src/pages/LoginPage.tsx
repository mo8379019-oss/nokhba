import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Phone, Lock, GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/common/Toast";

export function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(phone.trim(), password);
      showToast("تم تسجيل الدخول بنجاح");
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
          <h1 className="text-xl font-extrabold text-dark">تسجيل الدخول</h1>
          <p className="text-sm text-dark-light">سجّل دخولك للوصول إلى محاضراتك</p>
        </div>

        {error && <p className="mb-4 rounded-xl bg-primary/10 p-3 text-center text-sm text-primary">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-dark-light">رقم الهاتف</label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-light/50" />
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field pr-10"
                placeholder="01xxxxxxxxx"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-dark-light">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-light/50" />
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-10"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            <LogIn className="h-4 w-4" />
            {loading ? "جاري الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-dark-light">
          ليس لديك حساب؟{" "}
          <Link to="/register" className="font-semibold text-primary">
            إنشاء حساب جديد
          </Link>
        </p>
      </div>
    </div>
  );
}
