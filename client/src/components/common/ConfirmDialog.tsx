import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  title = "هل أنت متأكد من حذف هذا العنصر؟",
  message = "لا يمكن التراجع عن هذا الإجراء.",
  confirmLabel = "حذف",
  cancelLabel = "إلغاء",
  onConfirm,
  onCancel,
  loading,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fadeIn">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg animate-slideUp">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <AlertTriangle className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-center text-lg font-bold text-dark">{title}</h3>
        <p className="mt-1 text-center text-sm text-dark-light">{message}</p>
        <div className="mt-6 flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1" disabled={loading}>
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className="btn-danger flex-1" disabled={loading}>
            {loading ? "جاري الحذف..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
