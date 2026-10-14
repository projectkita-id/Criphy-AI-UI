
import type {
  AssessmentSubmission,
} from "./assessmentStorage";

import type {
  ManagedQuestion,
} from "./assessmentQuestionStorage";

import {
  loadAssessmentSnapshot,
} from "./assessmentSnapshotStorage";

export type MultipleChoiceResult = {
  questionId: string;
  selectedAnswer: string | null;
  isCorrect: boolean;
};

export type AssessmentScore = {
  correctAnswers: number;
  totalQuestions: number;
  score: number | null;
  details: MultipleChoiceResult[];
  essayCount: number;
  essayStatus: "PENDING";
};

export function calculateAssessmentScore(
  submission: AssessmentSubmission,
  questionSnapshot?: ManagedQuestion[]
): AssessmentScore {
  // Use the provided historical snapshot when available.
  // Otherwise, use the current assessment snapshot.
  const questions =
    questionSnapshot ?? loadAssessmentSnapshot() ?? [];

  const multipleChoiceQuestions = questions.filter(
    (question) => question.type === "MULTIPLE_CHOICE"
  );

  const essayQuestions = questions.filter(
    (question) => question.type === "ESSAY"
  );

  const details: MultipleChoiceResult[] =
    multipleChoiceQuestions.map((question) => {
      const submittedAnswer = submission.answers.find(
        (answer) => answer.questionId === question.id
      );

      const selectedAnswer =
        submittedAnswer?.answer ?? null;

      return {
        questionId: question.id,
        selectedAnswer,
        isCorrect:
          selectedAnswer === question.correctAnswer,
      };
    });

  const correctAnswers = details.filter(
    (result) => result.isCorrect
  ).length;

  const totalQuestions = multipleChoiceQuestions.length;

  const score =
    totalQuestions > 0
      ? Math.round(
          (correctAnswers / totalQuestions) * 100
        )
      : null;

  return {
    correctAnswers,
    totalQuestions,
    score,
    details,
    essayCount: essayQuestions.length,
    essayStatus: "PENDING",
  };
}