
import type { LearningSessionData } from "./learningStorage";
import type {
  AssessmentSubmission,
} from "./assessmentStorage";

export type LearningHistoryStatus =
  | "COMPLETED"
  | "IN_PROGRESS";

export interface LearningHistoryRecord {
  id: string;

  context: string | null;

  caseStudy: LearningSessionData["caseStudy"];

  status: LearningHistoryStatus;

  startedAt: string;
  completedAt: string | null;

  preTest: AssessmentSubmission | null;
  postTest: AssessmentSubmission | null;

  phaseOneResponse: LearningSessionData["phaseOneResponse"];
  phaseTwoResponse: LearningSessionData["phaseTwoResponse"];
  phaseThreeResponse: LearningSessionData["phaseThreeResponse"];
  phaseFourResponse: LearningSessionData["phaseFourResponse"];
  phaseFiveResponse: LearningSessionData["phaseFiveResponse"];
}

const STORAGE_KEY = "criphy-learning-history";

export function loadLearningHistory(): LearningHistoryRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (record): record is LearningHistoryRecord =>
        typeof record === "object" &&
        record !== null &&
        typeof record.id === "string" &&
        typeof record.startedAt === "string" &&
        (record.status === "COMPLETED" ||
          record.status === "IN_PROGRESS")
    );
  } catch (error) {
    console.error("Failed to load learning history:", error);
    return [];
  }
}

export function saveLearningHistoryRecord(
  record: LearningHistoryRecord
): void {
  try {
    const history = loadLearningHistory();

    const existingIndex = history.findIndex(
      (item) => item.id === record.id
    );

    if (existingIndex >= 0) {
      history[existingIndex] = record;
    } else {
      history.push(record);
    }

    history.sort(
      (a, b) =>
        new Date(b.startedAt).getTime() -
        new Date(a.startedAt).getTime()
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(history)
    );
    } catch (error) {
        console.error("Failed to save learning history:", error);
        throw error;
    }
}

export function getLearningHistoryRecord(
  id: string
): LearningHistoryRecord | null {
  return (
    loadLearningHistory().find(
      (record) => record.id === id
    ) ?? null
  );
}

export function clearLearningHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear learning history:", error);
  }
}