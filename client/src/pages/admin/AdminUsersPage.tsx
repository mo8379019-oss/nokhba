import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Eye, Trash2 } from "lucide-react";
import { usersApi } from "../../api/misc.api";
import { DataTable, Column } from "../../components/admin/DataTable";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { useToast } from "../../components/common/Toast";
import { useDebounce } from "../../hooks/useDebounce";
import { User } from "../../types";
import { Loader } from "../../components/common/Loader";

export function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const debouncedSearch = useDebounce(search, 400);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", debouncedSearch, page],
    queryFn: () => usersApi.list({ page, limit: 10, search: debouncedSearch || undefined }),
  });

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await usersApi.remove(deleteTarget.id);
      showToast("تم حذف المستخدم بنجاح");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    } catch {
      showToast("تعذر حذف المستخدم", "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  const columns: Column<User>[] = [
    { header: "الاسم", render: (u) => u.name },
    { header: "الهاتف", render: (u) => u.phone },
    { header: "البريد الإلكتروني", render: (u) => u.email },
    { header: "الفرقة", render: (u) => u.team?.name ?? "—" },
    {
      header: "الحالة",
      render: (u) => (
        <span className={`badge ${u.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-light text-dark-light"}`}>
          {u.status === "ACTIVE" ? "نشط" : "معطّل"}
        </span>
      ),
    },
    { header: "تاريخ التسجيل", render: (u) => new Date(u.createdAt).toLocaleDateString("ar-EG") },
    {
      header: "إجراءات",
      render: (u) => (
        <div className="flex items-center gap-2">
          <Link to={`/admin/users/${u.id}`} className="rounded-lg p-1.5 text-primary hover:bg-primary/10">
            <Eye className="h-4 w-4" />
          </Link>
          <button onClick={() => setDeleteTarget(u)} className="rounded-lg p-1.5 text-primary hover:bg-primary/10">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-dark">إدارة المستخدمين</h1>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-light/50" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="ابحث بالاسم أو البريد أو الهاتف..."
          className="input-field pr-10"
        />
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DataTable columns={columns} rows={data?.data ?? []} rowKey={(u) => u.id} emptyLabel="لا يوجد مستخدمين" />

          {data?.meta && data.meta.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: data.meta.totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-9 w-9 rounded-lg text-sm font-medium ${
                    page === i + 1 ? "bg-primary text-white" : "bg-white text-dark-light hover:bg-gray-light/50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title={`حذف المستخدم "${deleteTarget?.name}"؟`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
