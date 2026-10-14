
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function StudentLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const location = useLocation();

  // Close the mobile sidebar whenever the route changes.
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Allow closing the sidebar with the Escape key.
  useEffect(() => {
    if (!isSidebarOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Tutup menu navigasi"
            className="absolute inset-0 h-full w-full bg-slate-950/50"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute inset-y-0 left-0 w-64 max-w-[85vw] shadow-xl">
            <Sidebar />

            {/* Close button */}
            <button
              type="button"
              aria-label="Tutup menu"
              onClick={() => setIsSidebarOpen(false)}
              className="absolute right-3 top-5 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-text-secondary hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile navigation button + header */}
        <div className="flex items-center border-b border-border bg-white lg:block">
          <button
            type="button"
            aria-label="Buka menu navigasi"
            aria-expanded={isSidebarOpen}
            onClick={() => setIsSidebarOpen(true)}
            className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-text-primary hover:bg-slate-100 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div className="min-w-0 flex-1">
            <Header />
          </div>
        </div>

        {/* Page content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}