
import {
  assessmentQuestions,
  type AssessmentQuestion,
} from "../data/assessmentQuestions";
import { assessmentAnswerKey } from "../data/assessmentAnswerKey";

export type ManagedQuestion = AssessmentQuestion & {
  correctAnswer?: string;
};

const STORAGE_KEY = "criphy-managed-questions";

function getDefaultQuestions(): ManagedQuestion[] {
  return assessmentQuestions.map((question) =>
    question.type === "MULTIPLE_CHOICE"
      ? {
          ...question,
          options: question.options.map((option) => ({ ...option })),
          correctAnswer: assessmentAnswerKey[question.id] ?? "",
        }
      : { ...question }
  );
}

function isManagedQuestion(value: unknown): value is ManagedQuestion {
  if (!value || typeof value !== "object") return false;

  const question = value as Record<string, unknown>;

  if (
    typeof question.id !== "string" ||
    typeof question.question !== "string"
  ) {
    return false;
  }

  if (question.type === "ESSAY") return true;

  return (
    question.type === "MULTIPLE_CHOICE" &&
    Array.isArray(question.options) &&
    question.options.every(
      (option) =>
        option &&
        typeof option.id === "string" &&
        typeof option.text === "string"
    ) &&
    typeof question.correctAnswer === "string" &&
    question.options.some(
      (option) => option.id === question.correctAnswer
    )
  );
}

export function loadManagedQuestions(): ManagedQuestion[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored === null) return getDefaultQuestions();

    const parsed: unknown = JSON.parse(stored);

    if (
      !Array.isArray(parsed) ||
      !parsed.every(isManagedQuestion)
    ) {
      return getDefaultQuestions();
    }

    return parsed;
  } catch {
    return getDefaultQuestions();
  }
}

export function saveManagedQuestions(
  questions: ManagedQuestion[]
): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
}
