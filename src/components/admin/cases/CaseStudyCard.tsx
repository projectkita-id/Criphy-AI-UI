
import {
  BookOpen,
  CalendarDays,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  caseStudyContexts,
  caseStudyStatuses,
  type CaseStudy,
} from "../../../data/caseStudies";

type Props = {
  caseStudy: CaseStudy;
  onEdit: (caseStudy: CaseStudy) => void;
  onDelete: (caseStudy: CaseStudy) => void;
};

export default function CaseStudyCard({
  caseStudy,
  onEdit,
  onDelete,
}: Props) {
  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(caseStudy.createdAt));

  return (
    <article className="rounded-2xl border border-border bg-white p-6 transition-shadow hover:shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-primary">
            {caseStudyContexts[caseStudy.context]}
          </span>

          <span
            className={`rounded-lg px-3 py-1 text-xs font-semibold ${
              caseStudy.status === "PUBLISHED"
                ? "bg-green-50 text-green-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {caseStudyStatuses[caseStudy.status]}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(caseStudy)}
            aria-label={`Edit ${caseStudy.title}`}
            className="rounded-lg border border-border p-2.5 text-primary hover:bg-blue-50"
          >
            <Pencil size={18} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(caseStudy)}
            aria-label={`Hapus ${caseStudy.title}`}
            className="rounded-lg border border-border p-2.5 text-red-600 hover:bg-red-50"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm text-text-secondary">
        <BookOpen size={16} />
        {caseStudy.topic}
      </div>

      <h2 className="mt-3 text-lg font-bold">
        {caseStudy.title}
      </h2>

      <p className="mt-3 text-sm leading-relaxed text-text-secondary">
        {caseStudy.description}
      </p>

      <div className="mt-6 flex items-center gap-2 border-t border-border pt-4 text-xs text-text-secondary">
        <CalendarDays size={15} />
        Dibuat {formattedDate}
      </div>
    </article>
  );
}