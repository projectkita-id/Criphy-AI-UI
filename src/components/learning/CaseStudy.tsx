
import { BookOpen } from "lucide-react";

import {
  caseStudyContexts,
  type CaseStudy as CaseStudyData,
} from "../../data/caseStudies";

type Props = {
  caseStudy: CaseStudyData;
};

export default function CaseStudy({
  caseStudy,
}: Props) {
  return (
    <div className="rounded-xl border border-border bg-white p-7">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <BookOpen size={19} />
        STUDI KASUS
      </div>

      <h2 className="mt-4 text-xl font-bold">
        {caseStudy.title}
      </h2>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-primary">
          {caseStudy.topic}
        </span>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-text-secondary">
          {caseStudyContexts[caseStudy.context]}
        </span>
      </div>

      <p className="mt-6 whitespace-pre-line leading-relaxed text-text-primary">
        {caseStudy.description}
      </p>
    </div>
  );
}