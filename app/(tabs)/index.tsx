// app/(tabs)/index.tsx
import { Screen } from "@/components/Screen";
import { useCarvixTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

export default function HomeScreen() {
  const { theme } = useCarvixTheme();
  const { t } = useTranslation();

  return (
    <Screen>
      <View
        style={{
          flex: 1,
          padding: 16,
          gap: 16,
        }}
      >
        {/* HEADER TITLE */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: theme.colors.text,
          }}
        >
          {t("home.title", "Carvix Garage Manager")}
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: theme.colors.mutedText,
            marginTop: -4,
            marginBottom: 8,
          }}
        >
          {t("home.subtitle", "Brzi pregled tvoje garaže.")}
        </Text>

        {/* DASHBOARD GRID */}
        <View
          style={{
            flexDirection: "row",
            gap: 12,
          }}
        >
          {/* BROJ VOZILA */}
          <DashboardCard
            icon="car-sport-outline"
            label={t("home.totalVehicles", "Ukupno vozila")}
            value="0"
          />

          {/* SERVISNI TERMINI */}
          <DashboardCard
            icon="calendar-outline"
            label={t("home.upcomingServices", "Predstojeći servisi")}
            value="0"
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 12,
          }}
        >
          {/* TROŠKOVI */}
          <DashboardCard
            icon="cash-outline"
            label={t("home.totalCosts", "Troškovi ove godine")}
            value="0€"
          />

          {/* PROSEČNA CENA SERVISA */}
          <DashboardCard
            icon="speedometer-outline"
            label={t("home.avgCost", "Prosečan servis")}
            value="0€"
          />
        </View>

        {/* FUTURE BUTTONS / SHORTCUTS */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            marginTop: 12,
            color: theme.colors.text,
          }}
        >
          {t("home.shortcuts", "Brze akcije")}
        </Text>

        <View style={{ gap: 12 }}>
          <ShortcutButton
            icon="construct-outline"
            label={t("home.addServiceBtn", "Evidentiraj servis")}
            onPress={() => console.log("Add service")}
          />
        </View>
      </View>
    </Screen>
  );
}

function DashboardCard({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  const { theme } = useCarvixTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.card,
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}
    >
      <Ionicons
        name={icon}
        size={22}
        color={theme.colors.primary}
        style={{ marginBottom: 6 }}
      />
      <Text
        style={{
          fontSize: 13,
          color: theme.colors.mutedText,
          marginBottom: 2,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
          color: theme.colors.text,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function ShortcutButton({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const { theme } = useCarvixTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.card,
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}
    >
      <Ionicons
        name={icon}
        size={22}
        color={theme.colors.primary}
        style={{ marginRight: 14 }}
      />
      <Text
        style={{
          fontSize: 16,
          fontWeight: "500",
          color: theme.colors.text,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
