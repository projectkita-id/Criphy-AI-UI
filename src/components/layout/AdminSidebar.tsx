
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
} from "lucide-react";

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

export default function AdminSidebar() {
  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-border bg-white">
      <div className="flex h-20 items-center gap-3 border-b border-border px-6">
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

      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
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

      <div className="border-t border-border p-4">
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
  );
}
