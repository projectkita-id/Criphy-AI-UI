
import {
  loadLearningSession,
  clearLearningSession,
} from "./learningStorage";

import {
  loadAssessmentSession,
} from "./assessmentStorage";

import {
  saveLearningHistoryRecord,
  type LearningHistoryRecord,
} from "./learningHistoryStorage";

export function archiveCompletedLearningCycle(): boolean {
  const learningSession = loadLearningSession();
  const assessmentSession = loadAssessmentSession();

  // Only archive sessions that finished Phase 5.
  if (
    !learningSession ||
    learningSession.status !== "AWAITING_POST_TEST"
  ) {
    return false;
  }

  // Both assessments must exist.
  if (
    !assessmentSession.preTest ||
    !assessmentSession.postTest
  ) {
    return false;
  }

  // Prevent mixing assessments from different contexts.
  if (
    learningSession.context !==
      assessmentSession.preTest.context ||
    learningSession.context !==
      assessmentSession.postTest.context
  ) {
    return false;
  }

  // The session must have a valid ID and timestamp.
  if (
    !learningSession.id ||
    !learningSession.startedAt
  ) {
    return false;
  }

  const historyRecord: LearningHistoryRecord = {
    id: learningSession.id,
    context: learningSession.context,
    caseStudy: learningSession.caseStudy ?? null,

    status: "COMPLETED",

    startedAt: learningSession.startedAt,
    completedAt: assessmentSession.postTest.submittedAt,

    preTest: assessmentSession.preTest,
    postTest: assessmentSession.postTest,

    phaseOneResponse: learningSession.phaseOneResponse,
    phaseTwoResponse: learningSession.phaseTwoResponse,
    phaseThreeResponse: learningSession.phaseThreeResponse,
    phaseFourResponse: learningSession.phaseFourResponse,
    phaseFiveResponse:
      learningSession.phaseFiveResponse ?? null,
  };

  saveLearningHistoryRecord(historyRecord);

  // Only clear the active learning session
  // after successfully saving its history.
  clearLearningSession();

  return true;
}