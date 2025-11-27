// app/(tabs)/_layout.tsx
import { CarvixTabBar } from "@/components/CarvixTabBar";
import { useAuth } from "@/context/AuthProvider";
import { useCarvixTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs, router, usePathname } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const { theme } = useCarvixTheme();
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  if (loading) return null;
  if (!user) return <Redirect href="/(auth)/login" />;

  // FAB prikazujemo SAMO na Garage ekranu
  const showFab = pathname === "/(tabs)/garage" || pathname.endsWith("/garage");

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: "transparent" },
        }}
        tabBar={(props) => <CarvixTabBar {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{ headerTitle: t("headers.home") }}
        />
        <Tabs.Screen
          name="garage"
          options={{ headerTitle: t("headers.garage") }}
        />
        <Tabs.Screen
          name="stats"
          options={{ headerTitle: t("headers.stats") }}
        />
        <Tabs.Screen
          name="settings"
          options={{ headerTitle: t("headers.settings") }}
        />
      </Tabs>

      {showFab && (
        <Pressable
          onPress={() => {
            router.push("/add-vehicle");
          }}
          style={{
            position: "absolute",
            right: 24,
            bottom: insets.bottom + 100, // ⬅️ ispod safe area + preko CarvixTabBar
            width: 56,
            height: 56,
            borderRadius: 999,
            backgroundColor: theme.colors.primary,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            elevation: 30,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
          }}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </Pressable>
      )}
    </View>
  );
}
