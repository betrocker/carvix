import { useCarvixTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { PropsWithChildren } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenProps = PropsWithChildren<{
  showBackButton?: boolean;
  hideBackButton?: boolean;
}>;

export function Screen({
  children,
  showBackButton = true,
  hideBackButton = false,
}: ScreenProps) {
  const { theme } = useCarvixTheme();
  const pathname = usePathname();

  // Ne prikazuj back button na tab ekranima
  const isTabScreen =
    pathname.includes("/(tabs)") && !pathname.includes("/vehicle/");

  const shouldShowBackButton =
    showBackButton && !hideBackButton && !isTabScreen && router.canGoBack();

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      {shouldShowBackButton && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 12,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: theme.colors.card,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </Pressable>
        </View>
      )}
      {children}
    </SafeAreaView>
  );
}
