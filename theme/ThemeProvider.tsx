// theme/ThemeProvider.tsx
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { CarvixColors } from "./colors";

export type CarvixThemeMode = "light" | "dark";

export interface CarvixTheme {
  colors: {
    background: string;
    card: string;
    text: string;
    mutedText: string;

    // aliasi zbog starih komponenti
    textMuted: string;
    primary: string;
    accent: string;
    backgroundSecondary: string;

    danger: string;
  };
}

const LightTheme: CarvixTheme = {
  colors: {
    background: CarvixColors.lightBg,
    card: CarvixColors.lightCard,
    text: CarvixColors.graphite,
    mutedText: CarvixColors.titaniumGrey,

    textMuted: CarvixColors.titaniumGrey, // alias
    primary: CarvixColors.orange,
    accent: CarvixColors.orange, // za button shadow itd.
    backgroundSecondary: CarvixColors.lightCard,

    danger: CarvixColors.errorRed,
  },
};

const DarkTheme: CarvixTheme = {
  colors: {
    background: CarvixColors.darkBg,
    card: CarvixColors.darkCard,
    text: "#FFFFFF",
    mutedText: CarvixColors.titaniumGrey,

    textMuted: CarvixColors.titaniumGrey, // alias
    primary: CarvixColors.orange,
    accent: CarvixColors.orange,
    backgroundSecondary: CarvixColors.darkCard,

    danger: CarvixColors.errorRed,
  },
};

const ThemeContext = createContext({
  theme: LightTheme as CarvixTheme,
  mode: "light" as CarvixThemeMode,
  toggleMode: () => {},
});

export function CarvixThemeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<CarvixThemeMode>("light");

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = mode === "light" ? LightTheme : DarkTheme;

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useCarvixTheme() {
  return useContext(ThemeContext);
}
