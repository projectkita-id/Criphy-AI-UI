
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Lightbulb,
} from "lucide-react";

import {
  getLearningHistoryRecord,
} from "../utils/learningHistoryStorage";

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
  children: React.ReactNode;
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

export default function LearningHistoryDetail() {
  const { historyId } = useParams<{ historyId: string }>();

  const record = historyId
    ? getLearningHistoryRecord(historyId)
    : null;

  if (!record) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-white p-10 text-center">
        <BookOpen size={36} className="mx-auto text-text-secondary" />

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

      {/* Assessment status */}
      <section className="rounded-2xl border border-border bg-white p-6">
        <div className="flex items-center gap-2">
          <ClipboardList size={20} className="text-primary" />
          <h2 className="text-lg font-bold">
            Riwayat Asesmen
          </h2>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-sm font-semibold">
              Asesmen Awal
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              {record.preTest
                ? `Dikumpulkan ${formatDate(record.preTest.submittedAt)}`
                : "Belum tersedia"}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-sm font-semibold">
              Asesmen Akhir
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              {record.postTest
                ? `Dikumpulkan ${formatDate(record.postTest.submittedAt)}`
                : "Belum tersedia"}
            </p>
          </div>
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
              ? confidenceLabels[confidence] ?? "Tidak diketahui"
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