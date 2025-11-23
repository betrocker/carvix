// app/(tabs)/index.tsx
import { Screen } from "@/components/Screen";
import { useCarvixTheme } from "@/theme/ThemeProvider";
import { Text, View } from "react-native";

export default function HomeScreen() {
  const { theme } = useCarvixTheme();

  return (
    <Screen>
      <View
        style={{
          flex: 1,
          padding: 16,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: theme.colors.text,
            marginBottom: 12,
          }}
        >
          Carvix Garage Manager
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: theme.colors.text,
          }}
        >
          Ovde ide dashboard: brzi pregled auta, termina i troškova.
        </Text>
      </View>
    </Screen>
  );
}
