import {
  ArrowLeft,
  BadgeCheck,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {/* Page heading */}
      <div>
        <Link
          to="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-primary"
        >
          <ArrowLeft size={17} />
          Kembali ke Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-text-primary">
          Profil Saya
        </h1>

        <p className="mt-2 text-sm text-text-secondary">
          Lihat informasi akun yang terdaftar di CRI-PHY AI.
        </p>
      </div>

      {/* Profile card */}
      <section className="overflow-hidden rounded-2xl border border-border bg-white">
        {/* Blue banner */}
        <div className="h-28 bg-gradient-to-r from-blue-700 to-blue-500" />

        <div className="px-6 pb-8 sm:px-8">
          {/* Profile identity */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex min-w-0 items-end gap-4">
              {/* Avatar overlaps the banner */}
              <div className="-mt-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-blue-100 text-2xl font-bold text-blue-700 shadow-sm">
                {initials || <UserRound size={32} />}
              </div>

              {/* Name stays below the banner */}
              <div className="min-w-0 pb-1 pt-4">
                <h2 className="break-words text-xl font-bold text-text-primary">
                  {user.name}
                </h2>

                <p className="mt-1 text-sm text-text-secondary">
                  Akun Siswa
                </p>
              </div>
            </div>

            {/* Account status */}
            <span className="inline-flex w-fit items-center gap-2 self-start rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 sm:self-auto">
              <BadgeCheck size={16} />
              Akun Aktif
            </span>
          </div>

          {/* Account details */}
          <div className="mt-8 grid gap-5 border-t border-border pt-7 sm:grid-cols-2">
            {/* Full name */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Nama Lengkap
              </p>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3.5">
                <UserRound
                  size={19}
                  className="shrink-0 text-primary"
                />

                <span className="break-words text-sm font-medium text-text-primary">
                  {user.name}
                </span>
              </div>
            </div>

            {/* Email */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Alamat Email
              </p>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3.5">
                <Mail
                  size={19}
                  className="shrink-0 text-primary"
                />

                <span className="break-all text-sm font-medium text-text-primary">
                  {user.email}
                </span>
              </div>
            </div>

            {/* Role */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Peran Akun
              </p>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3.5">
                <ShieldCheck
                  size={19}
                  className="shrink-0 text-primary"
                />

                <span className="text-sm font-medium text-text-primary">
                  Siswa
                </span>
              </div>
            </div>

            {/* Security */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Keamanan Akun
              </p>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3.5">
                <LockKeyhole
                  size={19}
                  className="shrink-0 text-primary"
                />

                <span className="text-sm font-medium text-text-primary">
                  Dilindungi dengan kata sandi
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Information */}
      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck
            size={21}
            className="mt-0.5 shrink-0 text-blue-600"
          />

          <div>
            <h3 className="text-sm font-semibold text-blue-900">
              Informasi Akun
            </h3>

            <p className="mt-1 text-sm leading-relaxed text-blue-800">
              Informasi profil ditampilkan berdasarkan akun
              yang sedang masuk. Fitur pengubahan informasi
              akun akan tersedia pada pengembangan berikutnya.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}