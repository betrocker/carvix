import { Screen } from "@/components/Screen";
import { supabase } from "@/lib/supabase";
import { useCarvixTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, Text, View } from "react-native";

type Vehicle = {
  id: string;
  name: string;
  make: string | null;
  model: string | null;
  platenumber: string | null;
  year: number | null;
  odometer: number | null;
  type: string | null;
  nextservicedue: string | null;
  imageurl: string | null;
};

export default function GarageScreen() {
  const { theme } = useCarvixTheme();
  const { t } = useTranslation();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUserId(data.user.id);
    };
    fetchUser();
  }, []);

  const loadVehicles = useCallback(async () => {
    if (!userId) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("vehicles")
      .select(
        "id, name, make, model, platenumber, year, odometer, type, nextservicedue, imageurl"
      )
      .eq("userid", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Error loading vehicles:", error.message);
      setVehicles([]);
    } else if (data) {
      setVehicles(data as Vehicle[]);
    }

    setLoading(false);
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      loadVehicles();
    }, [loadVehicles])
  );

  return (
    <Screen>
      <View style={{ flex: 1, padding: 16 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: theme.colors.text,
            marginBottom: 16,
          }}
        >
          {t("garage.title", "Tvoja garaža")}
        </Text>

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

        <FlatList
          key="garage-grid-2-columns"
          data={vehicles}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ paddingBottom: 120, gap: 12 }}
          refreshing={loading}
          onRefresh={loadVehicles}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/vehicle/${item.id}` as any)}
              style={{
                flex: 1,
                backgroundColor: theme.colors.card,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: theme.colors.border,
                overflow: "hidden",
              }}
            >
              {/* SLIKA VOZILA */}
              {item.imageurl ? (
                <Image
                  source={{ uri: item.imageurl }}
                  style={{ width: "100%", height: 120 }}
                  contentFit="cover"
                />
              ) : (
                <View
                  style={{
                    width: "100%",
                    height: 120,
                    backgroundColor: theme.colors.background,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="car-outline"
                    size={40}
                    color={theme.colors.mutedText}
                  />
                </View>
              )}

              {/* INFO VOZILA */}
              <View style={{ padding: 12 }}>
                {/* TIP VOZILA - badge */}
                <View
                  style={{
                    backgroundColor: theme.colors.primary + "20",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6,
                    alignSelf: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "600",
                      color: theme.colors.primary,
                      textTransform: "uppercase",
                    }}
                  >
                    {item.type}
                  </Text>
                </View>

                {/* NAZIV */}
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: theme.colors.text,
                    marginBottom: 4,
                  }}
                  numberOfLines={1}
                >
                  {item.make || item.model
                    ? `${item.make ?? ""} ${item.model ?? ""}`.trim()
                    : item.name}
                </Text>

                {/* TABLICE */}
                {item.platenumber && (
                  <Text
                    style={{
                      color: theme.colors.mutedText,
                      fontSize: 12,
                      marginBottom: 2,
                    }}
                    numberOfLines={1}
                  >
                    {item.platenumber}
                  </Text>
                )}

                {/* GODINA */}
                {item.year && (
                  <Text
                    style={{
                      color: theme.colors.mutedText,
                      fontSize: 12,
                      marginBottom: 2,
                    }}
                  >
                    {item.year}
                  </Text>
                )}

                {/* KILOMETRAŽA */}
                {item.odometer !== null && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 4,
                      gap: 4,
                    }}
                  >
                    <Ionicons
                      name="speedometer-outline"
                      size={14}
                      color={theme.colors.mutedText}
                    />
                    <Text
                      style={{
                        color: theme.colors.mutedText,
                        fontSize: 12,
                      }}
                    >
                      {item.odometer.toLocaleString()} km
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          )}
        />
      </View>
    </Screen>
  );
}
