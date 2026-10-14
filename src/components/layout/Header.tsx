
import { UserRound } from "lucide-react";

export default function Header() {
  return (
    <header className="flex min-h-20 items-center justify-between gap-4 border-b border-border bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="min-w-0">
        <h2 className="truncate text-base font-semibold text-text-primary sm:text-lg">
          Platform Pembelajaran
        </h2>

        <p className="mt-1 hidden text-sm text-text-secondary sm:block">
          Cognitive Conflict-Based Learning
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-primary">
          <UserRound size={20} />
        </div>

        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-text-primary">
            Siswa Demo
          </p>

          <p className="text-xs text-text-secondary">
            Kelas XI
          </p>
        </div>
      </div>
    </header>
  );
}