
import { useState, type FormEvent } from "react";
import {
  CheckCircle2,
  RotateCcw,
  Save,
  Settings,
  Server,
} from "lucide-react";

import {
  defaultPlatformSettings,
  type PlatformSettings,
} from "../../data/platformSettings";

import {
  loadPlatformSettings,
  savePlatformSettings,
  resetPlatformSettings,
} from "../../utils/platformSettingsStorage";

export default function AdminSettings() {
  const [settings, setSettings] = useState<PlatformSettings>(
    loadPlatformSettings
  );

  const [savedSettings, setSavedSettings] =
    useState<PlatformSettings>(settings);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const hasUnsavedChanges =
    JSON.stringify(settings) !== JSON.stringify(savedSettings);

  const updateField = <K extends keyof PlatformSettings>(
    field: K,
    value: PlatformSettings[K]
  ) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));

    setMessage("");
    setError("");
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !settings.platformName.trim() ||
      !settings.platformDescription.trim() ||
      !settings.defaultClassLevel.trim() ||
      !settings.defaultTopic.trim()
    ) {
      setError("Semua kolom teks wajib diisi.");
      return;
    }

    if (
      !Number.isInteger(settings.masteryThreshold) ||
      settings.masteryThreshold < 0 ||
      settings.masteryThreshold > 100
    ) {
      setError("Batas ketuntasan harus antara 0 dan 100.");
      return;
    }

    const cleaned: PlatformSettings = {
      ...settings,
      platformName: settings.platformName.trim(),
      platformDescription: settings.platformDescription.trim(),
      defaultClassLevel: settings.defaultClassLevel.trim(),
      defaultTopic: settings.defaultTopic.trim(),
    };

    try {
      savePlatformSettings(cleaned);
      setSettings(cleaned);
      setSavedSettings(cleaned);
      setMessage("Pengaturan berhasil disimpan.");
      setError("");
    } catch {
      setError("Gagal menyimpan pengaturan.");
    }
  };

  const handleReset = () => {
    if (
      !window.confirm(
        "Kembalikan seluruh pengaturan ke nilai bawaan?"
      )
    ) {
      return;
    }

    try {
      resetPlatformSettings();

      const defaults = { ...defaultPlatformSettings };

      setSettings(defaults);
      setSavedSettings(defaults);
      setMessage("Pengaturan dikembalikan ke nilai bawaan.");
      setError("");
    } catch {
      setError("Gagal mengatur ulang pengaturan.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Settings size={18} />
          PENGATURAN ADMIN
        </div>

        <h1 className="mt-2 text-3xl font-bold">
          Pengaturan Platform
        </h1>

        <p className="mt-2 text-text-secondary">
          Kelola informasi platform dan pengaturan dasar
          pembelajaran.
        </p>
      </div>

      {/* Demo Notice */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        Mode demo: perubahan hanya disimpan pada browser ini.
        Pengaturan belum terhubung dengan backend atau
        sistem pembelajaran.
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Platform information */}
        <section className="rounded-2xl border border-border bg-white p-6">
          <h2 className="text-lg font-bold">
            Informasi Platform
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Identitas dasar platform pembelajaran.
          </p>

          <div className="mt-5 space-y-5">
            <div>
              <label
                htmlFor="platformName"
                className="mb-2 block text-sm font-medium"
              >
                Nama Platform
              </label>

              <input
                id="platformName"
                value={settings.platformName}
                onChange={(event) =>
                  updateField(
                    "platformName",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="platformDescription"
                className="mb-2 block text-sm font-medium"
              >
                Deskripsi Platform
              </label>

              <textarea
                id="platformDescription"
                rows={3}
                value={settings.platformDescription}
                onChange={(event) =>
                  updateField(
                    "platformDescription",
                    event.target.value
                  )
                }
                className="w-full resize-y rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
        </section>

        {/* Learning defaults */}
        <section className="rounded-2xl border border-border bg-white p-6">
          <h2 className="text-lg font-bold">
            Pengaturan Pembelajaran
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Nilai bawaan untuk konfigurasi pembelajaran.
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="defaultClassLevel"
                className="mb-2 block text-sm font-medium"
              >
                Tingkat Kelas
              </label>

              <select
                id="defaultClassLevel"
                value={settings.defaultClassLevel}
                onChange={(event) =>
                  updateField(
                    "defaultClassLevel",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
              >
                <option value="X">Kelas X</option>
                <option value="XI">Kelas XI</option>
                <option value="XII">Kelas XII</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="defaultTopic"
                className="mb-2 block text-sm font-medium"
              >
                Materi Utama
              </label>

              <input
                id="defaultTopic"
                value={settings.defaultTopic}
                onChange={(event) =>
                  updateField(
                    "defaultTopic",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="masteryThreshold"
                className="mb-2 block text-sm font-medium"
              >
                Batas Ketuntasan (%)
              </label>

              <input
                id="masteryThreshold"
                type="number"
                min={0}
                max={100}
                step={1}
                value={settings.masteryThreshold}
                onChange={(event) =>
                  updateField(
                    "masteryThreshold",
                    Number(event.target.value)
                  )
                }
                className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
              />

              <p className="mt-2 text-xs text-text-secondary">
                Nilai bawaan: 80%. Belum diterapkan pada
                penentuan ketuntasan siswa.
              </p>
            </div>
          </div>
        </section>

        {/* System status */}
        <section className="rounded-2xl border border-border bg-white p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Server size={19} className="text-primary" />
            Status Integrasi
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Ringkasan komponen sistem saat ini.
          </p>

          <div className="mt-5 space-y-3 text-sm">
            {[
              ["Frontend", "Mode Demo"],
              ["Backend API", "Belum Terhubung"],
              ["Database", "Belum Terhubung"],
              ["AI Service", "Belum Terhubung"],
              ["Autentikasi", "Belum Diimplementasikan"],
            ].map(([name, status]) => (
              <div
                key={name}
                className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-0"
              >
                <span className="font-medium">{name}</span>
                <span className="text-right text-text-secondary">
                  {status}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-3 text-xs text-text-secondary">
            Status ini bersifat statis dan bukan hasil
            pemeriksaan koneksi secara langsung.
          </p>
        </section>

        {/* Feedback */}
        {message && (
          <div
            role="status"
            className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
          >
            <CheckCircle2 size={18} />
            {message}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium hover:bg-slate-50"
          >
            <RotateCcw size={17} />
            Kembalikan Default
          </button>

          <div className="flex items-center gap-4">
            {hasUnsavedChanges && (
              <span className="text-sm text-amber-600">
                Perubahan belum disimpan
              </span>
            )}

            <button
              type="submit"
              disabled={!hasUnsavedChanges}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />
              Simpan Pengaturan
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}