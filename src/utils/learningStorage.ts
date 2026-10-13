
import type { PhaseOneResponse } from "../components/learning/PhaseOne";
import type { CERResponse } from "../components/learning/PhaseFour";
import type { ReflectionResponse } from "../components/learning/PhaseFive";
import type { CaseStudy } from "../data/caseStudies";

export type LearningSessionStatus =
  | "IN_PROGRESS"
  | "AWAITING_POST_TEST";

export type LearningSessionData = {
  id?: string;
  startedAt?: string;

  currentPhase: number;
  context: string | null;
  status?: LearningSessionStatus;

  phaseOneResponse: PhaseOneResponse | null;
  phaseTwoResponse: string | null;
  phaseThreeResponse: string | null;
  phaseFourResponse: CERResponse | null;
  phaseFiveResponse?: ReflectionResponse | null;

  caseStudy?: CaseStudy | null;
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
    throw error;
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
