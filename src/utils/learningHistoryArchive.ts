
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

import {
  loadAssessmentSnapshot,
} from "./assessmentSnapshotStorage";

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

  // Load the frozen question bank used for this cycle.
  const assessmentQuestions = loadAssessmentSnapshot();

  // Do not archive without the question snapshot.
  // This prevents incomplete historical assessment data.
  if (!assessmentQuestions) {
    return false;
  }

  // Create a complete history record.
  const historyRecord: LearningHistoryRecord = {
    id: learningSession.id,
    context: learningSession.context,
    caseStudy: learningSession.caseStudy ?? null,

    status: "COMPLETED",

    startedAt: learningSession.startedAt,
    completedAt: assessmentSession.postTest.submittedAt,

    // Assessment submissions.
    preTest: assessmentSession.preTest,
    postTest: assessmentSession.postTest,

    // Preserve the questions and answer keys used
    // during this specific learning cycle.
    assessmentQuestions: structuredClone(assessmentQuestions),

    // Student responses from all five learning phases.
    phaseOneResponse: learningSession.phaseOneResponse,
    phaseTwoResponse: learningSession.phaseTwoResponse,
    phaseThreeResponse: learningSession.phaseThreeResponse,
    phaseFourResponse: learningSession.phaseFourResponse,
    phaseFiveResponse:
      learningSession.phaseFiveResponse ?? null,
  };

  // Save the completed cycle into learning history.
  // A storage failure will throw and prevent clearing.
  saveLearningHistoryRecord(historyRecord);

  // Only clear the active learning session
  // after successfully saving its history.
  clearLearningSession();

  return true;
}