
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  History,
} from "lucide-react";

import {
  fetchStudentLearningHistory,
  type StudentLearningHistoryRecord,
} from "../services/api";

import {
  loadLearningHistory,
  type LearningHistoryRecord,
} from "../utils/learningHistoryStorage";

import {
  caseStudyContexts,
  type CaseStudyContext,
} from "../data/caseStudies";

// Convert stored context codes into Indonesian labels.
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

// Format stored dates for the Indonesian interface.
function formatDate(date: string | null): string {
  if (!date) {
    return "Belum selesai";
  }

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

function getProgressItems(record: LearningHistoryRecord) {
  return [
    { label: "Pre-Test", done: Boolean(record.preTest) },
    { label: "Fase 1 — Aktivasi Konsepsi Awal", done: Boolean(record.phaseOneResponse) },
    { label: "Fase 2 — Konflik Kognitif", done: Boolean(record.phaseTwoResponse) },
    { label: "Fase 3 — Investigasi Berbasis Bukti", done: Boolean(record.phaseThreeResponse) },
    { label: "Fase 4 — Rekonstruksi Konsep", done: Boolean(record.phaseFourResponse) },
    { label: "Fase 5 — Refleksi dan Evaluasi", done: Boolean(record.phaseFiveResponse) },
    { label: "Post-Test", done: Boolean(record.postTest) },
  ];
}

// Display a single learning history record.
function HistoryCard({
  record,
}: {
  record: LearningHistoryRecord;
}) {
  const progressItems = getProgressItems(record);

  return (
    <div className="rounded-2xl border border-border bg-white p-6">
      {/* Case information */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-primary">
              {getContextLabel(record.context)}
            </span>

            {record.status === "COMPLETED" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                <CheckCircle2 size={14} />
                Selesai
              </span>
            ) : (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                Dalam Proses
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold text-text-primary">
            {record.caseStudy?.title ??
              "Studi Kasus Tidak Tersedia"}
          </h2>

          <p className="text-sm leading-relaxed text-text-secondary">
            {record.caseStudy?.description ??
              "Deskripsi studi kasus tidak tersedia."}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <BookOpen size={24} className="text-primary" />
        </div>
      </div>

      {/* Learning dates */}
      <div className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <CalendarDays
            size={18}
            className="mt-0.5 text-text-secondary"
          />

          <div>
            <p className="text-xs text-text-secondary">
              Tanggal Mulai
            </p>

            <p className="mt-1 text-sm font-medium">
              {formatDate(record.startedAt)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle2
            size={18}
            className="mt-0.5 text-text-secondary"
          />

          <div>
            <p className="text-xs text-text-secondary">
              Tanggal Selesai
            </p>

            <p className="mt-1 text-sm font-medium">
              {formatDate(record.completedAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-border bg-slate-50 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Progress Pengerjaan
        </p>

        <div className="grid gap-2 sm:grid-cols-2">
          {progressItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm"
            >
              <span
                className={
                  item.done
                    ? "flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700"
                    : "flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-500"
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
      </div>

      {/* Navigate to the history details page */}
      <div className="mt-6 flex justify-end border-t border-border pt-5">
        <Link
          to={`/history/${encodeURIComponent(record.id)}`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Lihat Detail
          <ArrowRight size={17} />
        </Link>
      </div>
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

export default function LearningHistory() {
  const navigate = useNavigate();
  const [backendHistory, setBackendHistory] = useState<LearningHistoryRecord[]>([]);
  const [hasFetchedHistory, setHasFetchedHistory] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetchStudentLearningHistory()
      .then((records) => {
        if (!isMounted) {
          return;
        }

        setBackendHistory(records.map(normalizeHistoryRecord));
        setHasFetchedHistory(true);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setBackendHistory([]);
        setHasFetchedHistory(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const history =
    hasFetchedHistory && backendHistory.length > 0
      ? backendHistory
      : loadLearningHistory();

  const completedCount = history.filter(
    (record) => record.status === "COMPLETED"
  ).length;

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      {/* Page heading */}
      <div>
        <p className="text-sm font-semibold text-primary">
          AKTIVITAS PEMBELAJARAN
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Riwayat Pembelajaran
        </h1>

        <p className="mt-2 text-text-secondary">
          Lihat kembali studi kasus dan asesmen yang telah
          kamu kerjakan.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-6">
          <div className="flex items-center gap-3">
            <History size={22} className="text-primary" />

            <span className="text-sm font-medium text-text-secondary">
              Total Riwayat
            </span>
          </div>

          <p className="mt-4 text-3xl font-bold">
            {history.length}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6">
          <div className="flex items-center gap-3">
            <CheckCircle2
              size={22}
              className="text-green-600"
            />

            <span className="text-sm font-medium text-text-secondary">
              Pembelajaran Selesai
            </span>
          </div>

          <p className="mt-4 text-3xl font-bold">
            {completedCount}
          </p>
        </div>
      </div>

      {/* History list */}
      {history.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-bold">
            Daftar Riwayat
          </h2>

          {history.map((record) => (
            <HistoryCard
              key={record.id}
              record={record}
            />
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="rounded-2xl border border-border bg-white px-6 py-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <History size={30} className="text-primary" />
          </div>

          <h2 className="mt-5 text-xl font-bold">
            Belum Ada Riwayat Pembelajaran
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
            Riwayat akan muncul setelah kamu menyelesaikan
            pembelajaran dan asesmen akhir.
          </p>

          <button
            type="button"
            onClick={() => navigate("/learn")}
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Mulai Pembelajaran
            <ArrowRight size={17} />
          </button>
        </div>
      )}
    </div>
  );
}