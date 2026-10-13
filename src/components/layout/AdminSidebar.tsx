
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Settings2,
  Users,
  X,
} from "lucide-react";

type Props = {
  mobileOpen: boolean;
  onClose: () => void;
};

const navigation = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Kelola Asesmen",
    path: "/admin/assessments",
    icon: ClipboardList,
  },
  {
    label: "Konfigurasi AI",
    path: "/admin/ai-config",
    icon: BrainCircuit,
  },
  {
    label: "Studi Kasus",
    path: "/admin/cases",
    icon: BookOpen,
  },
  {
    label: "Data Siswa",
    path: "/admin/students",
    icon: Users,
  },
  {
    label: "Monitoring",
    path: "/admin/monitoring",
    icon: BarChart3,
  },
  {
    label: "Pengaturan",
    path: "/admin/settings",
    icon: Settings2,
  },
];

export default function AdminSidebar({
  mobileOpen,
  onClose,
}: Props) {
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Tutup menu navigasi"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
        />
      )}

      <aside
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-white transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-border px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <GraduationCap size={23} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-primary-dark">
                CRI-PHY AI
              </h1>
              <p className="text-xs text-text-secondary">
                Administrator
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup sidebar"
            className="rounded-lg p-2 text-text-secondary hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav
          aria-label="Navigasi administrator"
          className="flex-1 space-y-1 overflow-y-auto px-4 py-6"
        >
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-primary"
                      : "text-text-secondary hover:bg-slate-50 hover:text-text-primary"
                  }`
                }
              >
                <Icon size={19} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-border p-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold">
              Mode Administrator
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              Antarmuka demo tanpa autentikasi.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}