
import { useState } from "react";
import {
  AlertCircle,
  BrainCircuit,
  CheckCircle2,
  Info,
  RotateCcw,
  Settings2,
} from "lucide-react";

import AIConfigurationForm from "../../components/admin/ai/AIConfigurationForm";
import ResetAIConfigurationModal from "../../components/admin/ai/ResetAIConfigurationModal";

import {
  defaultAIConfiguration,
  type AIConfigurationData,
} from "../../data/aiConfiguration";

import {
  loadAIConfiguration,
  resetAIConfiguration,
  saveAIConfiguration,
} from "../../utils/aiConfigurationStorage";

type ValidationErrors = Partial<
  Record<keyof AIConfigurationData, string>
>;

const configurationFields: (keyof AIConfigurationData)[] = [
  "mainInstruction",
  "caseStudyCriteria",
  "guidanceStrategy",
];

function validateConfiguration(
  configuration: AIConfigurationData
): ValidationErrors {
  const errors: ValidationErrors = {};

  const labels: Record<keyof AIConfigurationData, string> = {
    mainInstruction: "Instruksi utama AI",
    caseStudyCriteria: "Kriteria studi kasus",
    guidanceStrategy: "Strategi bimbingan",
  };

  for (const field of configurationFields) {
    if (!configuration[field].trim()) {
      errors[field] = `${labels[field]} wajib diisi.`;
    }
  }

  return errors;
}

function configurationsEqual(
  first: AIConfigurationData,
  second: AIConfigurationData
): boolean {
  return configurationFields.every(
    (field) => first[field] === second[field]
  );
}

export default function AIConfiguration() {
  const [savedConfiguration, setSavedConfiguration] =
    useState<AIConfigurationData>(loadAIConfiguration);

  const [configuration, setConfiguration] =
    useState<AIConfigurationData>(() => ({
      ...savedConfiguration,
    }));

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showResetModal, setShowResetModal] = useState(false);

  const [message, setMessage] = useState("");
  const [storageError, setStorageError] = useState("");

  const isDirty = !configurationsEqual(
    configuration,
    savedConfiguration
  );

  const handleChange = (next: AIConfigurationData) => {
    setConfiguration(next);
    setMessage("");
    setStorageError("");

    // Clear validation errors for fields that are now valid.
    setErrors((previous) => {
      const nextErrors = { ...previous };

      for (const field of configurationFields) {
        if (next[field].trim()) {
          delete nextErrors[field];
        }
      }

      return nextErrors;
    });
  };

  const handleSave = () => {
    const validationErrors = validateConfiguration(configuration);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage("");
      return;
    }

    const normalizedConfiguration: AIConfigurationData = {
      mainInstruction: configuration.mainInstruction.trim(),
      caseStudyCriteria: configuration.caseStudyCriteria.trim(),
      guidanceStrategy: configuration.guidanceStrategy.trim(),
    };

    try {
      saveAIConfiguration(normalizedConfiguration);

      setConfiguration(normalizedConfiguration);
      setSavedConfiguration(normalizedConfiguration);

      setErrors({});
      setStorageError("");
      setMessage("Konfigurasi berhasil disimpan di browser.");
    } catch {
      setMessage("");
      setStorageError(
        "Gagal menyimpan konfigurasi. Silakan coba lagi."
      );
    }
  };

  const handleReset = () => {
    try {
      resetAIConfiguration();

      const defaults = { ...defaultAIConfiguration };

      setConfiguration(defaults);
      setSavedConfiguration(defaults);

      setErrors({});
      setShowResetModal(false);
      setStorageError("");

      setMessage(
        "Konfigurasi berhasil dikembalikan ke pengaturan bawaan."
      );
    } catch {
      setMessage("");
      setStorageError(
        "Gagal mereset konfigurasi. Silakan coba lagi."
      );
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <BrainCircuit size={18} />
            KONFIGURASI AI
          </div>

          <h1 className="mt-2 text-3xl font-bold">
            Konfigurasi AI
          </h1>

          <p className="mt-2 text-text-secondary">
            Atur instruksi, kriteria studi kasus, dan strategi
            bimbingan untuk pembelajaran berbasis AI.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-medium hover:bg-slate-50"
        >
          <RotateCcw size={17} />
          Reset Default
        </button>
      </div>

      {/* Demo Notice */}
      <div className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-5">
        <Info
          size={21}
          className="mt-0.5 shrink-0 text-blue-700"
        />

        <div>
          <h2 className="text-sm font-semibold text-blue-900">
            Konfigurasi Demonstrasi
          </h2>

          <p className="mt-1 text-sm leading-relaxed text-blue-800">
            Konfigurasi disimpan secara lokal di browser.
            Pengaturan belum terhubung ke database
            atau layanan AI.
          </p>
        </div>
      </div>

      {/* Unsaved Changes Indicator */}
      {isDirty && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"
        >
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0 text-amber-600"
          />

          <div>
            <p className="text-sm font-semibold text-amber-900">
              Perubahan Belum Disimpan
            </p>

            <p className="mt-1 text-sm text-amber-800">
              Anda memiliki perubahan konfigurasi yang belum
              disimpan. Klik Simpan Konfigurasi untuk menyimpannya.
            </p>
          </div>
        </div>
      )}

      {/* Configuration Form */}
      <section className="rounded-2xl border border-border bg-white p-7">
        <div className="mb-7 flex items-center gap-3 border-b border-border pb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-primary">
            <Settings2 size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold">
              Pengaturan Instruksi AI
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Sesuaikan instruksi yang akan digunakan
              oleh sistem pembelajaran.
            </p>
          </div>
        </div>

        <AIConfigurationForm
          configuration={configuration}
          onChange={handleChange}
          onSave={handleSave}
          errors={errors}
          isDirty={isDirty}
        />

        {message && (
          <div
            role="status"
            className="mt-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            <CheckCircle2 size={20} className="shrink-0" />
            {message}
          </div>
        )}

        {storageError && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            {storageError}
          </div>
        )}
      </section>

      {/* Reset Confirmation */}
      {showResetModal && (
        <ResetAIConfigurationModal
          onCancel={() => setShowResetModal(false)}
          onConfirm={handleReset}
        />
      )}
    </div>
  );
}