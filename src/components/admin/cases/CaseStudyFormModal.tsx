
import { useState, type FormEvent } from "react";
import { X } from "lucide-react";

import {
  caseStudyContexts,
  type CaseStudy,
  type CaseStudyContext,
  type CaseStudyStatus,
} from "../../../data/caseStudies";

export type CaseStudyFormData = {
  title: string;
  description: string;
  context: CaseStudyContext;
  topic: string;
  status: CaseStudyStatus;
};

type Props = {
  caseStudy: CaseStudy | null;
  onClose: () => void;
  onSave: (data: CaseStudyFormData) => boolean | Promise<boolean>;
};

type FormErrors = Partial<
  Record<"title" | "description" | "topic", string>
>;

export default function CaseStudyFormModal({
  caseStudy,
  onClose,
  onSave,
}: Props) {
  const isEditing = caseStudy !== null;

  const [form, setForm] = useState<CaseStudyFormData>({
    title: caseStudy?.title ?? "",
    description: caseStudy?.description ?? "",
    context: caseStudy?.context ?? "DAILY_LIFE",
    topic: caseStudy?.topic ?? "",
    status: caseStudy?.status ?? "DRAFT",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [saveError, setSaveError] = useState("");

  const updateField = <K extends keyof CaseStudyFormData>(
    field: K,
    value: CaseStudyFormData[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSaveError("");

    if (
      field === "title" ||
      field === "description" ||
      field === "topic"
    ) {
      setErrors((previous) => ({
        ...previous,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const nextErrors: FormErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = "Judul studi kasus wajib diisi.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Deskripsi wajib diisi.";
    }

    if (!form.topic.trim()) {
      nextErrors.topic = "Materi fisika wajib diisi.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const saved = await onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      topic: form.topic.trim(),
    });

    if (!saved) {
      setSaveError(
        "Gagal menyimpan studi kasus. Silakan coba lagi."
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-study-form-title"
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2
              id="case-study-form-title"
              className="text-xl font-bold"
            >
              {isEditing
                ? "Edit Studi Kasus"
                : "Tambah Studi Kasus"}
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              {isEditing
                ? "Perbarui informasi studi kasus."
                : "Buat studi kasus baru untuk pembelajaran fisika."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup formulir"
            className="rounded-lg p-2 text-text-secondary hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="max-h-[75vh] space-y-5 overflow-y-auto p-6"
        >
          <div>
            <label
              htmlFor="case-title"
              className="block text-sm font-semibold"
            >
              Judul Studi Kasus *
            </label>

            <input
              id="case-title"
              value={form.title}
              onChange={(event) =>
                updateField("title", event.target.value)
              }
              placeholder="Contoh: Dua Mobil di Jalan Raya"
              aria-invalid={Boolean(errors.title)}
              className="mt-2 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
            />

            {errors.title && (
              <p className="mt-2 text-sm text-red-600">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="case-description"
              className="block text-sm font-semibold"
            >
              Deskripsi *
            </label>

            <textarea
              id="case-description"
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Jelaskan situasi dan konflik kognitif..."
              rows={5}
              aria-invalid={Boolean(errors.description)}
              className="mt-2 w-full resize-y rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
            />

            {errors.description && (
              <p className="mt-2 text-sm text-red-600">
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="case-context"
                className="block text-sm font-semibold"
              >
                Konteks Pembelajaran
              </label>

              <select
                id="case-context"
                value={form.context}
                onChange={(event) =>
                  updateField(
                    "context",
                    event.target.value as CaseStudyContext
                  )
                }
                className="mt-2 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
              >
                {Object.entries(caseStudyContexts).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="case-topic"
                className="block text-sm font-semibold"
              >
                Materi Fisika *
              </label>

              <input
                id="case-topic"
                value={form.topic}
                onChange={(event) =>
                  updateField("topic", event.target.value)
                }
                placeholder="Contoh: GLB dan GLBB"
                aria-invalid={Boolean(errors.topic)}
                className="mt-2 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
              />

              {errors.topic && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.topic}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="case-status"
              className="block text-sm font-semibold"
            >
              Status Publikasi
            </label>

            <select
              id="case-status"
              value={form.status}
              onChange={(event) =>
                updateField(
                  "status",
                  event.target.value as CaseStudyStatus
                )
              }
              className="mt-2 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">
                Dipublikasikan
              </option>
            </select>
          </div>

          {saveError && (
            <p role="alert" className="text-sm text-red-600">
              {saveError}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-border pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-5 py-3 text-sm font-medium hover:bg-slate-50"
            >
              Batal
            </button>

            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {isEditing
                ? "Simpan Perubahan"
                : "Tambah Studi Kasus"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}