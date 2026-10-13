
export type LearningPrompt = {
  title: string;
  description: string;
  question: string;
  hint?: string;
};

export type InvestigationColumn = {
  key: string;
  label: string;
};

export type InvestigationData = {
  title: string;
  description: string;
  columns: InvestigationColumn[];
  rows: Record<string, string | number>[];
  question: string;
  hint?: string;
};

export type LearningContent = {
  phaseOne: {
    question: string;
  };

  phaseTwo: LearningPrompt;

  phaseThree: InvestigationData | null;

  phaseFour: {
    title: string;
    description: string;
  };

  phaseFive: {
    title: string;
    description: string;
  };
};