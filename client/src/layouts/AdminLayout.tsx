import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { useAuth } from "../context/AuthContext";
import { Loader } from "../components/common/Loader";

export function AdminLayout() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (isLoading) return <Loader label="جاري التحقق من الصلاحيات..." />;
  if (!isAuthenticated || !isAdmin) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-offwhite">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="relative">
            <AdminSidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1">
        {/* Mobile topbar */}
        <div className="flex h-16 items-center justify-between border-b border-gray-light/60 bg-white px-4 md:hidden">
          <span className="font-bold text-dark">لوحة التحكم</span>
          <button onClick={() => setDrawerOpen(true)}>
            {drawerOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
