
import {
  assessmentQuestions,
  type AssessmentQuestion,
} from "../data/assessmentQuestions";
import { assessmentAnswerKey } from "../data/assessmentAnswerKey";
import type { CaseStudyContext } from "../data/caseStudies";

export type QuestionStage = "PRE_TEST" | "POST_TEST";

export type ManagedQuestion = AssessmentQuestion & {
  correctAnswer?: string;
  stage?: QuestionStage;
  context?: CaseStudyContext;
};

type StoredQuestionBank = Record<
  CaseStudyContext,
  { preTest: ManagedQuestion[]; postTest: ManagedQuestion[] }
>;

const STORAGE_KEY = "criphy-managed-questions-v2";

function cloneQuestion(question: AssessmentQuestion, stage: QuestionStage, context: CaseStudyContext): ManagedQuestion {
  if (question.type === "MULTIPLE_CHOICE") {
    return {
      ...question,
      question: question.question,
      options: question.options.map((option) => ({ ...option })),
      correctAnswer: assessmentAnswerKey[question.id] ?? "A",
      stage,
      context,
    };
  }

  return {
    ...question,
    stage,
    context,
  };
}

function getDefaultQuestionBank(): StoredQuestionBank {
  const contexts: CaseStudyContext[] = [
    "DAILY_LIFE",
    "ENVIRONMENT",
    "TECHNOLOGY",
  ];

  return Object.fromEntries(
    contexts.map((context) => {
      const questions = assessmentQuestions.map((question, index) =>
        cloneQuestion(
          question,
          index % 2 === 0 ? "PRE_TEST" : "POST_TEST",
          context
        )
      );

      return [
        context,
        {
          preTest: questions.slice(0, 2),
          postTest: questions.slice(2),
        },
      ];
    })
  ) as StoredQuestionBank;
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

function loadQuestionBank(): StoredQuestionBank {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return getDefaultQuestionBank();
    }

    const parsed: unknown = JSON.parse(stored);

    if (!parsed || typeof parsed !== "object") {
      return getDefaultQuestionBank();
    }

    const defaultBank = getDefaultQuestionBank();
    const nextBank = { ...defaultBank } as StoredQuestionBank;

    for (const context of Object.keys(defaultBank) as CaseStudyContext[]) {
      const rawEntry = (parsed as Record<string, unknown>)[context] as
        | { preTest?: unknown; postTest?: unknown }
        | undefined;

      const preTest = Array.isArray(rawEntry?.preTest)
        ? rawEntry!.preTest.filter(isManagedQuestion)
        : defaultBank[context].preTest;
      const postTest = Array.isArray(rawEntry?.postTest)
        ? rawEntry!.postTest.filter(isManagedQuestion)
        : defaultBank[context].postTest;

      nextBank[context] = {
        preTest: preTest.map((question: ManagedQuestion) => ({
          ...question,
          context,
          stage: question.stage ?? "PRE_TEST",
        })),
        postTest: postTest.map((question: ManagedQuestion) => ({
          ...question,
          context,
          stage: question.stage ?? "POST_TEST",
        })),
      };
    }

    return nextBank;
  } catch {
    return getDefaultQuestionBank();
  }
}

export function loadManagedQuestions(
  context: CaseStudyContext = "DAILY_LIFE"
): ManagedQuestion[] {
  const bank = loadQuestionBank();
  return [...bank[context].preTest, ...bank[context].postTest];
}

export function saveManagedQuestions(
  context: CaseStudyContext,
  questions: ManagedQuestion[]
): void {
  const bank = loadQuestionBank();
  const preTest = questions.filter(
    (question) => (question.stage ?? "PRE_TEST") === "PRE_TEST"
  );
  const postTest = questions.filter(
    (question) => (question.stage ?? "POST_TEST") === "POST_TEST"
  );

  bank[context] = {
    preTest: preTest.map((question) => ({ ...question, context, stage: "PRE_TEST" })),
    postTest: postTest.map((question) => ({ ...question, context, stage: "POST_TEST" })),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(bank));
}

export function getQuestionStageSummary(context: CaseStudyContext) {
  const bank = loadQuestionBank();
  return {
    preTest: bank[context].preTest,
    postTest: bank[context].postTest,
  };
}

export function getAvailableAssessmentContexts(): CaseStudyContext[] {
  return ["DAILY_LIFE", "ENVIRONMENT", "TECHNOLOGY"];
}
