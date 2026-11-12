import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Eye, Trash2, FileSpreadsheet, FileText } from "lucide-react";
import { usersApi } from "../../api/misc.api";
import { teamsApi } from "../../api/teams.api";
import { DataTable, Column } from "../../components/admin/DataTable";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { useToast } from "../../components/common/Toast";
import { useDebounce } from "../../hooks/useDebounce";
import { User } from "../../types";
import { Loader } from "../../components/common/Loader";

// "all" = كل الطلاب، "none" = بدون فرقة، غير كده = id الفرقة
type Tab = string;

export function AdminUsersPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [exporting, setExporting] = useState<"xlsx" | "csv" | null>(null);
  const debouncedSearch = useDebounce(search, 400);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const teamsQuery = useQuery({ queryKey: ["admin-teams"], queryFn: () => teamsApi.list(true) });
  const teams = teamsQuery.data ?? [];

  const tabTeamId = tab === "all" ? undefined : tab;

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", tab, debouncedSearch, page],
    queryFn: () => usersApi.list({ page, limit: 20, search: debouncedSearch || undefined, teamId: tabTeamId }),
  });

  const tabs = [
    { id: "all", label: "الكل" },
    ...teams.map((t) => ({ id: t.id, label: t.name })),
    { id: "none", label: "بدون فرقة" },
  ];
  const currentLabel = tabs.find((t) => t.id === tab)?.label ?? "الطلاب";

  function selectTab(id: Tab) {
    setTab(id);
    setPage(1);
  }

  async function handleExport(format: "xlsx" | "csv") {
    setExporting(format);
    try {
      const blob = await usersApi.exportFile({ teamId: tabTeamId, format });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `طلاب - ${currentLabel}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      showToast("تعذر تحميل الملف", "error");
    } finally {
      setExporting(null);
    }
  }

  async function handleTeamChange(user: User, teamId: string) {
    try {
      await usersApi.update(user.id, { teamId });
      showToast("تم نقل الطالب للفرقة الجديدة");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (err) {
      showToast(err instanceof Error ? err.message : "تعذر تغيير الفرقة", "error");
    }
  }

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
    {
      header: "الفرقة",
      render: (u) => (
        <select
          value={u.teamId ?? ""}
          onChange={(e) => handleTeamChange(u, e.target.value)}
          className="input-field !w-auto !py-1.5 text-sm"
        >
          {!u.teamId && (
            <option value="" disabled>
              بدون فرقة
            </option>
          )}
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      ),
    },
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
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-dark">إدارة المستخدمين</h1>

        <div className="flex gap-2">
          <button onClick={() => handleExport("xlsx")} disabled={exporting !== null} className="btn-primary !px-4 !py-2 text-sm">
            <FileSpreadsheet className="h-4 w-4" />
            {exporting === "xlsx" ? "جاري التحميل..." : "تحميل Excel"}
          </button>
          <button onClick={() => handleExport("csv")} disabled={exporting !== null} className="btn-secondary !px-4 !py-2 text-sm">
            <FileText className="h-4 w-4" />
            {exporting === "csv" ? "جاري التحميل..." : "CSV"}
          </button>
        </div>
      </div>

      {/* تبويبات الفرق */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => selectTab(t.id)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t.id ? "bg-primary text-white" : "bg-white text-dark-light hover:bg-gray-light/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-light/50" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="ابحث بالاسم أو الهاتف..."
            className="input-field pr-10"
          />
        </div>
        {data?.meta && (
          <p className="text-sm text-dark-light">
            {currentLabel}: <span className="font-bold text-dark">{data.meta.total}</span> طالب
          </p>
        )}
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DataTable columns={columns} rows={data?.data ?? []} rowKey={(u) => u.id} emptyLabel="لا يوجد طلاب في هذا القسم" />

          {data?.meta && data.meta.totalPages > 1 && (
            <div className="flex flex-wrap justify-center gap-2">
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
