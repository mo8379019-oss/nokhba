import { useState, FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, ChevronLeft, FileText, Headphones } from "lucide-react";
import { lecturesApi } from "../../api/lectures.api";
import { subjectsApi } from "../../api/subjects.api";
import { DataTable, Column } from "../../components/admin/DataTable";
import { FormModal, FormField } from "../../components/admin/FormModal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { useToast } from "../../components/common/Toast";
import { Lecture } from "../../types";
import { Loader } from "../../components/common/Loader";

const emptyForm = { title: "", description: "", order: "0", status: "ACTIVE" as "ACTIVE" | "INACTIVE" };

export function AdminLecturesPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const subjectQuery = useQuery({
    queryKey: ["subject", subjectId],
    queryFn: () => subjectsApi.get(subjectId!),
    enabled: !!subjectId,
  });
  const { data: lectures, isLoading } = useQuery({
    queryKey: ["admin-lectures", subjectId],
    queryFn: () => lecturesApi.listBySubject(subjectId!, true),
    enabled: !!subjectId,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Lecture | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Lecture | null>(null);
  const [uploadProgressLabel, setUploadProgressLabel] = useState("");

  function resetFiles() {
    setPdfFile(null);
    setAudioFile(null);
    setThumbnailFile(null);
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    resetFiles();
    setModalOpen(true);
  }

  function openEdit(lecture: Lecture) {
    setEditing(lecture);
    setForm({
      title: lecture.title,
      description: lecture.description ?? "",
      order: String(lecture.order),
      status: lecture.status,
    });
    resetFiles();
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!subjectId) return;
    setSaving(true);
    setUploadProgressLabel("جاري رفع الملفات...");
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("order", form.order);
      fd.append("status", form.status);
      if (pdfFile) fd.append("pdf", pdfFile);
      if (audioFile) fd.append("audio", audioFile);
      if (thumbnailFile) fd.append("thumbnail", thumbnailFile);

      if (editing) {
        await lecturesApi.update(editing.id, fd);
        showToast("تم تحديث المحاضرة بنجاح");
      } else {
        await lecturesApi.create(subjectId, fd);
        showToast("تم إنشاء المحاضرة بنجاح");
      }
      queryClient.invalidateQueries({ queryKey: ["admin-lectures", subjectId] });
      setModalOpen(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "حدث خطأ أثناء الرفع", "error");
    } finally {
      setSaving(false);
      setUploadProgressLabel("");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await lecturesApi.remove(deleteTarget.id);
      showToast("تم حذف المحاضرة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["admin-lectures", subjectId] });
    } catch (err) {
      showToast(err instanceof Error ? err.message : "تعذر حذف المحاضرة", "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  const columns: Column<Lecture>[] = [
    { header: "الترتيب", render: (l) => l.order },
    { header: "العنوان", render: (l) => l.title },
    {
      header: "المحتوى",
      render: (l) => (
        <div className="flex gap-2">
          {l.pdfUrl && <span className="badge bg-primary/10 text-primary"><FileText className="h-3.5 w-3.5" /> PDF</span>}
          {l.audioUrl && <span className="badge bg-gold/15 text-gold-dark"><Headphones className="h-3.5 w-3.5" /> صوتي</span>}
          {!l.pdfUrl && !l.audioUrl && <span className="text-xs text-dark-light">—</span>}
        </div>
      ),
    },
    {
      header: "الحالة",
      render: (l) => (
        <span className={`badge ${l.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-light text-dark-light"}`}>
          {l.status === "ACTIVE" ? "مفعّلة" : "معطّلة"}
        </span>
      ),
    },
    {
      header: "إجراءات",
      render: (l) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(l)} className="rounded-lg p-1.5 text-primary hover:bg-primary/10">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => setDeleteTarget(l)} className="rounded-lg p-1.5 text-primary hover:bg-primary/10">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap items-center gap-1 text-sm text-dark-light">
        <Link to="/admin/teams" className="hover:text-primary">الفرق الدراسية</Link>
        <ChevronLeft className="h-3.5 w-3.5" />
        <Link to={`/admin/teams/${subjectQuery.data?.teamId}/subjects`} className="hover:text-primary">
          {subjectQuery.data?.team?.name}
        </Link>
        <ChevronLeft className="h-3.5 w-3.5" />
        <span className="font-medium text-dark">{subjectQuery.data?.name ?? "..."}</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-dark">محاضرات {subjectQuery.data?.name}</h1>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          إضافة محاضرة
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <DataTable columns={columns} rows={lectures ?? []} rowKey={(l) => l.id} emptyLabel="لا توجد محاضرات بعد" />
      )}

      <FormModal
        open={modalOpen}
        title={editing ? "تعديل المحاضرة" : "إضافة محاضرة جديدة"}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        loading={saving}
        submitLabel={uploadProgressLabel || "حفظ"}
      >
        <FormField label="عنوان المحاضرة">
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
        </FormField>
        <FormField label="الوصف">
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field"
            rows={3}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label={`ملف PDF ${editing?.pdfUrl ? "(موجود بالفعل - اختر ملف جديد لاستبداله)" : ""}`}>
            <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)} className="input-field" />
          </FormField>
          <FormField label={`ملف صوتي ${editing?.audioUrl ? "(موجود بالفعل - اختر ملف جديد لاستبداله)" : ""}`}>
            <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)} className="input-field" />
          </FormField>
        </div>

        <FormField label="صورة مصغّرة (اختياري)">
          <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)} className="input-field" />
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
        title={`حذف المحاضرة "${deleteTarget?.title}"؟`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
