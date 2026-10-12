
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock3,
  TrendingUp,
} from "lucide-react";

import { loadAssessmentSession } from "../utils/assessmentStorage";
import { calculateAssessmentScore } from "../utils/assessmentScoring";

export default function Results() {
  const assessments = loadAssessmentSession();

  const preTest = assessments.preTest
    ? calculateAssessmentScore(assessments.preTest)
    : null;

  const postTest = assessments.postTest
    ? calculateAssessmentScore(assessments.postTest)
    : null;

  const canCompare =
    preTest?.score != null && postTest?.score != null;

  const improvement = canCompare
    ? postTest.score! - preTest.score!
    : null;

  const formatScore = (score: number | null | undefined) =>
    score == null ? "—" : `${score}`;

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <ClipboardList size={18} />
          HASIL PEMBELAJARAN
        </div>

        <h1 className="mt-2 text-3xl font-bold">
          Hasil Asesmen
        </h1>

        <p className="mt-2 text-text-secondary">
          Lihat hasil pilihan ganda dan perkembangan
          pemahamanmu selama pembelajaran.
        </p>
      </div>

      {!assessments.preTest && !assessments.postTest ? (
        <div className="rounded-2xl border border-border bg-white p-10 text-center">
          <BookOpen
            size={42}
            className="mx-auto text-slate-400"
          />

          <h2 className="mt-5 text-xl font-bold">
            Belum Ada Hasil Asesmen
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm text-text-secondary">
            Kamu belum menyelesaikan asesmen.
            Mulai pembelajaran untuk melihat hasilnya.
          </p>

          <Link
            to="/learn"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            Mulai Pembelajaran
            <ArrowRight size={17} />
          </Link>
        </div>
      ) : (
        <>
          {/* Score cards */}
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-white p-6">
              <p className="text-sm font-medium text-text-secondary">
                Nilai Pilihan Ganda — Pre-Test
              </p>

              <p className="mt-3 text-4xl font-bold">
                {formatScore(preTest?.score)}
                <span className="ml-1 text-lg font-medium text-slate-400">
                  /100
                </span>
              </p>

              <p className="mt-3 text-sm text-text-secondary">
                {preTest
                  ? `${preTest.correctAnswers} dari ${preTest.totalQuestions} benar`
                  : "Belum dikerjakan"}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6">
              <p className="text-sm font-medium text-text-secondary">
                Nilai Pilihan Ganda — Post-Test
              </p>

              <p className="mt-3 text-4xl font-bold">
                {formatScore(postTest?.score)}
                <span className="ml-1 text-lg font-medium text-slate-400">
                  /100
                </span>
              </p>

              <p className="mt-3 text-sm text-text-secondary">
                {postTest
                  ? `${postTest.correctAnswers} dari ${postTest.totalQuestions} benar`
                  : "Belum dikerjakan"}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-text-secondary">
                  Perubahan Nilai Pilihan Ganda
                </p>
                <TrendingUp size={20} className="text-primary" />
              </div>

              <p className="mt-3 text-4xl font-bold">
                {improvement === null
                  ? "—"
                  : `${improvement > 0 ? "+" : ""}${improvement}`}
              </p>

              <p className="mt-3 text-sm text-text-secondary">
                {improvement === null
                  ? "Menunggu kedua asesmen"
                  : improvement > 0
                    ? "Nilai pilihan ganda meningkat"
                    : improvement < 0
                      ? "Nilai pilihan ganda menurun"
                      : "Nilai pilihan ganda tetap"}
              </p>
            </div>
          </div>

          {/* Comparison */}
          <div className="rounded-2xl border border-border bg-white p-7">
            <h2 className="text-xl font-bold">
              Perbandingan Nilai Pilihan Ganda
            </h2>

            <p className="mt-2 text-sm text-text-secondary">
              Perbandingan berdasarkan soal pilihan ganda
              yang telah dinilai secara otomatis.
            </p>

            <div className="mt-8 space-y-7">
              {[
                {
                  label: "Pre-Test",
                  score: preTest?.score ?? null,
                },
                {
                  label: "Post-Test",
                  score: postTest?.score ?? null,
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold">
                      {item.label}
                    </p>
                    <p className="text-sm font-bold">
                      {item.score === null
                        ? "Belum tersedia"
                        : `${item.score}/100`}
                    </p>
                  </div>

                  <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${item.score ?? 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evaluation status */}
          <div className="rounded-2xl border border-border bg-white p-7">
            <h2 className="text-xl font-bold">
              Status Evaluasi
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={22}
                  className="shrink-0 text-green-600"
                />

                <div>
                  <p className="font-semibold">
                    Pilihan Ganda
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Jawaban pilihan ganda dinilai
                    menggunakan kunci jawaban.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock3
                  size={22}
                  className="shrink-0 text-amber-500"
                />

                <div>
                  <p className="font-semibold">
                    Jawaban Esai — Menunggu Evaluasi
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Jawaban esai belum dinilai.
                    Evaluasi berbasis rubrik akan
                    tersedia setelah integrasi sistem.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important note */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
            <p className="text-sm leading-relaxed text-blue-800">
              <strong>Catatan:</strong> Nilai yang ditampilkan
              hanya mencakup soal pilihan ganda.
              Nilai akhir asesmen belum dapat ditentukan
              sebelum jawaban esai dievaluasi.
            </p>
          </div>

          <div className="flex justify-end">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              Kembali ke Dashboard
              <ArrowRight size={17} />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
