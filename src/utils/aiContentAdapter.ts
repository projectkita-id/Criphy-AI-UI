
import type {
  AIGeneratedCaseStudy,
  AILearningPhase,
  AILearningQuestion,
  LearningPhaseNumber,
} from "../types/aiLearning";

// A phase with its first available question.
export interface AdaptedLearningPhase {
  phase: LearningPhaseNumber;
  title: string;
  description: string;
  initialQuestion: AILearningQuestion | null;
  questions: AILearningQuestion[];
  dataset: AILearningPhase["dataset"];
}

// Organized content for the frontend.
export interface AdaptedLearningContent {
  caseId: string;
  title: string;
  description: string;
  context: AIGeneratedCaseStudy["context"];
  topic: string;
  cognitiveConflict: string;
  phases: Record<
    LearningPhaseNumber,
    AdaptedLearningPhase
  >;
}

const phaseNumbers: LearningPhaseNumber[] = [
  1, 2, 3, 4, 5,
];

// Convert a generated case study into organized
// phase content for the frontend.
export function adaptAICaseStudy(
  caseStudy: AIGeneratedCaseStudy
): AdaptedLearningContent {
  const phases = {} as Record<
    LearningPhaseNumber,
    AdaptedLearningPhase
  >;

  for (const phaseNumber of phaseNumbers) {
    const sourcePhase = caseStudy.phases.find(
      (phase) => phase.phase === phaseNumber
    );

    if (!sourcePhase) {
      throw new Error(
        `Fase ${phaseNumber} tidak ditemukan dalam studi kasus AI.`
      );
    }

    const validQuestions = sourcePhase.questions.filter(
      (question) => question.phase === phaseNumber
    );

    phases[phaseNumber] = {
      phase: phaseNumber,
      title: sourcePhase.title,
      description: sourcePhase.description,
      initialQuestion: validQuestions[0] ?? null,
      questions: validQuestions,
      dataset: sourcePhase.dataset,
    };
  }

  return {
    caseId: caseStudy.id,
    title: caseStudy.title,
    description: caseStudy.description,
    context: caseStudy.context,
    topic: caseStudy.topic,
    cognitiveConflict: caseStudy.cognitiveConflict,
    phases,
  };
}

// Retrieve a specific learning phase.
export function getAdaptedPhase(
  content: AdaptedLearningContent,
  phase: LearningPhaseNumber
): AdaptedLearningPhase {
  return content.phases[phase];
}

// Retrieve a question by its ID.
export function findLearningQuestion(
  content: AdaptedLearningContent,
  questionId: string
): AILearningQuestion | null {
  for (const phaseNumber of phaseNumbers) {
    const question = content.phases[
      phaseNumber
    ].questions.find(
      (item) => item.id === questionId
    );

    if (question) {
      return question;
    }
  }

  return null;
}