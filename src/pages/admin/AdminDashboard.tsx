
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  ClipboardCheck,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Users,
} from "lucide-react";

const statistics = [
  {
    label: "Total Siswa",
    value: 0,
    description: "Siswa terdaftar",
    icon: Users,
  },
  {
    label: "Sesi Pembelajaran",
    value: 0,
    description: "Total sesi pembelajaran",
    icon: BookOpen,
  },
  {
    label: "Asesmen Selesai",
    value: 0,
    description: "Asesmen yang telah diselesaikan",
    icon: ClipboardCheck,
  },
  {
    label: "Studi Kasus",
    value: 0,
    description: "Studi kasus tersedia",
    icon: FileText,
  },
];

const quickAccess = [
  {
    title: "Kelola Asesmen",
    description: "Buat dan kelola soal asesmen.",
    path: "/admin/assessments",
    icon: ClipboardList,
  },
  {
    title: "Konfigurasi AI",
    description: "Atur prompt dan kriteria AI.",
    path: "/admin/ai-config",
    icon: BrainCircuit,
  },
  {
    title: "Studi Kasus",
    description: "Kelola materi studi kasus.",
    path: "/admin/cases",
    icon: BookOpen,
  },
  {
    title: "Data Siswa",
    description: "Lihat data dan aktivitas siswa.",
    path: "/admin/students",
    icon: Users,
  },
];

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <LayoutDashboard size={18} />
          OVERVIEW
        </div>

        <h1 className="mt-2 text-3xl font-bold">
          Dashboard Administrator
        </h1>

        <p className="mt-2 text-text-secondary">
          Pantau aktivitas pembelajaran dan kelola
          platform CRI-PHY AI.
        </p>
      </div>

      {/* Demo Notice */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
        <p className="text-sm font-semibold text-blue-900">
          Mode Demonstrasi
        </p>

        <p className="mt-1 text-sm leading-relaxed text-blue-800">
          Dashboard saat ini menggunakan tampilan demo.
          Statistik dan aktivitas akan terhubung dengan
          database setelah backend tersedia.
        </p>
      </div>

      {/* Statistics */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold">
            Ringkasan Platform
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Statistik umum aktivitas pembelajaran.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map((statistic) => {
            const Icon = statistic.icon;

            return (
              <div
                key={statistic.label}
                className="rounded-2xl border border-border bg-white p-6"
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium text-text-secondary">
                    {statistic.label}
                  </p>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-primary">
                    <Icon size={21} />
                  </div>
                </div>

                <p className="mt-4 text-4xl font-bold">
                  {statistic.value}
                </p>

                <p className="mt-2 text-xs text-text-secondary">
                  {statistic.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Activity and Assessment Summary */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <section className="rounded-2xl border border-border bg-white p-7">
          <div className="flex items-center gap-3">
            <Activity size={21} className="text-primary" />

            <h2 className="text-lg font-bold">
              Aktivitas Terbaru
            </h2>
          </div>

          <div className="flex min-h-56 flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Activity size={26} />
            </div>

            <h3 className="mt-4 font-semibold">
              Belum Ada Aktivitas
            </h3>

            <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-secondary">
              Aktivitas siswa dan sesi pembelajaran
              terbaru akan muncul di sini setelah
              backend terhubung.
            </p>
          </div>
        </section>

        {/* Assessment Summary */}
        <section className="rounded-2xl border border-border bg-white p-7">
          <div className="flex items-center gap-3">
            <ClipboardCheck
              size={21}
              className="text-primary"
            />

            <h2 className="text-lg font-bold">
              Ringkasan Asesmen
            </h2>
          </div>

          <div className="flex min-h-56 flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <ClipboardList size={26} />
            </div>

            <h3 className="mt-4 font-semibold">
              Belum Ada Data Asesmen
            </h3>

            <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-secondary">
              Ringkasan hasil Pre-Test dan Post-Test
              siswa akan tersedia setelah integrasi
              sistem penilaian.
            </p>
          </div>
        </section>
      </div>

      {/* Quick Access */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold">
            Akses Cepat
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Pilih menu untuk mengelola platform.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {quickAccess.map((feature) => {
            const Icon = feature.icon;

            return (
              <Link
                key={feature.path}
                to={feature.path}
                className="group rounded-2xl border border-border bg-white p-5 transition-all hover:border-blue-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-primary">
                    <Icon size={21} />
                  </div>

                  <ArrowRight
                    size={19}
                    className="text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-primary"
                  />
                </div>

                <h3 className="mt-5 font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {feature.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
