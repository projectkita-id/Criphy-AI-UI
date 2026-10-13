
import type { Student } from "../../../data/students";

type Props = {
  students: Student[];
};

export default function StudentStats({ students }: Props) {
  const activeStudents = students.filter(
    (student) => student.status === "ACTIVE"
  ).length;

  const totalSessions = students.reduce(
    (total, student) => total + student.completedSessions,
    0
  );

  const studentsWithScores = students.filter(
    (student) => student.averageScore !== null
  );

  const averageScore =
    studentsWithScores.length > 0
      ? Math.round(
          studentsWithScores.reduce(
            (total, student) =>
              total + (student.averageScore ?? 0),
            0
          ) / studentsWithScores.length
        )
      : null;

  const statistics = [
    {
      label: "Total Siswa",
      value: students.length.toString(),
    },
    {
      label: "Siswa Aktif",
      value: activeStudents.toString(),
    },
    {
      label: "Sesi Selesai",
      value: totalSessions.toString(),
    },
    {
      label: "Rata-rata Nilai",
      value: averageScore !== null ? `${averageScore}%` : "—",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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