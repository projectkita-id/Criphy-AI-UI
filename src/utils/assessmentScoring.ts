import { assessmentQuestions } from "../data/assessmentQuestions";
import { assessmentAnswerKey } from "../data/assessmentAnswerKey";

import type {
  AssessmentSubmission,
} from "./assessmentStorage";

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
  submission: AssessmentSubmission
): AssessmentScore {
  const multipleChoiceQuestions = assessmentQuestions.filter(
    (question) => question.type === "MULTIPLE_CHOICE"
  );

  const essayQuestions = assessmentQuestions.filter(
    (question) => question.type === "ESSAY"
  );

  const details: MultipleChoiceResult[] =
    multipleChoiceQuestions.map((question) => {
      const submittedAnswer = submission.answers.find(
        (answer) => answer.questionId === question.id
      );

      const selectedAnswer = submittedAnswer?.answer ?? null;
      const correctAnswer = assessmentAnswerKey[question.id];

      return {
        questionId: question.id,
        selectedAnswer,
        isCorrect:
          correctAnswer !== undefined &&
          selectedAnswer === correctAnswer,
      };
    });

  const correctAnswers = details.filter(
    (result) => result.isCorrect
  ).length;

  const totalQuestions = multipleChoiceQuestions.length;

  const score =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
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