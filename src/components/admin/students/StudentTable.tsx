
import { Eye, Users } from "lucide-react";

import {
  studentStatuses,
  type Student,
} from "../../../data/students";

type Props = {
  students: Student[];
  onView: (student: Student) => void;
};

export default function StudentTable({
  students,
  onView,
}: Props) {
  const formatDate = (date: string | null) => {
    if (!date) return "Belum ada aktivitas";

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    }).format(new Date(date));
  };

  if (students.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-white p-12 text-center">
        <Users
          size={32}
          className="mx-auto text-slate-400"
        />

        <h3 className="mt-4 font-semibold">
          Tidak Ada Siswa
        </h3>

        <p className="mt-2 text-sm text-text-secondary">
          Tidak ada siswa yang sesuai dengan pencarian atau filter.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-white">
      <table className="w-full min-w-[850px] text-left text-sm">
        <thead className="border-b border-border bg-slate-50 text-text-secondary">
          <tr>
            <th className="px-5 py-4 font-semibold">Siswa</th>
            <th className="px-5 py-4 font-semibold">Kelas</th>
            <th className="px-5 py-4 font-semibold">Status</th>
            <th className="px-5 py-4 font-semibold">Sesi</th>
            <th className="px-5 py-4 font-semibold">Nilai</th>
            <th className="px-5 py-4 font-semibold">
              Aktivitas Terakhir
            </th>
            <th className="px-5 py-4 font-semibold">Aksi</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {students.map((student) => (
            <tr
              key={student.id}
              className="hover:bg-slate-50"
            >
              <td className="px-5 py-4">
                <p className="font-semibold">
                  {student.name}
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  {student.email}
                </p>
              </td>

              <td className="px-5 py-4">
                {student.className}
              </td>

              <td className="px-5 py-4">
                <span
                  className={`inline-flex rounded-lg px-3 py-1 text-xs font-semibold ${
                    student.status === "ACTIVE"
                      ? "bg-green-50 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {studentStatuses[student.status]}
                </span>
              </td>

              <td className="px-5 py-4">
                {student.completedSessions}
              </td>

              <td className="px-5 py-4">
                {student.averageScore !== null
                  ? `${student.averageScore}%`
                  : "—"}
              </td>

              <td className="px-5 py-4 text-text-secondary">
                {formatDate(student.lastActivity)}
              </td>

              <td className="px-5 py-4">
                <button
                  type="button"
                  onClick={() => onView(student)}
                  aria-label={`Lihat detail ${student.name}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-primary hover:bg-blue-50"
                >
                  <Eye size={16} />
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}