
import { Link } from "react-router-dom";

import type { Student } from "../../../data/students";
import type { StudentLearningSession } from "../../../data/studentLearningHistory";
import { caseStudyContexts } from "../../../data/caseStudies";

type Props = {
  sessions: StudentLearningSession[];
  students: Student[];
};

export default function RecentSessions({
  sessions,
  students,
}: Props) {
  const studentMap = new Map(
    students.map((student) => [student.id, student])
  );

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    }).format(new Date(value));

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white">
      <div className="p-5">
        <h2 className="text-lg font-bold">
          Aktivitas Pembelajaran Terbaru
        </h2>

        <p className="mt-1 text-sm text-text-secondary">
          Riwayat sesi yang tersedia dalam data demo.
        </p>
      </div>

      {sessions.length === 0 ? (
        <p className="border-t border-border p-8 text-center text-sm text-text-secondary">
          Tidak ada sesi yang sesuai dengan filter.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="border-y border-border bg-slate-50 text-text-secondary">
              <tr>
                <th className="px-5 py-4">Siswa</th>
                <th className="px-5 py-4">Materi</th>
                <th className="px-5 py-4">Konteks</th>
                <th className="px-5 py-4">Pre-test</th>
                <th className="px-5 py-4">Post-test</th>
                <th className="px-5 py-4">Tanggal</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {sessions.map((session) => {
                const student = studentMap.get(
                  session.studentId
                );

                return (
                  <tr
                    key={session.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      {student ? (
                        <Link
                          to={`/admin/students/${student.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {student.name}
                        </Link>
                      ) : (
                        "Siswa tidak ditemukan"
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {session.title}
                    </td>

                    <td className="px-5 py-4">
                      {caseStudyContexts[session.context]}
                    </td>

                    <td className="px-5 py-4">
                      {session.preTestScore}
                    </td>

                    <td className="px-5 py-4 font-semibold text-blue-700">
                      {session.postTestScore}
                    </td>

                    <td className="px-5 py-4 text-text-secondary">
                      {formatDate(session.completedAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}