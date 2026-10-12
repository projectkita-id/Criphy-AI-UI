
import { Bell, ShieldCheck } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-border bg-white px-8">
      <div>
        <p className="text-sm font-semibold text-text-primary">
          Panel Administrator
        </p>
        <p className="mt-1 text-xs text-text-secondary">
          Kelola pembelajaran CRI-PHY AI
        </p>
      </div>

      <div className="flex items-center gap-5">
        <Bell size={20} className="text-text-secondary" />

        <div className="flex items-center gap-3 border-l border-border pl-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-primary">
            <ShieldCheck size={20} />
          </div>

          <div>
            <p className="text-sm font-semibold">
              Administrator
            </p>
            <p className="text-xs text-text-secondary">
              Akun Demo
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
