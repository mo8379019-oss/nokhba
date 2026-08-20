import { useState, FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, ChevronLeft, ArrowLeft } from "lucide-react";
import { subjectsApi } from "../../api/subjects.api";
import { teamsApi } from "../../api/teams.api";
import { DataTable, Column } from "../../components/admin/DataTable";
import { FormModal, FormField } from "../../components/admin/FormModal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { useToast } from "../../components/common/Toast";
import { Subject } from "../../types";
import { Loader } from "../../components/common/Loader";

const emptyForm = { name: "", description: "", order: "0", status: "ACTIVE" as "ACTIVE" | "INACTIVE" };

export function AdminSubjectsPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const teamQuery = useQuery({ queryKey: ["team", teamId], queryFn: () => teamsApi.get(teamId!), enabled: !!teamId });
  const { data: subjects, isLoading } = useQuery({
    queryKey: ["admin-subjects", teamId],
    queryFn: () => subjectsApi.listByTeam(teamId!, true),
    enabled: !!teamId,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Subject | null>(null);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setModalOpen(true);
  }

  function openEdit(subject: Subject) {
    setEditing(subject);
    setForm({
      name: subject.name,
      description: subject.description ?? "",
      order: String(subject.order),
      status: subject.status,
    });
    setImageFile(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!teamId) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("order", form.order);
      fd.append("status", form.status);
      if (imageFile) fd.append("image", imageFile);

      if (editing) {
        await subjectsApi.update(editing.id, fd);
        showToast("تم تحديث المادة بنجاح");
      } else {
        await subjectsApi.create(teamId, fd);
        showToast("تم إنشاء المادة بنجاح");
      }
      queryClient.invalidateQueries({ queryKey: ["admin-subjects", teamId] });
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
      await subjectsApi.remove(deleteTarget.id);
      showToast("تم حذف المادة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["admin-subjects", teamId] });
    } catch (err) {
      showToast(err instanceof Error ? err.message : "تعذر حذف المادة", "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  const columns: Column<Subject>[] = [
    { header: "الترتيب", render: (s) => s.order },
    { header: "الاسم", render: (s) => s.name },
    { header: "عدد المحاضرات", render: (s) => s._count?.lectures ?? 0 },
    {
      header: "الحالة",
      render: (s) => (
        <span className={`badge ${s.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-light text-dark-light"}`}>
          {s.status === "ACTIVE" ? "مفعّلة" : "معطّلة"}
        </span>
      ),
    },
    {
      header: "إجراءات",
      render: (s) => (
        <div className="flex items-center gap-2">
          <Link to={`/admin/subjects/${s.id}/lectures`} className="btn-secondary !px-3 !py-1.5 text-xs">
            المحاضرات <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
          <button onClick={() => openEdit(s)} className="rounded-lg p-1.5 text-primary hover:bg-primary/10">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => setDeleteTarget(s)} className="rounded-lg p-1.5 text-primary hover:bg-primary/10">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1 text-sm text-dark-light">
        <Link to="/admin/teams" className="hover:text-primary">الفرق الدراسية</Link>
        <ChevronLeft className="h-3.5 w-3.5" />
        <span className="font-medium text-dark">{teamQuery.data?.name ?? "..."}</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-dark">مواد {teamQuery.data?.name}</h1>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          إضافة مادة
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <DataTable columns={columns} rows={subjects ?? []} rowKey={(s) => s.id} emptyLabel="لا توجد مواد بعد" />
      )}

      <FormModal
        open={modalOpen}
        title={editing ? "تعديل المادة" : "إضافة مادة جديدة"}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <FormField label="اسم المادة">
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
        title={`حذف المادة "${deleteTarget?.name}"؟`}
        message="سيتم حذف كل المحاضرات التابعة لها. لا يمكن التراجع عن هذا الإجراء."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
