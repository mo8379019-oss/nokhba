import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Search, User, LogOut, LayoutDashboard, GraduationCap } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { to: "/", label: "الرئيسية" },
  { to: "/teams", label: "الفرق الدراسية" },
  { to: "/search", label: "البحث" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-light/60 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-primary">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-gold">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-lg">المنصة التعليمية</span>
            <span className="text-[11px] font-semibold text-gold-dark">سنتر النخبة</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-dark-light"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="btn-secondary">
                  <LayoutDashboard className="h-4 w-4" />
                  لوحة التحكم
                </Link>
              )}
              <Link to="/profile" className="btn-secondary">
                <User className="h-4 w-4" />
                {user?.name.split(" ")[0]}
              </Link>
              <button onClick={handleLogout} className="rounded-xl p-2.5 text-primary hover:bg-primary/5">
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">
                تسجيل الدخول
              </Link>
              <Link to="/register" className="btn-primary">
                إنشاء حساب
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="p-2 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="القائمة">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-gray-light/60 bg-white px-4 py-4 md:hidden animate-slideUp">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${
                    isActive ? "bg-primary/5 text-primary" : "text-dark-light"
                  }`
                }
              >
                {link.to === "/search" && <Search className="h-4 w-4" />}
                {link.label}
              </NavLink>
            ))}

            <hr className="my-2 border-gray-light/60" />

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-dark-light">
                    <LayoutDashboard className="h-4 w-4" /> لوحة التحكم
                  </Link>
                )}
                <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-dark-light">
                  <User className="h-4 w-4" /> الملف الشخصي
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-right text-sm font-medium text-primary"
                >
                  <LogOut className="h-4 w-4" /> تسجيل الخروج
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary flex-1">
                  تسجيل الدخول
                </Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary flex-1">
                  إنشاء حساب
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}