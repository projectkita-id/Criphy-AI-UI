
import type { CaseStudy } from "./caseStudies";

export const SUPPORTED_DEMO_CASE_ID = "case-001";

export function isSupportedLearningCase(
  caseStudy: CaseStudy
): boolean {
  return (
    caseStudy.status === "PUBLISHED" &&
    (caseStudy.context === "DAILY_LIFE" ||
      caseStudy.context === "ENVIRONMENT" ||
      caseStudy.context === "TECHNOLOGY")
  );
}
