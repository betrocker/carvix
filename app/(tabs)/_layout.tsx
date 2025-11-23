// app/(tabs)/_layout.tsx
import { CarvixTabBar } from "@/components/CarvixTabBar";
import { useAuth } from "@/context/AuthProvider";
import { useCarvixTheme } from "@/theme/ThemeProvider";
import { Redirect, Tabs } from "expo-router";

export default function TabsLayout() {
  const { theme } = useCarvixTheme();
  const { user, loading } = useAuth();

  if (loading) {
    return null; // može i neki full-screen loader
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "transparent",
        },
      }}
      tabBar={(props) => <CarvixTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="garage"
        options={{
          title: "Garage",
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />
    </Tabs>
  );
}
