
import { BookOpen, CalendarDays, TrendingUp } from "lucide-react";

import {
  type StudentLearningSession,
} from "../../../data/studentLearningHistory";

import {
  caseStudyContexts,
} from "../../../data/caseStudies";

type Props = {
  sessions: StudentLearningSession[];
};

export default function StudentLearningHistory({
  sessions,
}: Props) {
  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    }).format(new Date(date));

  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-white p-10 text-center">
        <BookOpen
          size={32}
          className="mx-auto text-slate-400"
        />

        <h3 className="mt-3 font-semibold">
          Belum Ada Riwayat Pembelajaran
        </h3>

        <p className="mt-2 text-sm text-text-secondary">
          Belum tersedia riwayat pembelajaran untuk siswa ini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => {
        const improvement =
          session.postTestScore - session.preTestScore;

        return (
          <div
            key={session.id}
            className="rounded-2xl border border-border bg-white p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">
                  {session.title}
                </h3>

                <p className="mt-1 text-sm text-text-secondary">
                  {caseStudyContexts[session.context]}
                </p>
              </div>

              <span className="rounded-lg bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                Selesai
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-text-secondary">
                  Pre-test
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {session.preTestScore}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-xs text-blue-700">
                  Post-test
                </p>
                <p className="mt-1 text-2xl font-bold text-blue-700">
                  {session.postTestScore}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="flex items-center gap-1 text-xs text-text-secondary">
                  <TrendingUp size={14} />
                  Perubahan Nilai
                </p>
                <p
                  className={`mt-1 text-2xl font-bold ${
                    improvement > 0
                      ? "text-green-600"
                      : improvement < 0
                        ? "text-red-600"
                        : "text-text-primary"
                  }`}
                >
                  {improvement > 0 ? "+" : ""}
                  {improvement}
                </p>
              </div>
            </div>

            <p className="mt-4 flex items-center gap-2 text-xs text-text-secondary">
              <CalendarDays size={14} />
              Diselesaikan pada {formatDate(session.completedAt)}
            </p>
          </div>
        );
      })}
    </div>
  );
}