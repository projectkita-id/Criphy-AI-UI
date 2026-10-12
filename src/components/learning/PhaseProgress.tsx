import { learningPhases } from "../../data/learningSession";

type Props = {
  currentPhase: number;
};

export default function PhaseProgress({ currentPhase }: Props) {
  const activePhase = learningPhases[currentPhase - 1];

  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Progres Pembelajaran</h2>
        <span className="text-sm text-text-secondary">
          Fase {currentPhase} dari {learningPhases.length}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-5 gap-2">
        {learningPhases.map((phase) => (
          <div key={phase.id}>
            <div
              className={`h-2 rounded-full ${
                phase.id <= currentPhase
                  ? "bg-primary"
                  : "bg-slate-100"
              }`}
            />
            <p
              className={`mt-3 text-xs font-medium ${
                phase.id === currentPhase
                  ? "text-primary"
                  : "text-text-secondary"
              }`}
            >
              Fase {phase.id}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-lg bg-blue-50 p-4">
        <p className="text-sm font-semibold text-primary">
          {activePhase.title}
        </p>
        <p className="mt-1 text-sm text-blue-700">
          {activePhase.description}
        </p>
      </div>
    </div>
  );
}