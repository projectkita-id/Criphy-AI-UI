
import { AlertTriangle } from "lucide-react";

type Props = {
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ResetAIConfigurationModal({
  onCancel,
  onConfirm,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-ai-title"
        className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <AlertTriangle size={24} />
        </div>

        <h2
          id="reset-ai-title"
          className="mt-5 text-xl font-bold"
        >
          Reset Konfigurasi AI?
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          Semua perubahan konfigurasi yang telah disimpan
          akan dihapus dan diganti dengan pengaturan bawaan.
          Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-border px-5 py-3 text-sm font-medium hover:bg-slate-50"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-amber-600 px-5 py-3 text-sm font-medium text-white hover:bg-amber-700"
          >
            Ya, Reset
          </button>
        </div>
      </div>
    </div>
  );
}