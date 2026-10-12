import type { PhaseOneResponse } from "../components/learning/PhaseOne";
import type { CERResponse } from "../components/learning/PhaseFour";

export type LearningSessionData = {
  currentPhase: number;
  context: string | null;

  phaseOneResponse: PhaseOneResponse | null;
  phaseTwoResponse: string | null;
  phaseThreeResponse: string | null;
  phaseFourResponse: CERResponse | null;
};

const STORAGE_KEY = "criphy-learning-session";

export function saveLearningSession(
  session: LearningSessionData
): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(session)
    );
  } catch (error) {
    console.error("Failed to save learning session:", error);
  }
}

export function loadLearningSession(): LearningSessionData | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return null;

    const parsed: LearningSessionData = JSON.parse(saved);

    if (
      typeof parsed.currentPhase !== "number" ||
      parsed.currentPhase < 1 ||
      parsed.currentPhase > 5
    ) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("Failed to load learning session:", error);
    return null;
  }
}

export function clearLearningSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear learning session:", error);
  }
}