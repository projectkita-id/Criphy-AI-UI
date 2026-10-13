
import { Menu, ShieldCheck } from "lucide-react";

type Props = {
  onOpenMenu: () => void;
  mobileOpen: boolean;
};

export default function AdminHeader({
  onOpenMenu,
  mobileOpen,
}: Props) {
  return (
    <header className="flex h-20 shrink-0 items-center justify-between gap-4 border-b border-border bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Buka navigasi administrator"
          aria-controls="admin-sidebar"
          aria-expanded={mobileOpen}
          className="rounded-lg p-2 text-text-secondary hover:bg-slate-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text-primary">
            Panel Administrator
          </p>

          <p className="mt-1 hidden text-xs text-text-secondary sm:block">
            Kelola pembelajaran CRI-PHY AI
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-primary">
          <ShieldCheck size={20} />
        </div>

        <div className="hidden sm:block">
          <p className="text-sm font-semibold">
            Administrator
          </p>
          <p className="text-xs text-text-secondary">
            Akun Demo
          </p>
        </div>
      </div>
    </header>
  );
}