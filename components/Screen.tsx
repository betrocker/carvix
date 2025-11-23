import { useCarvixTheme } from "@/theme/ThemeProvider";
import { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export function Screen({ children }: PropsWithChildren) {
  const { theme } = useCarvixTheme();

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      {children}
    </SafeAreaView>
  );
}
