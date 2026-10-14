import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Settings2,
  Users,
  X,
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

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
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");

    try {
      await logoutUser();

      onClose();
      navigate("/login", { replace: true });
    } catch (err) {
      setLogoutError(
        err instanceof Error
          ? err.message
          : "Gagal keluar dari akun."
      );
    } finally {
      setLoggingOut(false);
    }
  }

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
        {/* Branding */}
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

        {/* Navigation */}
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

        {/* Account & Logout */}
        <div className="shrink-0 border-t border-border p-4">
          <div className="mb-3 rounded-xl bg-slate-50 p-4">
            <p className="truncate text-sm font-semibold text-text-primary">
              {user?.name ?? "Administrator"}
            </p>

            <p className="mt-1 truncate text-xs text-text-secondary">
              {user?.email ?? ""}
            </p>

            <p className="mt-2 text-xs font-medium text-primary">
              Administrator
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loggingOut ? (
              <LoaderCircle
                size={19}
                className="animate-spin"
              />
            ) : (
              <LogOut size={19} />
            )}

            {loggingOut ? "Keluar..." : "Keluar"}
          </button>

          {logoutError && (
            <p
              role="alert"
              className="mt-2 px-2 text-xs text-red-600"
            >
              {logoutError}
            </p>
          )}
        </div>
      </aside>
    </>
  );
}