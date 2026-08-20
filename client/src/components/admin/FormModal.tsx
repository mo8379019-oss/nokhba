import { ReactNode } from "react";
import { Modal } from "../common/Modal";

interface FormModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  children: ReactNode;
  submitLabel?: string;
}

export function FormModal({ open, title, onClose, onSubmit, loading, children, submitLabel = "حفظ" }: FormModalProps) {
  return (
    <Modal open={open} title={title} onClose={onClose} maxWidth="max-w-xl">
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            إلغاء
          </button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? "جاري الحفظ..." : submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-dark-light">{label}</label>
      {children}
    </div>
  );
}
