import { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({ open, title, onClose, children, maxWidth = "max-w-lg" }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fadeIn overflow-y-auto">
      <div className={`w-full ${maxWidth} rounded-2xl bg-white p-6 shadow-lg animate-slideUp my-8`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-dark">{title}</h3>
          <button onClick={onClose} className="rounded-full p-1.5 text-dark-light hover:bg-gray-light/50">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
