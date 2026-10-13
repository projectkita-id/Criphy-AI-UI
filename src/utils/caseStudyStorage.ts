
import {
  demoCaseStudies,
  type CaseStudy,
} from "../data/caseStudies";

const STORAGE_KEY = "criphy-case-studies";

function isCaseStudy(value: unknown): value is CaseStudy {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.description === "string" &&
    typeof item.topic === "string" &&
    typeof item.createdAt === "string" &&
    ["DAILY_LIFE", "ENVIRONMENT", "TECHNOLOGY"].includes(
      String(item.context)
    ) &&
    ["DRAFT", "PUBLISHED"].includes(String(item.status))
  );
}

export function loadCaseStudies(): CaseStudy[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored === null) {
      return [...demoCaseStudies];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed) || !parsed.every(isCaseStudy)) {
      return [...demoCaseStudies];
    }

    return parsed;
  } catch {
    return [...demoCaseStudies];
  }
}

export function saveCaseStudies(
  caseStudies: CaseStudy[]
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(caseStudies)
  );
}