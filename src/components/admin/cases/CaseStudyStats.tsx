
import type { CaseStudy } from "../../../data/caseStudies";

type Props = {
  caseStudies: CaseStudy[];
};

export default function CaseStudyStats({
  caseStudies,
}: Props) {
  const statistics = [
    {
      label: "Total Studi Kasus",
      value: caseStudies.length,
    },
    {
      label: "Dipublikasikan",
      value: caseStudies.filter(
        (item) => item.status === "PUBLISHED"
      ).length,
    },
    {
      label: "Draft",
      value: caseStudies.filter(
        (item) => item.status === "DRAFT"
      ).length,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {statistics.map((statistic) => (
        <div
          key={statistic.label}
          className="rounded-2xl border border-border bg-white p-5"
        >
          <p className="text-sm text-text-secondary">
            {statistic.label}
          </p>

          <p className="mt-2 text-3xl font-bold">
            {statistic.value}
          </p>
        </div>
      ))}
    </div>
  );
}
