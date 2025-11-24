import { Screen } from "@/components/Screen";
import { supabase } from "@/lib/supabase";
import { useCarvixTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

// Types
type Vehicle = {
  id: string;
  name: string;
  make: string | null;
  model: string | null;
  plateNumber: string | null;
  year: number | null;
  odometer: number | null;
};

type Log = {
  id: string;
  type: string;
  title: string;
  date: string;
  cost: number | null;
  odometer: number | null;
};

export default function VehicleDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useCarvixTheme();
  const { t } = useTranslation();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  // Load vehicle + service logs
  const loadData = async () => {
    setLoading(true);

    // 1. Load vehicle
    const { data: vData } = await supabase
      .from("vehicles")
      .select("id, name, make, model, plateNumber, year, odometer")
      .eq("id", id)
      .single();

    setVehicle(vData ?? null);

    // 2. Load logs
    const { data: lData } = await supabase
      .from("logs")
      .select("id, type, title, date, cost, odometer")
      .eq("vehicleId", id)
      .order("date", { ascending: false });

    setLogs(lData ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading || !vehicle) {
    return (
      <Screen>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ flex: 1, padding: 16 }}>
        {/* HEADER */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: theme.colors.text,
            marginBottom: 12,
          }}
        >
          {vehicle.make} {vehicle.model}
        </Text>

        {/* VEHICLE INFO CARD */}
        <View
          style={{
            backgroundColor: theme.colors.card,
            padding: 16,
            borderRadius: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}
        >
          {vehicle.plateNumber && (
            <InfoRow
              icon="pricetag-outline"
              label={t("vehicle.plate", "Tablice")}
              value={vehicle.plateNumber}
              color={theme.colors.text}
            />
          )}

          {vehicle.year && (
            <InfoRow
              icon="calendar-outline"
              label={t("vehicle.year", "Godište")}
              value={String(vehicle.year)}
              color={theme.colors.text}
            />
          )}

          {vehicle.odometer !== null && (
            <InfoRow
              icon="speedometer-outline"
              label={t("vehicle.odometer", "Kilometraža")}
              value={`${vehicle.odometer} km`}
              color={theme.colors.text}
            />
          )}
        </View>

        {/* ADD SERVICE BUTTON */}
        <Pressable
          onPress={() => router.push(`/vehicle/${id}/add-service` as any)}
          style={{
            backgroundColor: theme.colors.primary,
            paddingVertical: 12,
            borderRadius: 999,
            marginBottom: 16,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#fff",
            }}
          >
            {t("vehicle.addService", "Dodaj servis")}
          </Text>
        </Pressable>

        {/* SERVICE LOGS */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: theme.colors.text,
            marginBottom: 8,
          }}
        >
          {t("vehicle.serviceHistory", "Istorija servisa")}
        </Text>

        {logs.length === 0 ? (
          <Text style={{ color: theme.colors.mutedText, marginTop: 8 }}>
            {t("vehicle.noServices", "Nema zabeleženih servisa")}
          </Text>
        ) : (
          <FlatList
            data={logs}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 50 }}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: theme.colors.card,
                  padding: 16,
                  borderRadius: 16,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: theme.colors.text,
                  }}
                >
                  {item.title}
                </Text>

                <Text style={{ color: theme.colors.mutedText, marginTop: 4 }}>
                  {new Date(item.date).toLocaleDateString()}
                </Text>

                {item.cost && (
                  <Text
                    style={{
                      color: theme.colors.text,
                      marginTop: 4,
                      fontWeight: "500",
                    }}
                  >
                    {t("vehicle.cost", "Trošak")}: {item.cost} RSD
                  </Text>
                )}

                {item.odometer && (
                  <Text style={{ color: theme.colors.mutedText, marginTop: 4 }}>
                    {t("vehicle.atOdometer", "Na kilometraži")}: {item.odometer}{" "}
                    km
                  </Text>
                )}
              </View>
            )}
          />
        )}
      </View>
    </Screen>
  );
}

// Small reusable detail row
function InfoRow({
  icon,
  label,
  value,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
      }}
    >
      <Ionicons
        name={icon}
        size={18}
        color={color}
        style={{ marginRight: 10 }}
      />
      <Text style={{ color }}>{label}:</Text>
      <Text
        style={{
          color,
          fontWeight: "600",
          marginLeft: 6,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
