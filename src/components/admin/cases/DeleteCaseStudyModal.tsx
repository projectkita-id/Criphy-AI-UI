
import { AlertTriangle, X } from "lucide-react";
import type { CaseStudy } from "../../../data/caseStudies";

type Props = {
  caseStudy: CaseStudy;
  onCancel: () => void;
  onConfirm: () => void;
  error?: string;
};

export default function DeleteCaseStudyModal({
  caseStudy,
  onCancel,
  onConfirm,
  error,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-case-title"
        aria-describedby="delete-case-description"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <AlertTriangle size={25} />
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Tutup konfirmasi"
            className="rounded-lg p-2 text-text-secondary hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <h2
          id="delete-case-title"
          className="mt-5 text-xl font-bold text-text-primary"
        >
          Hapus Studi Kasus?
        </h2>

        <p
          id="delete-case-description"
          className="mt-3 text-sm leading-relaxed text-text-secondary"
        >
          Anda akan menghapus studi kasus berikut:
        </p>

        <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">
          <p className="font-semibold text-red-900">
            {caseStudy.title}
          </p>

          <p className="mt-1 text-xs text-red-700">
            {caseStudy.topic}
          </p>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-text-secondary">
          Tindakan ini akan menghapus studi kasus dari daftar
          yang tersimpan di browser dan tidak dapat dibatalkan.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-4 text-sm text-red-600"
          >
            {error}
          </p>
        )}

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
            className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}