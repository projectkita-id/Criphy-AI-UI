
export type PlatformSettings = {
  platformName: string;
  platformDescription: string;
  defaultClassLevel: string;
  defaultTopic: string;
  masteryThreshold: number;
};

export const defaultPlatformSettings: PlatformSettings = {
  platformName: "CRI-PHY AI",
  platformDescription:
    "Platform pembelajaran fisika berbasis konflik kognitif dan kecerdasan buatan.",
  defaultClassLevel: "XI",
  defaultTopic: "Kinematika Gerak Lurus",
  masteryThreshold: 80,
};