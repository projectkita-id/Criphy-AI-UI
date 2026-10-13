
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Mail,
  UserRound,
} from "lucide-react";

import {
  demoStudents,
  studentStatuses,
} from "../../data/students";

import {
  demoStudentLearningHistory,
} from "../../data/studentLearningHistory";

import StudentLearningHistory from "../../components/admin/students/StudentLearningHistory";

export default function StudentDetail() {
  const { studentId } = useParams<{ studentId: string }>();

  const student = demoStudents.find(
    (item) => item.id === studentId
  );

  if (!student) {
    return (
      <div className="mx-auto max-w-5xl space-y-5">
        <h1 className="text-2xl font-bold">
          Siswa Tidak Ditemukan
        </h1>

        <p className="text-text-secondary">
          Data siswa yang diminta tidak tersedia.
        </p>

        <Link
          to="/admin/students"
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft size={16} />
          Kembali ke Daftar Siswa
        </Link>
      </div>
    );
  }

  const sessions = demoStudentLearningHistory
    .filter((session) => session.studentId === student.id)
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() -
        new Date(a.completedAt).getTime()
    );

  const averageImprovement =
    sessions.length > 0
      ? Math.round(
          sessions.reduce(
            (total, session) =>
              total +
              (session.postTestScore - session.preTestScore),
            0
          ) / sessions.length
        )
      : null;

  const formatDate = (date: string | null) => {
    if (!date) return "Belum ada aktivitas";

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    }).format(new Date(date));
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      {/* Back navigation */}
      <Link
        to="/admin/students"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft size={16} />
        Kembali ke Daftar Siswa
      </Link>

      {/* Demo Notice */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        Mode demo: profil, statistik, dan riwayat pembelajaran
        menggunakan data ilustratif, bukan data siswa nyata.
      </div>

      {/* Profile */}
      <section className="rounded-2xl border border-border bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-primary">
              <UserRound size={30} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                {student.name}
              </h1>

              <p className="mt-1 text-sm text-text-secondary">
                ID: {student.id}
              </p>
            </div>
          </div>

          <span
            className={`rounded-lg px-3 py-1 text-xs font-semibold ${
              student.status === "ACTIVE"
                ? "bg-green-50 text-green-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {studentStatuses[student.status]}
          </span>
        </div>

        <div className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
          <p className="flex items-center gap-3 text-sm">
            <Mail size={17} className="text-text-secondary" />
            {student.email}
          </p>

          <p className="flex items-center gap-3 text-sm">
            <GraduationCap
              size={18}
              className="text-text-secondary"
            />
            {student.className}
          </p>

          <p className="flex items-center gap-3 text-sm text-text-secondary">
            <CalendarDays size={17} />
            Aktivitas terakhir: {formatDate(student.lastActivity)}
          </p>
        </div>
      </section>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="text-sm text-text-secondary">
            Total Sesi Selesai
          </p>
          <p className="mt-2 text-3xl font-bold">
            {student.completedSessions}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="text-sm text-text-secondary">
            Rata-rata Nilai
          </p>
          <p className="mt-2 text-3xl font-bold">
            {student.averageScore !== null
              ? `${student.averageScore}%`
              : "—"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="text-sm text-text-secondary">
            Rata-rata Perubahan Nilai
          </p>

          <p
            className={`mt-2 text-3xl font-bold ${
              averageImprovement !== null &&
              averageImprovement > 0
                ? "text-green-600"
                : averageImprovement !== null &&
                    averageImprovement < 0
                  ? "text-red-600"
                  : "text-text-primary"
            }`}
          >
            {averageImprovement !== null
              ? `${averageImprovement > 0 ? "+" : ""}${averageImprovement}`
              : "—"}
          </p>
        </div>
      </div>

      {/* Learning history */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <BookOpen size={21} className="text-primary" />
              Riwayat Pembelajaran
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Hasil pre-test dan post-test dari sesi yang tersedia.
            </p>
          </div>

          <span className="text-sm text-text-secondary">
            {sessions.length} riwayat tersedia
          </span>
        </div>

        <StudentLearningHistory sessions={sessions} />
      </section>
    </div>
  );
}