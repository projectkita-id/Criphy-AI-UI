
type Props = {
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteQuestionModal({
  onCancel,
  onConfirm,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-question-title"
        className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl"
      >
        <h2
          id="delete-question-title"
          className="text-xl font-bold"
        >
          Hapus Soal?
        </h2>

        <p className="mt-3 text-sm text-text-secondary">
          Soal akan dihapus dari bank soal demo.
          Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-border px-5 py-3 text-sm font-medium"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white hover:bg-red-700"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
