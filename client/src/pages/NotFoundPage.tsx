import { Link } from "react-router-dom";
import { Home, GraduationCap } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <GraduationCap className="h-8 w-8" />
      </span>
      <h1 className="text-4xl font-extrabold text-primary">404</h1>
      <p className="mt-2 text-lg font-semibold text-dark">الصفحة غير موجودة</p>
      <p className="mt-1 text-sm text-dark-light">الصفحة التي تبحث عنها غير متاحة أو تم نقلها</p>
      <Link to="/" className="btn-primary mt-6">
        <Home className="h-4 w-4" />
        العودة للرئيسية
      </Link>
    </div>
  );
}
