
import type { StudentLearningSession } from "../../../data/studentLearningHistory";

type Props = {
  sessions: StudentLearningSession[];
  totalStudents: number;
};

export default function MonitoringStats({
  sessions,
  totalStudents,
}: Props) {
  const average = (values: number[]) =>
    values.length
      ? Math.round(
          values.reduce((sum, value) => sum + value, 0) /
            values.length
        )
      : null;

  const preTestAverage = average(
    sessions.map((session) => session.preTestScore)
  );

  const postTestAverage = average(
    sessions.map((session) => session.postTestScore)
  );

  const stats = [
    { label: "Total Siswa", value: totalStudents },
    { label: "Sesi Tercatat", value: sessions.length },
    {
      label: "Rata-rata Pre-test",
      value: preTestAverage ?? "—",
    },
    {
      label: "Rata-rata Post-test",
      value: postTestAverage ?? "—",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-border bg-white p-5"
        >
          <p className="text-sm text-text-secondary">
            {stat.label}
          </p>

          <p className="mt-2 text-3xl font-bold">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}