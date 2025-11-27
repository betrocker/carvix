import { createContext, PropsWithChildren, useContext, useState } from "react";
import { CarvixColors } from "./colors";

export type CarvixThemeMode = "light" | "dark";

export interface CarvixTheme {
  colors: {
    background: string;
    backgroundSecondary: string;
    card: string;

    text: string;
    mutedText: string;

    primary: string;
    accent: string;

    border: string;

    success: string;
    warning: string;
    danger: string;
    info: string;
  };
}

const LightTheme: CarvixTheme = {
  colors: {
    background: CarvixColors.lightBg,
    backgroundSecondary: CarvixColors.grey100,
    card: CarvixColors.lightCard,

    text: CarvixColors.grey900,
    mutedText: CarvixColors.grey500,

    primary: CarvixColors.orange,
    accent: CarvixColors.orange,

    border: "rgba(0,0,0,0.08)",

    success: CarvixColors.success,
    warning: CarvixColors.warning,
    danger: CarvixColors.error,
    info: CarvixColors.info,
  },
};

const DarkTheme: CarvixTheme = {
  colors: {
    background: CarvixColors.darkBg,
    backgroundSecondary: CarvixColors.darkCard,
    card: CarvixColors.darkCard,

    text: "#FFFFFF",
    mutedText: CarvixColors.grey400,

    primary: CarvixColors.orange,
    accent: CarvixColors.orange,

    border: "rgba(255,255,255,0.12)",

    success: CarvixColors.success,
    warning: CarvixColors.warning,
    danger: CarvixColors.error,
    info: CarvixColors.info,
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
