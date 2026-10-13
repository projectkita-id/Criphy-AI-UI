
import type {
  AdaptivePhaseState,
  AdaptiveAnswerRecord,
} from "../types/adaptiveLearning";

import type {
  AILearningFeedbackResponse,
  AILearningQuestion,
} from "../types/aiLearning";

// Update the answer currently being typed.
export function updateAdaptiveDraft(
  state: AdaptivePhaseState,
  answer: string
): AdaptivePhaseState {
  if (state.status !== "answering") {
    return state;
  }

  return {
    ...state,
    draftAnswer: answer,
  };
}

// Mark the current answer as being submitted.
export function startAdaptiveSubmission(
  state: AdaptivePhaseState
): AdaptivePhaseState {
  if (
    state.status !== "answering" ||
    !state.currentQuestion ||
    !state.draftAnswer.trim()
  ) {
    return state;
  }

  return {
    ...state,
    status: "submitting",
    error: null,
  };
}

// Process feedback returned by the AI service.
export function applyAdaptiveFeedback(
  state: AdaptivePhaseState,
  response: AILearningFeedbackResponse,
  submittedAnswer: string
): AdaptivePhaseState {
  if (
    state.status !== "submitting" ||
    !state.currentQuestion
  ) {
    return state;
  }

  if (!response.success) {
    return {
      ...state,
      status: "error",
      error:
        response.error ??
        "Gagal memproses jawaban pembelajaran.",
    };
  }

  const answerRecord: AdaptiveAnswerRecord = {
    questionId: state.currentQuestion.id,
    question: state.currentQuestion.question,
    answer: submittedAnswer.trim(),
    feedback: response.feedback ?? null,
    submittedAt: new Date().toISOString(),
  };

  const isCompleted = response.phaseCompleted === true;

  return {
    ...state,
    status: isCompleted ? "completed" : "feedback",
    history: [...state.history, answerRecord],
    phaseCompleted: isCompleted,
    draftAnswer: "",
    error: null,
    currentQuestion: isCompleted
      ? null
      : state.currentQuestion,
  };
}

// Advance to the next question after feedback.
export function advanceAdaptiveQuestion(
  state: AdaptivePhaseState,
  nextQuestion: AILearningQuestion | null
): AdaptivePhaseState {
  if (
    state.status !== "feedback" ||
    !nextQuestion ||
    nextQuestion.phase !== state.phase
  ) {
    return state;
  }

  return {
    ...state,
    status: "answering",
    currentQuestion: nextQuestion,
    draftAnswer: "",
    error: null,
  };
}

// Recover from a failed request and allow retry.
export function retryAdaptiveQuestion(
  state: AdaptivePhaseState
): AdaptivePhaseState {
  if (state.status !== "error") {
    return state;
  }

  return {
    ...state,
    status: "answering",
    error: null,
  };
}