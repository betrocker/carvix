// app/(tabs)/garage.tsx
import { Screen } from "@/components/Screen";
import { useCarvixTheme } from "@/theme/ThemeProvider";
import { Text, View } from "react-native";

export default function GarageScreen() {
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
          Garage
        </Text>
        <Text style={{ marginTop: 8, color: theme.colors.text }}>
          Ovde ćemo napraviti listu vozila (kartice sa registarskim brojem,
          modelom, sledećim servisom, itd.).
        </Text>
      </View>
    </Screen>
  );
}
