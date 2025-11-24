import { AuthProvider, useAuth } from "@/context/AuthProvider";
import "@/i18n";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { LanguageProvider } from "@/context/LanguageProvider";
import { CarvixThemeProvider, useCarvixTheme } from "@/theme/ThemeProvider";
import "../global.css";

const fontMap = {
  Inter: { uri: "https://rsms.me/inter/font-files/Inter-Regular.otf" },
  "Inter-Medium": { uri: "https://rsms.me/inter/font-files/Inter-Medium.otf" },
  "Inter-Bold": { uri: "https://rsms.me/inter/font-files/Inter-Bold.otf" },
};

void SplashScreen.preventAutoHideAsync();

function ThemedRoot() {
  const { theme, mode } = useCarvixTheme();
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const root = segments.length > 0 ? (segments[0] as string) : null;

  // AUTH GUARD
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = root === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/");
    }
  }, [user, loading, root, router]);

  return (
    <>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontMap);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <CarvixThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <ThemedRoot />
          </AuthProvider>
        </LanguageProvider>
      </CarvixThemeProvider>
    </SafeAreaProvider>
  );
}
