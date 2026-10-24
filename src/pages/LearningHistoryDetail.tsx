
import { Link, useParams } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";

import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Lightbulb,
  TrendingUp,
  XCircle,
} from "lucide-react";

import {
  fetchStudentLearningHistory,
  type StudentLearningHistoryRecord,
} from "../services/api";

import {
  getLearningHistoryRecord,
  type LearningHistoryRecord,
} from "../utils/learningHistoryStorage";

import {
  calculateAssessmentScore,
} from "../utils/assessmentScoring";

import type {
  AssessmentSubmission,
} from "../utils/assessmentStorage";

import type {
  ManagedQuestion,
} from "../utils/assessmentQuestionStorage";

import {
  caseStudyContexts,
  type CaseStudyContext,
} from "../data/caseStudies";

function getContextLabel(context: string | null): string {
  if (
    context === "DAILY_LIFE" ||
    context === "ENVIRONMENT" ||
    context === "TECHNOLOGY"
  ) {
    return caseStudyContexts[context as CaseStudyContext];
  }

  return "Konteks Tidak Diketahui";
}

function formatDate(date: string | null): string {
  if (!date) return "Belum tersedia";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Tanggal tidak tersedia";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

function AnswerBlock({
  label,
  answer,
}: {
  label: string;
  answer: string | null | undefined;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-text-primary">
        {label}
      </p>

      <div className="mt-2 rounded-xl bg-slate-50 p-4">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
          {answer?.trim() || "Jawaban tidak tersedia."}
        </p>
      </div>
    </div>
  );
}

function PhaseSection({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-white p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-primary">
          {number}
        </div>

        <h2 className="text-lg font-bold">{title}</h2>
      </div>

      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

function AssessmentHistorySection({
  title,
  submission,
  questions,
}: {
  title: string;
  submission: AssessmentSubmission | null;
  questions: ManagedQuestion[] | null;
}) {
  if (!submission) {
    return (
      <div className="rounded-xl border border-border p-5">
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-text-secondary">
          Asesmen belum tersedia.
        </p>
      </div>
    );
  }

  const result = questions
    ? calculateAssessmentScore(submission, questions)
    : null;

  return (
    <div className="rounded-xl border border-border p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-bold">{title}</h3>

          <p className="mt-1 text-sm text-text-secondary">
            Dikumpulkan {formatDate(submission.submittedAt)}
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 px-4 py-2 text-center">
          <p className="text-xs font-medium text-primary">
            Nilai Pilihan Ganda
          </p>

          <p className="mt-1 text-xl font-bold text-primary">
            {result?.score == null
              ? "—"
              : `${result.score}/100`}
          </p>
        </div>
      </div>

      {!questions ? (
        <div className="mt-5 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
          Data soal untuk asesmen ini tidak tersimpan.
          Jawaban asli masih tersedia, tetapi nilai dan
          teks soal tidak dapat ditampilkan secara akurat.

          <div className="mt-4 space-y-3">
            {submission.answers.map((answer, index) => (
              <AnswerBlock
                key={`${answer.questionId}-${index}`}
                label={`Jawaban ${index + 1} — ID: ${answer.questionId}`}
                answer={answer.answer}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {questions.map((question, index) => {
            const submittedAnswer = submission.answers.find(
              (answer) => answer.questionId === question.id
            );

            const answer = submittedAnswer?.answer ?? null;

            if (question.type === "MULTIPLE_CHOICE") {
              const isCorrect =
                answer === question.correctAnswer;

              const selectedOption = question.options.find(
                (option) => option.id === answer
              );

              const correctOption = question.options.find(
                (option) =>
                  option.id === question.correctAnswer
              );

              return (
                <div
                  key={question.id}
                  className="rounded-xl bg-slate-50 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      Soal {index + 1} — Pilihan Ganda
                    </p>

                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
                        <CheckCircle2 size={15} />
                        Benar
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
                        <XCircle size={15} />
                        Salah
                      </span>
                    )}
                  </div>

                  <p className="mt-3 whitespace-pre-wrap font-semibold leading-relaxed">
                    {question.question}
                  </p>

                  <div className="mt-4 space-y-3">
                    <AnswerBlock
                      label="Jawaban Kamu"
                      answer={
                        selectedOption?.text ??
                        (answer
                          ? "Pilihan tidak ditemukan."
                          : null)
                      }
                    />

                    {!isCorrect && (
                      <AnswerBlock
                        label="Jawaban Benar"
                        answer={
                          correctOption?.text ??
                          "Kunci jawaban tidak tersedia."
                        }
                      />
                    )}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={question.id}
                className="rounded-xl bg-slate-50 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Soal {index + 1} — Esai
                  </p>

                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
                    <Clock3 size={15} />
                    Belum Dinilai
                  </span>
                </div>

                <p className="mt-3 whitespace-pre-wrap font-semibold leading-relaxed">
                  {question.question}
                </p>

                <div className="mt-4">
                  <AnswerBlock
                    label="Jawaban Kamu"
                    answer={answer}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function normalizeHistoryRecord(
  record: StudentLearningHistoryRecord
): LearningHistoryRecord {
  return {
    ...record,
    caseStudy: {
      ...(record.caseStudy ?? {}),
      id: record.caseStudy?.id ?? record.id,
      title: record.caseStudy?.title ?? "Studi Kasus",
      context: record.caseStudy?.context ?? record.context,
      topic: record.caseStudy?.topic ?? null,
      description: record.caseStudy?.description ?? null,
      status: "VALIDATED",
      createdAt: record.startedAt,
    } as unknown as LearningHistoryRecord["caseStudy"],
    phaseOneResponse: record.phaseOneResponse as unknown as LearningHistoryRecord["phaseOneResponse"],
    phaseTwoResponse: record.phaseTwoResponse as unknown as LearningHistoryRecord["phaseTwoResponse"],
    phaseThreeResponse: record.phaseThreeResponse as unknown as LearningHistoryRecord["phaseThreeResponse"],
    phaseFourResponse: record.phaseFourResponse as unknown as LearningHistoryRecord["phaseFourResponse"],
    phaseFiveResponse: record.phaseFiveResponse as unknown as LearningHistoryRecord["phaseFiveResponse"],
    assessmentQuestions: null,
  };
}

export default function LearningHistoryDetail() {
  const { historyId } = useParams<{ historyId: string }>();
  const [backendRecords, setBackendRecords] = useState<LearningHistoryRecord[]>([]);

  useEffect(() => {
    fetchStudentLearningHistory()
      .then((records) => setBackendRecords(records.map(normalizeHistoryRecord)))
      .catch(() => setBackendRecords([]));
  }, []);

  const record = historyId
    ? backendRecords.find((item) => item.id === historyId) ?? getLearningHistoryRecord(historyId)
    : null;

  if (!record) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-white p-10 text-center">
        <BookOpen
          size={36}
          className="mx-auto text-text-secondary"
        />

        <h1 className="mt-5 text-2xl font-bold">
          Riwayat Tidak Ditemukan
        </h1>

        <p className="mt-3 text-text-secondary">
          Data pembelajaran yang kamu cari tidak tersedia.
        </p>

        <Link
          to="/history"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft size={17} />
          Kembali ke Riwayat
        </Link>
      </div>
    );
  }

  const confidenceLabels = {
    LOW: "Kurang Yakin",
    MEDIUM: "Cukup Yakin",
    HIGH: "Sangat Yakin",
  };

  const confidence = record.phaseOneResponse?.confidence;

  const progressItems = [
    { label: "Pre-Test", done: Boolean(record.preTest) },
    { label: "Fase 1 — Aktivasi Konsepsi Awal", done: Boolean(record.phaseOneResponse) },
    { label: "Fase 2 — Konflik Kognitif", done: Boolean(record.phaseTwoResponse) },
    { label: "Fase 3 — Investigasi Berbasis Bukti", done: Boolean(record.phaseThreeResponse) },
    { label: "Fase 4 — Rekonstruksi Konsep", done: Boolean(record.phaseFourResponse) },
    { label: "Fase 5 — Refleksi dan Evaluasi", done: Boolean(record.phaseFiveResponse) },
    { label: "Post-Test", done: Boolean(record.postTest) },
  ];

  const questions = record.assessmentQuestions ?? null;

  const preScore =
    record.preTest && questions
      ? calculateAssessmentScore(record.preTest, questions)
      : null;

  const postScore =
    record.postTest && questions
      ? calculateAssessmentScore(record.postTest, questions)
      : null;

  const improvement =
    preScore?.score != null && postScore?.score != null
      ? postScore.score - preScore.score
      : null;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        to="/history"
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <ArrowLeft size={17} />
        Kembali ke Riwayat
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-border bg-white p-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-primary">
            {getContextLabel(record.context)}
          </span>

          {record.status === "COMPLETED" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              <CheckCircle2 size={14} />
              Selesai
            </span>
          )}
        </div>

        <h1 className="mt-5 text-3xl font-bold">
          {record.caseStudy?.title ?? "Studi Kasus"}
        </h1>

        <p className="mt-3 leading-relaxed text-text-secondary">
          {record.caseStudy?.description ??
            "Deskripsi studi kasus tidak tersedia."}
        </p>

        <div className="mt-6 flex flex-wrap gap-5 border-t border-border pt-5 text-sm text-text-secondary">
          <span className="inline-flex items-center gap-2">
            <CalendarDays size={17} />
            Mulai: {formatDate(record.startedAt)}
          </span>

          <span className="inline-flex items-center gap-2">
            <CheckCircle2 size={17} />
            Selesai: {formatDate(record.completedAt)}
          </span>
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-white p-6">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={20} className="text-primary" />
          <h2 className="text-lg font-bold">Progress Pengerjaan</h2>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {progressItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3"
            >
              <span
                className={
                  item.done
                    ? "flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700"
                    : "flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-500"
                }
              >
                {item.done ? "✓" : "•"}
              </span>

              <span
                className={
                  item.done
                    ? "font-medium text-text-primary"
                    : "text-text-secondary"
                }
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Assessment history */}
      <section className="rounded-2xl border border-border bg-white p-6">
        <div className="flex items-center gap-2">
          <ClipboardList
            size={20}
            className="text-primary"
          />

          <h2 className="text-lg font-bold">
            Riwayat Asesmen
          </h2>
        </div>

        <p className="mt-2 text-sm text-text-secondary">
          Lihat kembali soal, jawaban, dan hasil asesmen
          yang digunakan dalam sesi pembelajaran ini.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-sm font-semibold">
              Pre-Test
            </p>

            <p className="mt-2 text-2xl font-bold">
              {preScore?.score == null
                ? "—"
                : `${preScore.score}/100`}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-sm font-semibold">
              Post-Test
            </p>

            <p className="mt-2 text-2xl font-bold">
              {postScore?.score == null
                ? "—"
                : `${postScore.score}/100`}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-5">
            <div className="flex items-center gap-2">
              <TrendingUp
                size={17}
                className="text-primary"
              />

              <p className="text-sm font-semibold">
                Perubahan Nilai
              </p>
            </div>

            <p className="mt-2 text-2xl font-bold">
              {improvement == null
                ? "—"
                : `${improvement > 0 ? "+" : ""}${improvement}`}
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs text-text-secondary">
          Nilai hanya mencakup soal pilihan ganda.
          Jawaban esai belum dinilai.
        </p>

        <div className="mt-7 space-y-5">
          <AssessmentHistorySection
            title="Asesmen Awal — Pre-Test"
            submission={record.preTest}
            questions={questions}
          />

          <AssessmentHistorySection
            title="Asesmen Akhir — Post-Test"
            submission={record.postTest}
            questions={questions}
          />
        </div>
      </section>

      {/* Phase 1 */}
      <PhaseSection
        number={1}
        title="Aktivasi Konsepsi Awal"
      >
        <AnswerBlock
          label="Prediksi Awal"
          answer={record.phaseOneResponse?.answer}
        />

        <p className="text-sm text-text-secondary">
          Tingkat keyakinan:{" "}
          <span className="font-semibold text-text-primary">
            {confidence
              ? confidenceLabels[confidence] ??
                "Tidak diketahui"
              : "Tidak tersedia"}
          </span>
        </p>
      </PhaseSection>

      {/* Phase 2 */}
      <PhaseSection
        number={2}
        title="Konflik Kognitif"
      >
        <AnswerBlock
          label="Jawaban terhadap Konflik Kognitif"
          answer={record.phaseTwoResponse}
        />
      </PhaseSection>

      {/* Phase 3 */}
      <PhaseSection
        number={3}
        title="Investigasi Berbasis Bukti"
      >
        <AnswerBlock
          label="Hasil Analisis Data"
          answer={record.phaseThreeResponse}
        />
      </PhaseSection>

      {/* Phase 4 */}
      <PhaseSection
        number={4}
        title="Rekonstruksi Konsep"
      >
        <div className="flex items-center gap-2 text-sm text-primary">
          <Lightbulb size={17} />
          Claim — Evidence — Reasoning
        </div>

        <AnswerBlock
          label="Claim — Klaim"
          answer={record.phaseFourResponse?.claim}
        />

        <AnswerBlock
          label="Evidence — Bukti"
          answer={record.phaseFourResponse?.evidence}
        />

        <AnswerBlock
          label="Reasoning — Penalaran"
          answer={record.phaseFourResponse?.reasoning}
        />
      </PhaseSection>

      {/* Phase 5 */}
      <PhaseSection
        number={5}
        title="Refleksi dan Evaluasi"
      >
        <AnswerBlock
          label="Perubahan Pemahaman"
          answer={record.phaseFiveResponse?.understanding}
        />

        <AnswerBlock
          label="Bukti yang Memengaruhi Pemahaman"
          answer={record.phaseFiveResponse?.evidence}
        />
      </PhaseSection>

      <div className="flex justify-end">
        <Link
          to="/history"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <ArrowLeft size={17} />
          Kembali ke Riwayat
        </Link>
      </div>
    </div>
  );
}