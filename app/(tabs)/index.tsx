// app/(tabs)/index.tsx
import { CarvixButton } from "@/components/CarvixButton";
import { Screen } from "@/components/Screen";
import { useCurrency } from "@/context/CurrencyProvider";
import { supabase } from "@/lib/supabase";
import { useCarvixTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Vehicle {
  id: string;
  name?: string;
  make: string;
  model: string;
  year: number;
}

export default function HomeScreen() {
  const { theme } = useCarvixTheme();
  const { t } = useTranslation();
  const { currency, convertCurrency } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    upcomingServices: 0,
    totalCosts: 0,
    avgCost: 0,
  });

  // Modal za izbor vozila
  const [selectVehicleVisible, setSelectVehicleVisible] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch broj vozila
      const { count: vehicleCount } = await supabase
        .from("vehicles")
        .select("*", { count: "exact", head: true });

      // Fetch servise za ovu godinu
      const currentYear = new Date().getFullYear();
      const { data: services } = await supabase
        .from("service_records")
        .select("cost, currency, service_date")
        .gte("service_date", `${currentYear}-01-01`)
        .lte("service_date", `${currentYear}-12-31`);

      // FILTRIRAJ samo servise sa troškom > 0
      const servicesWithCost =
        services?.filter((s) => s.cost && s.cost > 0) || [];

      // Konvertuj samo te troškove
      const convertedCosts = servicesWithCost.map((s) =>
        convertCurrency(s.cost, s.currency || "RSD")
      );

      const totalCosts = convertedCosts.reduce((sum, cost) => sum + cost, 0);
      const avgCost =
        convertedCosts.length > 0 ? totalCosts / convertedCosts.length : 0;

      setStats({
        totalVehicles: vehicleCount || 0,
        upcomingServices: 0,
        totalCosts,
        avgCost,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }, [convertCurrency]);

  const fetchVehicles = async () => {
    try {
      setLoadingVehicles(true);
      const { data, error } = await supabase
        .from("vehicles")
        .select("id, name, make, model, year")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoadingVehicles(false);
    }
  };

  const handleAddServiceClick = () => {
    if (stats.totalVehicles === 0) {
      alert(t("home.noVehiclesAlert", "Prvo dodaj vozilo!"));
    } else {
      fetchVehicles();
      setSelectVehicleVisible(true);
    }
  };

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectVehicleVisible(false);
    router.push(`/vehicle/${vehicleId}/services/add`);
  };

  // Refresh data kad ekran dobije fokus
  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats])
  );

  if (loading) {
    return (
      <Screen>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ flex: 1, padding: 16, gap: 16 }}>
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
        <View style={{ flexDirection: "row", gap: 12 }}>
          <DashboardCard
            icon="car-sport-outline"
            label={t("home.totalVehicles", "Ukupno vozila")}
            value={stats.totalVehicles.toString()}
          />

          <DashboardCard
            icon="calendar-outline"
            label={t("home.upcomingServices", "Predstojeći servisi")}
            value={stats.upcomingServices.toString()}
          />
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <DashboardCard
            icon="cash-outline"
            label={t("home.totalCosts", "Troškovi ove godine")}
            value={`${Math.round(stats.totalCosts).toLocaleString("sr-RS")} ${currency}`}
          />

          <DashboardCard
            icon="speedometer-outline"
            label={t("home.avgCost", "Prosečan servis")}
            value={`${Math.round(stats.avgCost).toLocaleString("sr-RS")} ${currency}`}
          />
        </View>

        {/* SHORTCUTS */}
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
            icon="car-outline"
            label={t("home.addVehicleBtn", "Dodaj vozilo")}
            onPress={() => router.push("/add-vehicle")}
          />
          <ShortcutButton
            icon="construct-outline"
            label={t("home.addServiceBtn", "Evidentiraj servis")}
            onPress={handleAddServiceClick}
          />
        </View>
      </View>

      {/* MODAL ZA IZBOR VOZILA */}
      <Modal
        visible={selectVehicleVisible}
        animationType="slide"
        onRequestClose={() => setSelectVehicleVisible(false)}
        transparent
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.background,
              borderRadius: 16,
              padding: 20,
              maxHeight: "80%",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: theme.colors.text,
                marginBottom: 16,
              }}
            >
              {t("home.selectVehicle", "Izaberi vozilo")}
            </Text>

            {loadingVehicles ? (
              <View style={{ padding: 40, alignItems: "center" }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </View>
            ) : vehicles.length === 0 ? (
              <Text
                style={{
                  color: theme.colors.mutedText,
                  textAlign: "center",
                  padding: 20,
                }}
              >
                {t("home.noVehicles", "Nema vozila")}
              </Text>
            ) : (
              <FlatList
                data={vehicles}
                keyExtractor={(item) => item.id}
                style={{ maxHeight: 400 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleVehicleSelect(item.id)}
                    style={{
                      paddingVertical: 16,
                      paddingHorizontal: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: theme.colors.border,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: theme.colors.primary + "20",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons
                        name="car-sport"
                        size={24}
                        color={theme.colors.primary}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: theme.colors.text,
                        }}
                      >
                        {item.name || `${item.make} ${item.model}`}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: theme.colors.mutedText,
                          marginTop: 2,
                        }}
                      >
                        {item.year}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={theme.colors.mutedText}
                    />
                  </TouchableOpacity>
                )}
              />
            )}

            <CarvixButton
              label={t("common.cancel", "Otkaži")}
              onPress={() => setSelectVehicleVisible(false)}
              variant="secondary"
              style={{ marginTop: 16 }}
            />
          </View>
        </View>
      </Modal>
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
