
import {
  defaultPlatformSettings,
  type PlatformSettings,
} from "../data/platformSettings";

const STORAGE_KEY = "criphy-platform-settings";

function isPlatformSettings(
  value: unknown
): value is PlatformSettings {
  if (!value || typeof value !== "object") {
    return false;
  }

  const settings = value as Record<string, unknown>;

  return (
    typeof settings.platformName === "string" &&
    typeof settings.platformDescription === "string" &&
    typeof settings.defaultClassLevel === "string" &&
    typeof settings.defaultTopic === "string" &&
    typeof settings.masteryThreshold === "number" &&
    Number.isInteger(settings.masteryThreshold) &&
    settings.masteryThreshold >= 0 &&
    settings.masteryThreshold <= 100
  );
}

export function loadPlatformSettings(): PlatformSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return { ...defaultPlatformSettings };
    }

    const parsed: unknown = JSON.parse(stored);

    return isPlatformSettings(parsed)
      ? parsed
      : { ...defaultPlatformSettings };
  } catch {
    return { ...defaultPlatformSettings };
  }
}

export function savePlatformSettings(
  settings: PlatformSettings
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(settings)
  );
}

export function resetPlatformSettings(): void {
  localStorage.removeItem(STORAGE_KEY);
}