import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { teamsApi } from "../../api/teams.api";
import { DataTable, Column } from "../../components/admin/DataTable";
import { FormModal, FormField } from "../../components/admin/FormModal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { useToast } from "../../components/common/Toast";
import { Team } from "../../types";
import { Loader } from "../../components/common/Loader";

const emptyForm = { name: "", description: "", order: "0", status: "ACTIVE" as "ACTIVE" | "INACTIVE" };

export function AdminTeamsPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { data: teams, isLoading } = useQuery({ queryKey: ["admin-teams"], queryFn: () => teamsApi.list(true) });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Team | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Team | null>(null);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setModalOpen(true);
  }

  function openEdit(team: Team) {
    setEditing(team);
    setForm({
      name: team.name,
      description: team.description ?? "",
      order: String(team.order),
      status: team.status,
    });
    setImageFile(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("order", form.order);
      fd.append("status", form.status);
      if (imageFile) fd.append("image", imageFile);

      if (editing) {
        await teamsApi.update(editing.id, fd);
        showToast("تم تحديث الفرقة بنجاح");
      } else {
        await teamsApi.create(fd);
        showToast("تم إنشاء الفرقة بنجاح");
      }
      queryClient.invalidateQueries({ queryKey: ["admin-teams"] });
      setModalOpen(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "حدث خطأ ما", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await teamsApi.remove(deleteTarget.id);
      showToast("تم حذف الفرقة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["admin-teams"] });
    } catch (err) {
      showToast(err instanceof Error ? err.message : "تعذر حذف الفرقة", "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  const columns: Column<Team>[] = [
    { header: "الترتيب", render: (t) => t.order },
    { header: "الاسم", render: (t) => t.name },
    { header: "عدد المواد", render: (t) => t._count?.subjects ?? 0 },
    {
      header: "الحالة",
      render: (t) => (
        <span className={`badge ${t.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-light text-dark-light"}`}>
          {t.status === "ACTIVE" ? "مفعّلة" : "معطّلة"}
        </span>
      ),
    },
    {
      header: "إجراءات",
      render: (t) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/teams/${t.id}/subjects`}
            className="btn-secondary !px-3 !py-1.5 text-xs"
          >
            المواد <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
          <button onClick={() => openEdit(t)} className="rounded-lg p-1.5 text-primary hover:bg-primary/10">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => setDeleteTarget(t)} className="rounded-lg p-1.5 text-primary hover:bg-primary/10">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-dark">إدارة الفرق الدراسية</h1>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          إضافة فرقة
        </button>
      </div>

      {isLoading ? <Loader /> : <DataTable columns={columns} rows={teams ?? []} rowKey={(t) => t.id} emptyLabel="لا توجد فرق دراسية بعد" />}

      <FormModal
        open={modalOpen}
        title={editing ? "تعديل الفرقة" : "إضافة فرقة جديدة"}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <FormField label="اسم الفرقة">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
        </FormField>
        <FormField label="الوصف">
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field"
            rows={3}
          />
        </FormField>
        <FormField label="الصورة">
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="input-field" />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="الترتيب">
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
              className="input-field"
            />
          </FormField>
          <FormField label="الحالة">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as "ACTIVE" | "INACTIVE" })}
              className="input-field"
            >
              <option value="ACTIVE">مفعّلة</option>
              <option value="INACTIVE">معطّلة</option>
            </select>
          </FormField>
        </div>
      </FormModal>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`حذف الفرقة "${deleteTarget?.name}"؟`}
        message="سيتم حذف كل المواد والمحاضرات التابعة لها. لا يمكن التراجع عن هذا الإجراء."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
