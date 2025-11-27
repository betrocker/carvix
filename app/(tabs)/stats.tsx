// app/(tabs)/stats.tsx
import { Screen } from "@/components/Screen";
import { useCarvixTheme } from "@/theme/ThemeProvider";
import { Text, View } from "react-native";

export default function StatsScreen() {
  const { theme } = useCarvixTheme();

  return (
    <Screen>
      <View style={{ flex: 1, padding: 16 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: theme.colors.text,
          }}
        >
          Stats
        </Text>
        <Text style={{ marginTop: 8, color: theme.colors.text }}>
          Ovde kasnije ide graf potrošnje, servisa po mesecu, itd.
        </Text>
      </View>
    </Screen>
  );
}
