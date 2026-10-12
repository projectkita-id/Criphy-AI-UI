import { Bell, UserRound } from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-border bg-white px-8">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">
          Platform Pembelajaran
        </h2>
        <p className="text-sm text-text-secondary">
          Cognitive Conflict-Based Learning
        </p>
      </div>

      <div className="flex items-center gap-5">
        <Bell size={20} className="text-text-secondary" />

        <div className="flex items-center gap-3 border-l border-border pl-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-primary">
            <UserRound size={20} />
          </div>

          <div>
            <p className="text-sm font-semibold">Siswa Demo</p>
            <p className="text-xs text-text-secondary">
              Kelas XI
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}