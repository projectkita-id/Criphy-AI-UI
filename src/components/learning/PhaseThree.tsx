import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Send,
  Table2,
} from "lucide-react";

import { mockInvestigation } from "../../data/learningSession";
import MotionGraph from "./MotionGraph";

type Props = {
  previousAnswer: string;
  onComplete: (answer: string) => void;
};

export default function PhaseThree({
  previousAnswer,
  onComplete,
}: Props) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="rounded-xl border border-border bg-white p-7">
        <p className="text-sm font-semibold text-primary">
          FASE 3 — INVESTIGASI BERBASIS BUKTI
        </p>

        <h2 className="mt-4 text-xl font-bold">
          {mockInvestigation.title}
        </h2>

        <p className="mt-3 leading-relaxed text-text-secondary">
          {mockInvestigation.description}
        </p>

        <div className="mt-6 rounded-xl bg-slate-50 p-5">
          <p className="text-sm font-semibold text-text-secondary">
            Jawabanmu pada Fase 2
          </p>

          <p className="mt-3 whitespace-pre-wrap leading-relaxed">
            {previousAnswer}
          </p>
        </div>
      </div>

      {/* Data table */}
      <div className="rounded-xl border border-border bg-white p-7">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Table2 size={19} />
          DATA KECEPATAN KENDARAAN
        </div>

        <p className="mt-3 text-sm text-text-secondary">
          Tabel berikut berisi data simulasi kecepatan
          kedua mobil pada interval waktu yang sama.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-border px-4 py-3 text-left">
                  Waktu (detik)
                </th>
                <th className="border border-border px-4 py-3 text-left">
                  Mobil A (km/jam)
                </th>
                <th className="border border-border px-4 py-3 text-left">
                  Mobil B (km/jam)
                </th>
              </tr>
            </thead>

            <tbody>
              {mockInvestigation.data.map((point) => (
                <tr
                  key={point.time}
                  className="hover:bg-slate-50"
                >
                  <td className="border border-border px-4 py-3">
                    {point.time}
                  </td>

                  <td className="border border-border px-4 py-3">
                    {point.carA}
                  </td>

                  <td className="border border-border px-4 py-3">
                    {point.carB}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Motion graph */}
      <MotionGraph />

      {/* Evidence-based question */}
      <div className="rounded-xl border border-border bg-white p-7">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Lightbulb size={19} />
          ANALISIS BERDASARKAN BUKTI
        </div>

        <h3 className="mt-5 text-xl font-semibold leading-relaxed">
          {mockInvestigation.question}
        </h3>

        {!submitted ? (
          <>
            <div className="mt-7">
              <label
                htmlFor="investigation-answer"
                className="mb-3 block text-sm font-semibold"
              >
                Jawaban dan Bukti Pendukung
              </label>

              <textarea
                id="investigation-answer"
                value={answer}
                onChange={(event) =>
                  setAnswer(event.target.value)
                }
                rows={7}
                placeholder="Jelaskan kesimpulanmu menggunakan data pada tabel dan grafik..."
                className="w-full resize-y rounded-xl border border-border p-4 text-sm leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="mt-5">
              {!showHint ? (
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <HelpCircle size={18} />
                  Butuh Petunjuk?
                </button>
              ) : (
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                  <p className="font-semibold text-blue-800">
                    Petunjuk
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-blue-700">
                    {mockInvestigation.hint}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end border-t border-border pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!answer.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Kirim Jawaban
                <Send size={17} />
              </button>
            </div>
          </>
        ) : (
          <div className="mt-7 space-y-6">
            <div className="rounded-xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-center gap-2 font-semibold text-green-700">
                <CheckCircle2 size={20} />
                Jawaban Tercatat
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-green-900">
                {answer.trim()}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-5">
              <p className="font-semibold text-blue-800">
                Selanjutnya: Rekonstruksi Konsep
              </p>

              <p className="mt-2 text-sm leading-relaxed text-blue-700">
                Pada fase berikutnya, kamu akan
                menyusun kesimpulan berdasarkan klaim,
                bukti, dan penalaran.
              </p>
            </div>

            <div className="flex justify-end">
                <button
                type="button"
                onClick={() => onComplete(answer.trim())}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                Lanjut ke Fase 4
                <ArrowRight size={17} />
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}