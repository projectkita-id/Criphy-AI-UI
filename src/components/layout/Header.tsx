import { Link } from "react-router-dom";
import { UserRound } from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

export default function Header() {
  const { user } = useAuth();

  const initials = user?.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <header className="flex min-h-20 items-center justify-between gap-4 border-b border-border bg-white px-4 py-4 sm:px-6 lg:px-8">
      {/* Platform information */}
      <div className="min-w-0">
        <h2 className="truncate text-base font-semibold text-text-primary sm:text-lg">
          Platform Pembelajaran
        </h2>

        <p className="mt-1 hidden text-sm text-text-secondary sm:block">
          Cognitive Conflict-Based Learning
        </p>
      </div>

      {/* Student profile shortcut */}
      <Link
        to="/profile"
        aria-label="Buka profil saya"
        className="flex min-w-0 shrink-0 items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-slate-50"
      >
        {/* Avatar */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-primary">
          {initials ? (
            <span className="text-sm">{initials}</span>
          ) : (
            <UserRound size={20} />
          )}
        </div>

        {/* Student information */}
        <div className="hidden min-w-0 sm:block">
          <p className="max-w-44 truncate text-sm font-semibold text-text-primary lg:max-w-56">
            {user?.name ?? "Siswa"}
          </p>

          <p className="text-xs text-text-secondary">
            Akun Siswa
          </p>
        </div>
      </Link>
    </header>
  );
}