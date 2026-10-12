export type AssessmentType = "pre-test" | "post-test";

export type AssessmentAnswer = {
  questionId: string;
  answer: string;
};

export type AssessmentSubmission = {
  type: AssessmentType;
  context: string | null;
  answers: AssessmentAnswer[];
  submittedAt: string;
};

export type AssessmentSession = {
  preTest: AssessmentSubmission | null;
  postTest: AssessmentSubmission | null;
};

const STORAGE_KEY = "criphy-assessments";

function createEmptySession(): AssessmentSession {
  return {
    preTest: null,
    postTest: null,
  };
}

export function loadAssessmentSession(): AssessmentSession {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return createEmptySession();
    }

    const parsed = JSON.parse(stored) as AssessmentSession;

    return {
      preTest: parsed.preTest ?? null,
      postTest: parsed.postTest ?? null,
    };
  } catch {
    return createEmptySession();
  }
}

export function saveAssessmentSubmission(
  submission: AssessmentSubmission
): void {
  const session = loadAssessmentSession();

  if (submission.type === "pre-test") {
    session.preTest = submission;

    // A new Pre-Test starts a new assessment cycle.
    session.postTest = null;
  } else {
    session.postTest = submission;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(session)
  );
}

export function clearAssessmentSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}