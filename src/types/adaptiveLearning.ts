
import type {
  AILearningQuestion,
  LearningPhaseNumber,
} from "./aiLearning";

// A submitted answer and its associated feedback.
export interface AdaptiveAnswerRecord {
  questionId: string;
  question: string;
  answer: string;
  feedback: string | null;
  submittedAt: string;
}

// Current status of the adaptive question flow.
export type AdaptiveQuestionStatus =
  | "idle"
  | "answering"
  | "submitting"
  | "feedback"
  | "completed"
  | "error";

// State for a single learning phase.
export interface AdaptivePhaseState {
  phase: LearningPhaseNumber;
  status: AdaptiveQuestionStatus;

  // The question currently shown to the student.
  currentQuestion: AILearningQuestion | null;

  // Answer being typed but not yet submitted.
  draftAnswer: string;

  // Previous answers within this phase.
  history: AdaptiveAnswerRecord[];

  // Whether the backend has completed this phase.
  phaseCompleted: boolean;

  // Error message, if a request fails.
  error: string | null;
}

// Create an initial adaptive phase state.
export function createAdaptivePhaseState(
  phase: LearningPhaseNumber,
  initialQuestion: AILearningQuestion | null
): AdaptivePhaseState {
  return {
    phase,
    status: initialQuestion ? "answering" : "idle",
    currentQuestion: initialQuestion,
    draftAnswer: "",
    history: [],
    phaseCompleted: false,
    error: null,
  };
}
