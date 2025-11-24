import { Screen } from "@/components/Screen";
import { supabase } from "@/lib/supabase";
import { useCarvixTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, Text, View } from "react-native";

// tip vozila usklađen sa tabelom: userid, platenumber, createdat...
type Vehicle = {
  id: string;
  name: string;
  make: string | null;
  model: string | null;
  platenumber: string | null;
  year: number | null;
  odometer: number | null;
};

export default function GarageScreen() {
  const { theme } = useCarvixTheme();
  const { t } = useTranslation();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const loadVehicles = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("vehicles")
      .select("id, name, make, model, platenumber, year, odometer")
      .order("createdat", { ascending: false });

    if (error) {
      console.log("Error loading vehicles:", error.message);
      setVehicles([]);
    } else if (data) {
      setVehicles(data as Vehicle[]);
    }

    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadVehicles();
    }, [loadVehicles])
  );

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
          {t("garage.title", "Tvoja garaža")}
        </Text>

        {/* EMPTY VIEW */}
        {!loading && vehicles.length === 0 && (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 20,
            }}
          >
            <Ionicons
              name="car-sport-outline"
              size={64}
              color={theme.colors.mutedText}
              style={{ marginBottom: 20 }}
            />

            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: theme.colors.text,
                marginBottom: 6,
                textAlign: "center",
              }}
            >
              {t("garage.emptyTitle", "Nema vozila još uvek")}
            </Text>

            <Text
              style={{
                fontSize: 15,
                color: theme.colors.mutedText,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              {t(
                "garage.emptySubtitle",
                "Dodaj svoje prvo vozilo i započni praćenje troškova i servisa."
              )}
            </Text>
          </View>
        )}

        {/* LISTA VOZILA */}
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/vehicle/${item.id}` as any)}
              style={{
                backgroundColor: theme.colors.card,
                padding: 16,
                borderRadius: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  {/* naslov: marka + model ili name */}
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: theme.colors.text,
                    }}
                  >
                    {item.make || item.model
                      ? `${item.make ?? ""} ${item.model ?? ""}`.trim()
                      : item.name}
                  </Text>

                  {/* tablice */}
                  {item.platenumber && (
                    <Text
                      style={{
                        color: theme.colors.mutedText,
                        marginTop: 4,
                      }}
                    >
                      {t("garage.plate", "Tablice")}: {item.platenumber}
                    </Text>
                  )}

                  {/* godište */}
                  {item.year && (
                    <Text
                      style={{
                        color: theme.colors.mutedText,
                        marginTop: 2,
                      }}
                    >
                      {t("garage.year", "Godište")}: {item.year}
                    </Text>
                  )}
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.mutedText}
                />
              </View>
            </Pressable>
          )}
        />
      </View>
    </Screen>
  );
}
