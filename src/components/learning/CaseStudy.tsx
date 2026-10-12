import { BookOpen } from "lucide-react";
import { mockCase } from "../../data/learningSession";

export default function CaseStudy() {
  return (
    <div className="rounded-xl border border-border bg-white p-7">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <BookOpen size={19} />
        STUDI KASUS
      </div>

      <h2 className="mt-4 text-xl font-bold">
        {mockCase.title}
      </h2>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-primary">
          {mockCase.topic}
        </span>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-text-secondary">
          {mockCase.context}
        </span>
      </div>

      <p className="mt-6 leading-relaxed text-text-primary">
        {mockCase.description}
      </p>
    </div>
  );
}