
import type { StudentLearningSession } from "../../../data/studentLearningHistory";

type Props = {
  sessions: StudentLearningSession[];
};

export default function AssessmentComparison({
  sessions,
}: Props) {
  const average = (scores: number[]) =>
    scores.length
      ? Math.round(
          scores.reduce((total, score) => total + score, 0) /
            scores.length
        )
      : 0;

  const preTest = average(
    sessions.map((session) => session.preTestScore)
  );

  const postTest = average(
    sessions.map((session) => session.postTestScore)
  );

  const difference = postTest - preTest;

  return (
    <section className="rounded-2xl border border-border bg-white p-6">
      <h2 className="text-lg font-bold">
        Perbandingan Hasil Asesmen
      </h2>

      <p className="mt-1 text-sm text-text-secondary">
        Rata-rata nilai dari sesi pembelajaran yang ditampilkan.
      </p>

      {sessions.length === 0 ? (
        <p className="mt-8 text-center text-sm text-text-secondary">
          Belum ada data asesmen untuk ditampilkan.
        </p>
      ) : (
        <div className="mt-8 space-y-6">
          {[
            {
              label: "Pre-test",
              value: preTest,
              color: "bg-slate-400",
            },
            {
              label: "Post-test",
              value: postTest,
              color: "bg-blue-600",
            },
          ].map((item) => (
            <div key={item.label}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium">
                  {item.label}
                </span>

                <span className="font-semibold">
                  {item.value}
                </span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${item.color}`}
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(100, item.value)
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}

          <div className="border-t border-border pt-4">
            <p className="text-sm text-text-secondary">
              Perubahan Rata-rata Nilai
            </p>

            <p
              className={`mt-1 text-2xl font-bold ${
                difference > 0
                  ? "text-green-600"
                  : difference < 0
                    ? "text-red-600"
                    : "text-text-primary"
              }`}
            >
              {difference > 0 ? "+" : ""}
              {difference} poin
            </p>
          </div>
        </div>
      )}
    </section>
  );
}