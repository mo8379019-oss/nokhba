import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Image,
  LogOut,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/admin", label: "نظرة عامة", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "المستخدمين", icon: Users },
  { to: "/admin/teams", label: "الفرق والمواد", icon: GraduationCap },
  { to: "/admin/banners", label: "البانرات", icon: Image },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { logout } = useAuth();

  return (
    <aside className="flex h-full w-64 flex-col border-l border-gray-light/60 bg-dark text-white">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold text-dark">
          <GraduationCap className="h-5 w-5" />
        </span>
        <span className="font-bold">لوحة التحكم</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "bg-gold text-dark" : "text-white/80 hover:bg-white/10"
              }`
            }
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-3">
        <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10">
          <ArrowRight className="h-4 w-4" />
          العودة للموقع
        </Link>
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-primary-light hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
