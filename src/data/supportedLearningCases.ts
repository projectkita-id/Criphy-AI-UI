
import type { CaseStudy } from "./caseStudies";

export const SUPPORTED_DEMO_CASE_ID = "case-001";

export function isSupportedLearningCase(
  caseStudy: CaseStudy
): boolean {
  return (
    caseStudy.id === SUPPORTED_DEMO_CASE_ID &&
    caseStudy.context === "DAILY_LIFE" &&
    caseStudy.status === "PUBLISHED"
  );
}
