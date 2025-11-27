export const CarvixColors = {
  // Brand
  orange: "#F97316",
  flame: "#FB323C",

  // Neutral greys
  grey50: "#F9FAFB",
  grey100: "#F3F4F6",
  grey200: "#E5E7EB",
  grey300: "#D1D5DB",
  grey400: "#9CA3AF",
  grey500: "#6B7280",
  grey600: "#4B5563",
  grey700: "#374151",
  grey800: "#1F2937",
  grey900: "#111827",

  // Semantic
  error: "#EF4444",
  warning: "#FACC15",
  success: "#34D399",
  info: "#22DDEE",

  // Light / Dark surfaces
  lightBg: "#FFFFFF",
  lightCard: "#F5F5F5",

  darkBg: "#0B0D12",
  darkCard: "#14171D",
} as const;

export type CarvixColorName = keyof typeof CarvixColors;
