
import {
  defaultAIConfiguration,
  type AIConfigurationData,
} from "../data/aiConfiguration";

const STORAGE_KEY = "criphy-ai-configuration";

export function loadAIConfiguration(): AIConfigurationData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return { ...defaultAIConfiguration };
    }

    const parsed: unknown = JSON.parse(stored);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("mainInstruction" in parsed) ||
      !("caseStudyCriteria" in parsed) ||
      !("guidanceStrategy" in parsed) ||
      typeof parsed.mainInstruction !== "string" ||
      typeof parsed.caseStudyCriteria !== "string" ||
      typeof parsed.guidanceStrategy !== "string"
    ) {
      return { ...defaultAIConfiguration };
    }

    return {
      mainInstruction: parsed.mainInstruction,
      caseStudyCriteria: parsed.caseStudyCriteria,
      guidanceStrategy: parsed.guidanceStrategy,
    };
  } catch {
    return { ...defaultAIConfiguration };
  }
}

export function saveAIConfiguration(
  configuration: AIConfigurationData
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(configuration)
  );
}

export function resetAIConfiguration(): void {
  localStorage.removeItem(STORAGE_KEY);
}