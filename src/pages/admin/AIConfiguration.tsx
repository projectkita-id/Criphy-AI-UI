
import { useEffect, useState } from "react";
import {
  AlertCircle,
  BrainCircuit,
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
import {
  createPromptConfiguration,
  fetchActivePromptConfiguration,
  updatePromptConfiguration,
  type PromptConfigurationResponse,
} from "../../services/api";

type ValidationErrors = Partial<
  Record<keyof AIConfigurationData, string>
>;

const configurationFields: (keyof AIConfigurationData)[] = [
  "mainInstruction",
  "caseStudyCriteria",
  "guidanceStrategy",
];

function normalizePromptConfiguration(
  config: PromptConfigurationResponse | null | undefined
): AIConfigurationData {
  if (!config) {
    return { ...defaultAIConfiguration };
  }

  const guidanceText =
    typeof config.guidanceStrategy === "string"
      ? config.guidanceStrategy
      : Object.values(config.guidanceStrategy ?? {}).join(" ");

  return {
    mainInstruction: config.role || config.objective || defaultAIConfiguration.mainInstruction,
    caseStudyCriteria:
      config.caseCharacteristics || defaultAIConfiguration.caseStudyCriteria,
    guidanceStrategy:
      guidanceText || defaultAIConfiguration.guidanceStrategy,
  };
}

function toPromptPayload(configuration: AIConfigurationData) {
  const guidance = {
    phase1: configuration.guidanceStrategy,
    phase2: configuration.guidanceStrategy,
    phase3: configuration.guidanceStrategy,
    phase4: configuration.guidanceStrategy,
    phase5: configuration.guidanceStrategy,
  };

  return {
    name: "Criphy AI Prompt",
    role: configuration.mainInstruction,
    objective: configuration.mainInstruction,
    caseCharacteristics: configuration.caseStudyCriteria,
    guidanceStrategy: guidance,
    model: "gpt-4o",
    temperature: 0.3,
    maxTokens: 1000,
    isActive: true,
  };
}

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
  const [activePromptId, setActivePromptId] = useState<string | null>(null);

  const [configuration, setConfiguration] =
    useState<AIConfigurationData>(() => ({
      ...savedConfiguration,
    }));

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showResetModal, setShowResetModal] = useState(false);

  const [message, setMessage] = useState("");
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    const hydrate = async () => {
      try {
        const activeConfig = await fetchActivePromptConfiguration();
        if (!activeConfig) {
          return;
        }

        const normalized = normalizePromptConfiguration(activeConfig);
        setSavedConfiguration(normalized);
        setConfiguration(normalized);
        setActivePromptId(activeConfig.id ?? null);
      } catch {
        setSavedConfiguration(loadAIConfiguration());
      }
    };

    void hydrate();
  }, []);

  const isDirty = !configurationsEqual(
    configuration,
    savedConfiguration
  );

  const handleChange = (next: AIConfigurationData) => {
    setConfiguration(next);
    setMessage("");
    setStorageError("");

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

  const handleSave = async () => {
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
      const payload = toPromptPayload(normalizedConfiguration);

      if (activePromptId) {
        const updated = await updatePromptConfiguration(activePromptId, payload);
        setActivePromptId(updated.id ?? activePromptId);
      } else {
        const created = await createPromptConfiguration(payload);
        setActivePromptId(created.id ?? null);
      }

      saveAIConfiguration(normalizedConfiguration);
      setConfiguration(normalizedConfiguration);
      setSavedConfiguration(normalizedConfiguration);
      setErrors({});
      setStorageError("");
      setMessage("Konfigurasi berhasil disimpan.");
    } catch {
      setMessage("");
      setStorageError(
        "Gagal menyimpan konfigurasi. Data tetap tersimpan di browser."
      );
      saveAIConfiguration(normalizedConfiguration);
    }
  };

  const handleReset = async () => {
    try {
      const defaults = { ...defaultAIConfiguration };
      const payload = toPromptPayload(defaults);

      if (activePromptId) {
        await updatePromptConfiguration(activePromptId, payload);
      } else {
        const created = await createPromptConfiguration(payload);
        setActivePromptId(created.id ?? null);
      }

      resetAIConfiguration();
      setConfiguration(defaults);
      setSavedConfiguration(defaults);
      setErrors({});
      setShowResetModal(false);
      setStorageError("");
      setMessage("Konfigurasi berhasil dikembalikan ke pengaturan bawaan.");
    } catch {
      setMessage("");
      setStorageError("Gagal mereset konfigurasi. Silakan coba lagi.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <BrainCircuit size={18} />
            KONFIGURASI AI
          </div>

          <h1 className="mt-2 text-3xl font-bold">Konfigurasi AI</h1>

          <p className="mt-2 text-text-secondary">
            Atur instruksi, kriteria studi kasus, dan strategi bimbingan untuk pembelajaran berbasis AI.
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

      <div className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-5">
        <Info size={21} className="mt-0.5 shrink-0 text-blue-700" />

        <div>
          <h2 className="text-sm font-semibold text-blue-900">Konfigurasi Terhubung API</h2>
          <p className="mt-1 text-sm leading-relaxed text-blue-800">
            Pengaturan dibaca dari server jika tersedia, lalu disimpan di browser sebagai fallback.
          </p>
        </div>
      </div>

      {isDirty && (
        <div role="status" className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertCircle size={20} className="mt-0.5 shrink-0 text-amber-600" />

          <div>
            <p className="text-sm font-semibold text-amber-900">Perubahan Belum Disimpan</p>
            <p className="mt-1 text-sm text-amber-800">
              Anda memiliki perubahan konfigurasi yang belum disimpan. Klik Simpan Konfigurasi untuk menyimpannya.
            </p>
          </div>
        </div>
      )}

      {message && (
        <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {message}
        </div>
      )}

      {storageError && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {storageError}
        </div>
      )}

      <section className="rounded-2xl border border-border bg-white p-7">
        <div className="mb-7 flex items-center gap-3 border-b border-border pb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-primary">
            <Settings2 size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold">Pengaturan Instruksi AI</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Sesuaikan instruksi yang akan digunakan oleh sistem pembelajaran.
            </p>
          </div>
        </div>

        <AIConfigurationForm
          configuration={configuration}
          onChange={handleChange}
          onSave={() => { void handleSave(); }}
          errors={errors}
          isDirty={isDirty}
        />
      </section>

      {showResetModal && (
        <ResetAIConfigurationModal
          onCancel={() => setShowResetModal(false)}
          onConfirm={() => { void handleReset(); }}
        />
      )}
    </div>
  );
}
