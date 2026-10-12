
import { useState } from "react";
import { X } from "lucide-react";
import type { ManagedQuestion } from "../../../utils/assessmentQuestionStorage";

type QuestionType = "MULTIPLE_CHOICE" | "ESSAY";

type QuestionForm = {
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: string;
};

type Props = {
  editingQuestion: ManagedQuestion | null;
  onClose: () => void;
  onSave: (question: ManagedQuestion) => boolean;
};

const optionIds = ["A", "B", "C", "D"];

function createForm(
  question: ManagedQuestion | null
): QuestionForm {
  if (!question) {
    return {
      type: "MULTIPLE_CHOICE",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "A",
    };
  }

  if (question.type === "MULTIPLE_CHOICE") {
    return {
      type: "MULTIPLE_CHOICE",
      question: question.question,
      options: optionIds.map(
        (id) =>
          question.options.find((option) => option.id === id)
            ?.text ?? ""
      ),
      correctAnswer: question.correctAnswer ?? "A",
    };
  }

  return {
    type: "ESSAY",
    question: question.question,
    options: ["", "", "", ""],
    correctAnswer: "A",
  };
}

export default function QuestionFormModal({
  editingQuestion,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<QuestionForm>(
    () => createForm(editingQuestion)
  );
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!form.question.trim()) {
      setError("Pertanyaan wajib diisi.");
      return;
    }

    if (
      form.type === "MULTIPLE_CHOICE" &&
      form.options.some((option) => !option.trim())
    ) {
      setError("Semua pilihan jawaban wajib diisi.");
      return;
    }

    const id = editingQuestion?.id ?? crypto.randomUUID();

    const question: ManagedQuestion =
      form.type === "MULTIPLE_CHOICE"
        ? {
            id,
            type: "MULTIPLE_CHOICE",
            question: form.question.trim(),
            options: optionIds.map((optionId, index) => ({
              id: optionId,
              text: form.options[index].trim(),
            })),
            correctAnswer: form.correctAnswer,
          }
        : {
            id,
            type: "ESSAY",
            question: form.question.trim(),
          };

    if (onSave(question)) {
      onClose();
    } else {
      setError("Gagal menyimpan soal. Silakan coba lagi.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="question-form-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-7 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h2
            id="question-form-title"
            className="text-xl font-bold"
          >
            {editingQuestion ? "Edit Soal" : "Tambah Soal"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="question-type"
              className="mb-2 block text-sm font-medium"
            >
              Jenis Soal
            </label>

            <select
              id="question-type"
              value={form.type}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  type: event.target.value as QuestionType,
                }))
              }
              className="w-full rounded-xl border border-border p-3"
            >
              <option value="MULTIPLE_CHOICE">
                Pilihan Ganda
              </option>
              <option value="ESSAY">Esai</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="question-text"
              className="mb-2 block text-sm font-medium"
            >
              Pertanyaan
            </label>

            <textarea
              id="question-text"
              rows={4}
              value={form.question}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  question: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-border p-3"
              placeholder="Masukkan pertanyaan..."
            />
          </div>

          {form.type === "MULTIPLE_CHOICE" && (
            <>
              <div className="space-y-3">
                <p className="text-sm font-medium">
                  Pilihan Jawaban
                </p>

                {optionIds.map((id, index) => (
                  <div
                    key={id}
                    className="flex items-center gap-3"
                  >
                    <span className="w-6 text-sm font-semibold">
                      {id}
                    </span>

                    <input
                      value={form.options[index]}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          options: previous.options.map(
                            (option, optionIndex) =>
                              optionIndex === index
                                ? event.target.value
                                : option
                          ),
                        }))
                      }
                      placeholder={`Pilihan ${id}`}
                      className="w-full rounded-xl border border-border p-3 text-sm"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label
                  htmlFor="correct-answer"
                  className="mb-2 block text-sm font-medium"
                >
                  Kunci Jawaban
                </label>

                <select
                  id="correct-answer"
                  value={form.correctAnswer}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      correctAnswer: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-border p-3"
                >
                  {optionIds.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
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
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              Simpan Soal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
