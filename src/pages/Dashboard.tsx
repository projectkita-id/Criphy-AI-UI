import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    label: "Modul Tersedia",
    value: "1",
    icon: BookOpen,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Sesi Selesai",
    value: "0",
    icon: CheckCircle2,
    color: "bg-green-50 text-green-600",
  },
  {
    label: "Total Waktu Belajar",
    value: "0 Menit",
    icon: Clock3,
    color: "bg-amber-50 text-amber-600",
  },
  {
    label: "Perkembangan Nilai",
    value: "—",
    icon: TrendingUp,
    color: "bg-purple-50 text-purple-600",
  },
];

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Selamat Datang, Siswa! 👋
        </h1>
        <p className="mt-2 text-text-secondary">
          Mari tingkatkan kemampuan berpikir kritis melalui
          pembelajaran fisika interaktif.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-lg p-3 ${stat.color}`}>
                  <Icon size={22} />
                </div>
              </div>

              <p className="mt-5 text-sm text-text-secondary">
                {stat.label}
              </p>
              <p className="mt-1 text-2xl font-bold">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-7 xl:col-span-2">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Modul Pembelajaran
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Pilih modul untuk memulai pembelajaran.
            </p>
          </div>

          <div className="rounded-xl border border-border p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-blue-50 p-4 text-primary">
                <GraduationCap size={28} />
              </div>

              <div className="flex-1">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-primary">
                  Fisika Kelas XI
                </span>

                <h3 className="mt-3 text-lg font-semibold">
                  Kinematika Gerak Lurus
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  Pelajari konsep gerak lurus, kecepatan,
                  percepatan, GLB, GLBB, dan interpretasi
                  grafik melalui studi kasus interaktif.
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-text-secondary">
                    5 Fase Pembelajaran
                  </span>

                  <Link
                    to="/learn"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Mulai Belajar
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-7">
          <h2 className="text-xl font-semibold">
            Progres Belajar
          </h2>

          <p className="mt-2 text-sm text-text-secondary">
            Pantau perkembangan pembelajaranmu.
          </p>

          <div className="mt-8 flex flex-col items-center">
            <div className="flex h-36 w-36 items-center justify-center rounded-full border-[12px] border-slate-100">
              <div className="text-center">
                <p className="text-3xl font-bold">0%</p>
                <p className="text-xs text-text-secondary">
                  Selesai
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-text-secondary">
              Belum ada sesi pembelajaran yang diselesaikan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}