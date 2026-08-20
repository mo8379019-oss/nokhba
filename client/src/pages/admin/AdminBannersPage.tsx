import { useState, FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { bannersApi } from "../../api/misc.api";
import { DataTable, Column } from "../../components/admin/DataTable";
import { FormModal, FormField } from "../../components/admin/FormModal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { useToast } from "../../components/common/Toast";
import { Banner } from "../../types";
import { Loader } from "../../components/common/Loader";

const emptyForm = { title: "", description: "", buttonText: "", link: "", order: "0", status: "ACTIVE" as "ACTIVE" | "INACTIVE" };

export function AdminBannersPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { data: banners, isLoading } = useQuery({ queryKey: ["admin-banners"], queryFn: () => bannersApi.list(true) });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setModalOpen(true);
  }

  function openEdit(banner: Banner) {
    setEditing(banner);
    setForm({
      title: banner.title,
      description: banner.description ?? "",
      buttonText: banner.buttonText ?? "",
      link: banner.link ?? "",
      order: String(banner.order),
      status: banner.status,
    });
    setImageFile(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("buttonText", form.buttonText);
      fd.append("link", form.link);
      fd.append("order", form.order);
      fd.append("status", form.status);
      if (imageFile) fd.append("image", imageFile);

      if (editing) {
        await bannersApi.update(editing.id, fd);
        showToast("تم تحديث البانر بنجاح");
      } else {
        if (!imageFile) {
          showToast("يجب اختيار صورة للبانر", "error");
          setSaving(false);
          return;
        }
        await bannersApi.create(fd);
        showToast("تم إنشاء البانر بنجاح");
      }
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
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
      await bannersApi.remove(deleteTarget.id);
      showToast("تم حذف البانر بنجاح");
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
    } catch (err) {
      showToast(err instanceof Error ? err.message : "تعذر حذف البانر", "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  const columns: Column<Banner>[] = [
    {
      header: "الصورة",
      render: (b) => <img src={b.imageUrl} alt={b.title} className="h-10 w-16 rounded-lg object-cover" />,
    },
    { header: "الترتيب", render: (b) => b.order },
    { header: "العنوان", render: (b) => b.title },
    {
      header: "الحالة",
      render: (b) => (
        <span className={`badge ${b.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-light text-dark-light"}`}>
          {b.status === "ACTIVE" ? "مفعّل" : "معطّل"}
        </span>
      ),
    },
    {
      header: "إجراءات",
      render: (b) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(b)} className="rounded-lg p-1.5 text-primary hover:bg-primary/10">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => setDeleteTarget(b)} className="rounded-lg p-1.5 text-primary hover:bg-primary/10">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-dark">إدارة البانرات</h1>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          إضافة بانر
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <DataTable columns={columns} rows={banners ?? []} rowKey={(b) => b.id} emptyLabel="لا توجد بانرات بعد" />
      )}

      <FormModal
        open={modalOpen}
        title={editing ? "تعديل البانر" : "إضافة بانر جديد"}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <FormField label="العنوان">
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
        </FormField>
        <FormField label="الوصف">
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field"
            rows={2}
          />
        </FormField>
        <FormField label={`الصورة ${editing ? "(اختر ملف جديد لاستبدالها)" : ""}`}>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="input-field" />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="نص الزر">
            <input value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} className="input-field" />
          </FormField>
          <FormField label="الرابط">
            <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="input-field" placeholder="/teams" />
          </FormField>
        </div>
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
              <option value="ACTIVE">مفعّل</option>
              <option value="INACTIVE">معطّل</option>
            </select>
          </FormField>
        </div>
      </FormModal>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`حذف البانر "${deleteTarget?.title}"؟`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
