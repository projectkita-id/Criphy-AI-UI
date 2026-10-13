
import {
  mockCase,
  mockConflict,
  mockInvestigation,
  mockReconstruction,
  mockReflection,
} from "./learningSession";

export const demoLearningContent = {
  caseId: "case-001",

  phaseOne: {
    question: mockCase.initialQuestion,
  },

  phaseTwo: {
    ...mockConflict,
  },

  phaseThree: {
    ...mockInvestigation,
  },

  phaseFour: {
    ...mockReconstruction,
  },

  phaseFive: {
    ...mockReflection,
  },
};

export type DemoLearningContent =
  typeof demoLearningContent;
