
import type { ManagedQuestion } from "../../../utils/assessmentQuestionStorage";

type Props = {
  questions: ManagedQuestion[];
};

export default function AssessmentStats({ questions }: Props) {
  const statistics = [
    {
      label: "Total Soal",
      value: questions.length,
    },
    {
      label: "Pilihan Ganda",
      value: questions.filter(
        (question) => question.type === "MULTIPLE_CHOICE"
      ).length,
    },
    {
      label: "Esai",
      value: questions.filter(
        (question) => question.type === "ESSAY"
      ).length,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {statistics.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-border bg-white p-5"
        >
          <p className="text-sm text-text-secondary">
            {item.label}
          </p>
          <p className="mt-2 text-3xl font-bold">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
