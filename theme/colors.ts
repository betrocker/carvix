export const CarvixColors = {
  // Brand
  orange: "#F97316", // Carvix Orange
  flame: "#FB323C", // Carvix Flame

  // Dark palette
  carbon: "#1F242D", // tamna pozadina
  graphite: "#0D1117",

  // Neutrals
  titaniumGrey: "#9CA3AF",
  electricGrey: "#E5E7EB",

  // Accents
  electricCyan: "#22DDEE",
  warningAmber: "#FACC15",
  errorRed: "#EF4444",

  // Light backgrounds
  lightBg: "#FFFFFF",
  lightCard: "#F5F5F5",

  // Dark backgrounds
  darkBg: "#0B0D12",
  darkCard: "#14171D",

  // Status
  statusServiced: "#34D399",
  statusUpcoming: "#FACC15",
  statusOverdue: "#EF4444",
} as const;

export type CarvixColorName = keyof typeof CarvixColors;
