
import {
  loadManagedQuestions,
  type ManagedQuestion,
} from "./assessmentQuestionStorage";

const STORAGE_KEY = "criphy-assessment-snapshot";

export function loadAssessmentSnapshot():
  ManagedQuestion[] | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return null;

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return null;

    // Validate against the current question structure.
    const valid = parsed.every((question) => {
      if (!question || typeof question !== "object") {
        return false;
      }

      const item = question as Record<string, unknown>;

      if (
        typeof item.id !== "string" ||
        typeof item.question !== "string"
      ) {
        return false;
      }

      if (item.type === "ESSAY") return true;

      return (
        item.type === "MULTIPLE_CHOICE" &&
        Array.isArray(item.options) &&
        typeof item.correctAnswer === "string" &&
        item.options.every(
          (option) =>
            option &&
            typeof option.id === "string" &&
            typeof option.text === "string"
        ) &&
        item.options.some(
          (option) =>
            option.id === item.correctAnswer
        )
      );
    });

    return valid ? (parsed as ManagedQuestion[]) : null;
  } catch {
    return null;
  }
}

export function createAssessmentSnapshot():
  ManagedQuestion[] {
  const questions = loadManagedQuestions();

  // Make an independent copy of the question bank.
  const snapshot = structuredClone(questions);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(snapshot)
  );

  return snapshot;
}

export function clearAssessmentSnapshot(): void {
  localStorage.removeItem(STORAGE_KEY);
}