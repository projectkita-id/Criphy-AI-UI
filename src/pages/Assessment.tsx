
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ClipboardList,
} from "lucide-react";

import {
  createAssessmentSnapshot,
  loadAssessmentSnapshot,
} from "../utils/assessmentSnapshotStorage";

import type { ManagedQuestion } from "../utils/assessmentQuestionStorage";
import { archiveCompletedLearningCycle } from "../utils/learningHistoryArchive";

import {
  saveAssessmentSubmission,
  type AssessmentAnswer,
  type AssessmentType,
} from "../utils/assessmentStorage";

type AssessmentProps = {
  type: AssessmentType;
};

type AnswerMap = Record<string, string>;

export default function Assessment({ type }: AssessmentProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isPreTest = type === "pre-test";
  const title = isPreTest ? "Asesmen Awal" : "Asesmen Akhir";

  const context = (
    location.state as { context?: string } | null
  )?.context ?? null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [questions] = useState<ManagedQuestion[]>(() => {
    if (type === "pre-test") {
      return createAssessmentSnapshot();
    }

    return loadAssessmentSnapshot() ?? [];
  });

const currentQuestion = questions[currentIndex];

  const answeredCount = questions.filter(
    (question) => answers[question.id]?.trim()
  ).length;

  const progress =
  questions.length > 0
    ? (answeredCount / questions.length) * 100
    : 0;

  const updateAnswer = (value: string) => {
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: value,
    }));
  };

  const handleSubmit = () => {
    if (answeredCount !== questions.length) return;

    const formattedAnswers: AssessmentAnswer[] = questions.map(
      (question) => ({
        questionId: String(question.id),
        answer: answers[question.id].trim(),
      })
    );

    try {
      saveAssessmentSubmission({
        type,
        context,
        answers: formattedAnswers,
        submittedAt: new Date().toISOString(),
      });

      // After the post-test, archive the completed
      // learning cycle before showing the results.
      if (!isPreTest) {
        const archived = archiveCompletedLearningCycle();

        if (!archived) {
          setSaveError(
            "Asesmen tersimpan, tetapi riwayat pembelajaran " +
            "belum dapat diarsipkan. Silakan coba lagi."
          );
          setShowConfirm(false);
          return;
        }
      }

      setSaveError(null);
      setSubmitted(true);
      setShowConfirm(false);
    } catch (error) {
      console.error(
        "Failed to save assessment or archive history:",
        error
      );

      setSaveError(
        "Gagal menyimpan asesmen atau riwayat pembelajaran. " +
        "Silakan coba lagi."
      );
      setShowConfirm(false);
    }
  };


  if (questions.length === 0) {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-white p-10 text-center">
      <h1 className="text-2xl font-bold">
        Asesmen Tidak Tersedia
      </h1>

      <p className="mt-3 text-text-secondary">
        {isPreTest
          ? "Belum ada soal asesmen yang tersedia."
          : "Data soal asesmen awal tidak ditemukan. Mulai kembali dari asesmen awal."}
      </p>

      <button
        type="button"
        onClick={() =>
          navigate(
            isPreTest ? "/learn" : "/learn/pre-test"
          )
        }
        className="mt-6 rounded-lg bg-primary px-6 py-3 font-medium text-white"
      >
        Kembali
      </button>
    </div>
  );
}

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-white p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
          <Check size={32} />
        </div>

        <h1 className="mt-6 text-2xl font-bold">
          {title} Selesai!
        </h1>

        <p className="mt-3 text-text-secondary">
          Jawaban berhasil disimpan di browser untuk sesi demo.
          Data belum dikirim ke server.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate(
              isPreTest ? "/learn/session" : "/results",
              { state: { context } }
            )
          }
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          {isPreTest
            ? "Lanjut ke Pembelajaran"
            : "Lihat Hasil"}
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <ClipboardList size={18} />
          PENILAIAN PEMBELAJARAN
        </div>

        <h1 className="mt-2 text-3xl font-bold">{title}</h1>

        <p className="mt-2 text-text-secondary">
          Jawablah setiap pertanyaan berdasarkan pemahamanmu
          sendiri tanpa bantuan AI.
        </p>
      </div>

      {/* Progress */}
      <div className="rounded-xl border border-border bg-white p-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold">
            Progres Asesmen
          </p>
          <p className="text-sm text-text-secondary">
            {answeredCount} dari {questions.length} dijawab
          </p>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {questions.map((question, index) => {
            const isAnswered = Boolean(
              answers[question.id]?.trim()
            );

            return (
              <button
                key={question.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Soal ${index + 1}`}
                aria-current={
                  currentIndex === index ? "step" : undefined
                }
                className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${
                  currentIndex === index
                    ? "border-primary bg-primary text-white"
                    : isAnswered
                      ? "border-blue-200 bg-blue-50 text-primary"
                      : "border-border bg-white text-text-secondary hover:bg-slate-50"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question */}
      <div className="rounded-xl border border-border bg-white p-8">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-primary">
            {currentQuestion.type === "ESSAY"
              ? "Esai"
              : "Pilihan Ganda"}
          </span>

          <span className="text-sm text-text-secondary">
            Soal {currentIndex + 1} dari {questions.length}
          </span>
        </div>

        <h2 className="mt-6 text-xl font-semibold leading-relaxed">
          {currentQuestion.question}
        </h2>

        <div className="mt-8">
          {currentQuestion.type === "MULTIPLE_CHOICE" ? (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const selected =
                  answers[currentQuestion.id] === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => updateAnswer(option.id)}
                    aria-pressed={selected}
                    className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-colors ${
                      selected
                        ? "border-primary bg-blue-50"
                        : "border-border hover:border-blue-200"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${
                        selected
                          ? "bg-primary text-white"
                          : "bg-slate-100 text-text-secondary"
                      }`}
                    >
                      {option.id}
                    </span>

                    <span className="text-sm font-medium">
                      {option.text}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div>
              <label
                htmlFor="essay-answer"
                className="mb-3 block text-sm font-medium"
              >
                Jawaban Kamu
              </label>

              <textarea
                id="essay-answer"
                value={answers[currentQuestion.id] ?? ""}
                onChange={(event) =>
                  updateAnswer(event.target.value)
                }
                rows={7}
                placeholder="Tuliskan jawaban dan alasanmu di sini..."
                className="w-full resize-y rounded-xl border border-border p-4 text-sm leading-relaxed outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs text-text-secondary">
                Jelaskan alasanmu dengan jelas dan gunakan
                bukti yang relevan.
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          <button
            type="button"
            onClick={() =>
              setCurrentIndex((index) => index - 1)
            }
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft size={17} />
            Sebelumnya
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((index) => index + 1)
              }
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              Selanjutnya
              <ArrowRight size={17} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              disabled={answeredCount !== questions.length}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Selesaikan Asesmen
              <Check size={17} />
            </button>
          )}
        </div>
      </div>

      {/* Assessment note */}
      <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-5 text-sm text-blue-800">
        <BookOpen size={20} className="shrink-0" />
        <p>
          Jawabanmu tidak akan dinilai secara langsung
          selama asesmen berlangsung.
          Pastikan seluruh soal telah dijawab sebelum
          menyelesaikan asesmen.
        </p>
      </div>

      {saveError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {saveError}
        </div>
      )}

      {/* Confirmation modal */}
      {showConfirm && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl"
          >
            <h2
              id="confirm-title"
              className="text-xl font-bold"
            >
              Selesaikan {title}?
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Kamu telah menjawab {answeredCount} dari{" "}
              {questions.length} soal. Pastikan semua jawaban
              sudah sesuai sebelum melanjutkan.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-slate-50"
              >
                Periksa Kembali
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Ya, Selesaikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
