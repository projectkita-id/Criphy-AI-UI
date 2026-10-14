import { useState } from "react";

import {
  BookOpen,
  ChartNoAxesColumnIncreasing,
  GraduationCap,
  History,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  UserRound,
} from "lucide-react";

import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

const navigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Profil Saya",
    path: "/profile",
    icon: UserRound,
  },
  {
    label: "Mulai Belajar",
    path: "/learn",
    icon: BookOpen,
  },
  {
    label: "Riwayat Belajar",
    path: "/history",
    icon: History,
  },
  {
    label: "Hasil Asesmen",
    path: "/results",
    icon: ChartNoAxesColumnIncreasing,
  },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logoutUser } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const isNavigationActive = (path: string) => {
    if (path === "/learn") {
      return (
        location.pathname === "/learn" ||
        location.pathname.startsWith("/learn/")
      );
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");

    try {
      await logoutUser();

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
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-white">
      {/* Branding */}
      <div className="flex h-20 items-center gap-3 border-b border-border px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
          <GraduationCap size={22} />
        </div>

        <div>
          <h1 className="text-lg font-bold text-text-primary">
            CRI-PHY AI
          </h1>

          <p className="text-xs text-text-secondary">
            Learning Platform
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav
        aria-label="Navigasi siswa"
        className="flex-1 space-y-1 overflow-y-auto px-4 py-6"
      >
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Menu Utama
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isNavigationActive(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-50 text-primary"
                  : "text-text-secondary hover:bg-slate-50 hover:text-text-primary"
              }`}
            >
              <Icon size={19} className="shrink-0" />

              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Account & Logout */}
      <div className="border-t border-border p-4">
        <div className="mb-3 rounded-xl bg-slate-50 p-4">
          <p className="truncate text-sm font-semibold text-text-primary">
            {user?.name ?? "Siswa"}
          </p>

          <p className="mt-1 truncate text-xs text-text-secondary">
            {user?.email ?? ""}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
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
  );
}