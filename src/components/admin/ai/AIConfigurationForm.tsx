
import type { AIConfigurationData } from "../../../data/aiConfiguration";

type Props = {
  configuration: AIConfigurationData;
  onChange: (configuration: AIConfigurationData) => void;
  onSave: () => void;
  errors: Partial<Record<keyof AIConfigurationData, string>>;
  isDirty: boolean;
};

const fields: {
  key: keyof AIConfigurationData;
  label: string;
  description: string;
  placeholder: string;
}[] = [
  {
    key: "mainInstruction",
    label: "Instruksi Utama AI",
    description:
      "Tentukan peran, tujuan, dan batasan umum perilaku AI.",
    placeholder: "Masukkan instruksi utama AI...",
  },
  {
    key: "caseStudyCriteria",
    label: "Kriteria Studi Kasus",
    description:
      "Atur karakteristik studi kasus dan konflik kognitif yang dihasilkan.",
    placeholder: "Masukkan kriteria studi kasus...",
  },
  {
    key: "guidanceStrategy",
    label: "Strategi Bimbingan",
    description:
      "Tentukan bagaimana AI membimbing siswa selama proses pembelajaran.",
    placeholder: "Masukkan strategi bimbingan...",
  },
];

export default function AIConfigurationForm({
  configuration,
  onChange,
  onSave,
  errors,
  isDirty,
}: Props) {
  const updateField = (
    key: keyof AIConfigurationData,
    value: string
  ) => {
    onChange({
      ...configuration,
      [key]: value,
    });
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
      className="space-y-7"
    >
      {fields.map((field) => {
        const error = errors[field.key];

        return (
          <div key={field.key}>
            <label
              htmlFor={field.key}
              className="block text-sm font-semibold"
            >
              {field.label}
              <span className="ml-1 text-red-500">*</span>
            </label>

            <p className="mt-1 text-sm text-text-secondary">
              {field.description}
            </p>

            <textarea
              id={field.key}
              value={configuration[field.key]}
              onChange={(event) =>
                updateField(field.key, event.target.value)
              }
              rows={5}
              placeholder={field.placeholder}
              aria-invalid={Boolean(error)}
              aria-describedby={
                error ? `${field.key}-error` : undefined
              }
              className={`mt-3 w-full resize-y rounded-xl border bg-white p-4 text-sm leading-relaxed outline-none transition-colors focus:ring-2 ${
                error
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-border focus:border-primary focus:ring-blue-100"
              }`}
            />

            {error && (
              <p
                id={`${field.key}-error`}
                role="alert"
                className="mt-2 text-sm text-red-600"
              >
                {error}
              </p>
            )}
          </div>
        );
      })}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <p className="text-xs text-text-secondary">
          <span className="text-red-500">*</span> Wajib diisi
        </p>

        <button
          type="submit"
          disabled={!isDirty}
          className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Simpan Konfigurasi
        </button>
      </div>
    </form>
  );
}