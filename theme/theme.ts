import { CarvixColors } from "./colors";

export type CarvixThemeMode = "light" | "dark";

export type CarvixTheme = {
  mode: CarvixThemeMode;
  colors: {
    background: string;
    backgroundSecondary: string;
    card: string;
    cardBorder: string;
    text: string;
    textMuted: string;
    accent: string;
    accentOn: string;
    separator: string;
    statusServiced: string;
    statusUpcoming: string;
    statusOverdue: string;
  };
};

export const lightTheme: CarvixTheme = {
  mode: "light",
  colors: {
    background: CarvixColors.lightBg,
    backgroundSecondary: CarvixColors.lightCard,
    card: "#FFFFFF",
    cardBorder: "#E5E7EB",
    text: "#111827",
    textMuted: "#6B7280",
    accent: CarvixColors.orange,
    accentOn: "#FFFFFF",
    separator: "#E5E7EB",
    statusServiced: CarvixColors.statusServiced,
    statusUpcoming: CarvixColors.statusUpcoming,
    statusOverdue: CarvixColors.statusOverdue,
  },
};

export const darkTheme: CarvixTheme = {
  mode: "dark",
  colors: {
    background: CarvixColors.darkBg,
    backgroundSecondary: CarvixColors.darkCard,
    card: CarvixColors.carbon,
    cardBorder: "#111827",
    text: "#F9FAFB",
    textMuted: "#9CA3AF",
    accent: CarvixColors.orange,
    accentOn: "#111827",
    separator: "#1F2937",
    statusServiced: CarvixColors.statusServiced,
    statusUpcoming: CarvixColors.statusUpcoming,
    statusOverdue: CarvixColors.statusOverdue,
  },
};
