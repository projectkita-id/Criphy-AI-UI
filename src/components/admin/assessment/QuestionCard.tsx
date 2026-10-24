
import { Pencil, Trash2 } from "lucide-react";
import type { ManagedQuestion } from "../../../utils/assessmentQuestionStorage";

type Props = {
  question: ManagedQuestion;
  index: number;
  onEdit: (question: ManagedQuestion) => void;
  onDelete: (id: string) => void;
};

export default function QuestionCard({
  question,
  index,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold">
              Soal {index + 1}
            </span>

            <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-primary">
              {question.stage === "POST_TEST" ? "Post-test" : "Pre-test"}
            </span>

            <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {question.type === "MULTIPLE_CHOICE"
                ? "Pilihan Ganda"
                : "Esai"}
            </span>
          </div>

          <h2 className="font-semibold leading-relaxed">
            {question.question}
          </h2>

          {question.type === "MULTIPLE_CHOICE" && (
            <div className="mt-4 space-y-2">
              {question.options.map((option) => (
                <p
                  key={option.id}
                  className={`text-sm ${
                    option.id === question.correctAnswer
                      ? "font-semibold text-green-700"
                      : "text-text-secondary"
                  }`}
                >
                  {option.id}. {option.text}
                  {option.id === question.correctAnswer
                    ? " ✓ Kunci Jawaban"
                    : ""}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(question)}
            aria-label={`Edit soal ${index + 1}`}
            className="rounded-lg border border-border p-2.5 text-primary hover:bg-blue-50"
          >
            <Pencil size={18} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(question.id)}
            aria-label={`Hapus soal ${index + 1}`}
            className="rounded-lg border border-border p-2.5 text-red-600 hover:bg-red-50"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
