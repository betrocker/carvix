import { CarvixButton } from "@/components/CarvixButton";
import { Screen } from "@/components/Screen";
import { supabase } from "@/lib/supabase";
import { useCarvixTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

type Vehicle = {
  id: string;
  userid: string;
  name: string;
  make: string;
  model: string;
  type: string;
  platenumber?: string;
  year?: number;
  odometer?: number;
  vin?: string;
  enginecapacity?: string;
  loadcapacity?: string;
  imageurl?: string;
  created_at: string;
  updated_at: string;
};

const getVehicleIcon = (type: string) => {
  const icons: { [key: string]: keyof typeof Ionicons.glyphMap } = {
    car: "car",
    motorcycle: "bicycle",
    truck: "bus",
    bicycle: "bicycle-outline",
    quad: "car-sport",
    tractor: "trail-sign",
  };
  return icons[type] || "car";
};

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useCarvixTheme();
  const { t } = useTranslation();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchVehicle();
    }, [id])
  );

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setVehicle(data);
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      Alert.alert(t("vehicleDetail.error"), t("vehicleDetail.errorLoading"));
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVehicle();
    setRefreshing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      t("vehicleDetail.deleteTitle"),
      t("vehicleDetail.deleteMessage"),
      [
        {
          text: t("vehicleDetail.cancel"),
          style: "cancel",
        },
        {
          text: t("vehicleDetail.delete"),
          style: "destructive",
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);

      // Obriši sliku iz storage-a ako postoji
      if (vehicle?.imageurl) {
        const fileName = vehicle.imageurl.split("/").pop();
        if (fileName) {
          await supabase.storage.from("vehicle-images").remove([fileName]);
        }
      }

      // Obriši vozilo iz baze
      const { error } = await supabase.from("vehicles").delete().eq("id", id);

      if (error) throw error;

      Alert.alert(
        t("vehicleDetail.deleteSuccess"),
        t("vehicleDetail.deleteSuccessMessage"),
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      Alert.alert(t("vehicleDetail.error"), t("vehicleDetail.errorDeleting"));
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    router.push(`/vehicle/edit/${id}`);
  };

  if (loading && !vehicle) {
    return (
      <Screen showBackButton>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </Screen>
    );
  }

  if (!vehicle) {
    return (
      <Screen showBackButton>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: theme.colors.text }}>
            {t("vehicleDetail.notFound")}
          </Text>
          <CarvixButton
            label={t("vehicleDetail.goBack")}
            onPress={() => router.back()}
            style={{ marginTop: 16 }}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen showBackButton>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Slika vozila */}
        {vehicle.imageurl ? (
          <Image
            source={{ uri: vehicle.imageurl }}
            style={{
              width: "100%",
              height: 250,
              borderRadius: 12,
              marginBottom: 20,
            }}
            contentFit="cover"
          />
        ) : (
          <View
            style={{
              width: "100%",
              height: 250,
              borderRadius: 12,
              backgroundColor: theme.colors.card,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Ionicons
              name={getVehicleIcon(vehicle.type)}
              size={80}
              color={theme.colors.mutedText}
            />
          </View>
        )}

        {/* Naziv i tip */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: theme.colors.text,
              marginBottom: 8,
            }}
          >
            {vehicle.name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Ionicons
              name={getVehicleIcon(vehicle.type)}
              size={20}
              color={theme.colors.primary}
            />
            <Text
              style={{
                fontSize: 16,
                color: theme.colors.mutedText,
                textTransform: "capitalize",
              }}
            >
              {t(`vehicleTypes.${vehicle.type}`)}
            </Text>
          </View>
        </View>

        {/* Osnovne informacije */}
        <View
          style={{
            backgroundColor: theme.colors.card,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: theme.colors.text,
              marginBottom: 16,
            }}
          >
            {t("vehicleDetail.basicInfo")}
          </Text>

          <InfoRow
            label={t("vehicleDetail.make")}
            value={vehicle.make}
            theme={theme}
          />
          <InfoRow
            label={t("vehicleDetail.model")}
            value={vehicle.model}
            theme={theme}
          />
          {vehicle.platenumber && (
            <InfoRow
              label={t("vehicleDetail.plate")}
              value={vehicle.platenumber}
              theme={theme}
            />
          )}
          {vehicle.year && (
            <InfoRow
              label={t("vehicleDetail.year")}
              value={vehicle.year.toString()}
              theme={theme}
            />
          )}
          {vehicle.vin && (
            <InfoRow
              label={t("vehicleDetail.vin")}
              value={vehicle.vin}
              theme={theme}
            />
          )}
        </View>

        {/* Dodatne informacije */}
        {(vehicle.odometer !== null && vehicle.odometer !== undefined) ||
        vehicle.enginecapacity ||
        vehicle.loadcapacity ? (
          <View
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: theme.colors.text,
                marginBottom: 16,
              }}
            >
              {t("vehicleDetail.additionalInfo")}
            </Text>

            {vehicle.odometer !== null && vehicle.odometer !== undefined && (
              <InfoRow
                label={t("vehicleDetail.odometer")}
                value={`${vehicle.odometer} km`}
                theme={theme}
                icon="speedometer"
              />
            )}
            {vehicle.enginecapacity && (
              <InfoRow
                label={t("vehicleDetail.engineCapacity")}
                value={vehicle.enginecapacity}
                theme={theme}
                icon="flash"
              />
            )}
            {vehicle.loadcapacity && (
              <InfoRow
                label={t("vehicleDetail.loadCapacity")}
                value={vehicle.loadcapacity}
                theme={theme}
                icon="cube"
              />
            )}
          </View>
        ) : null}

        {/* Action buttons */}
        <View style={{ gap: 12, marginTop: 8, marginBottom: 32 }}>
          <CarvixButton
            label={t("vehicleDetail.services")}
            onPress={() => router.push(`/vehicle/${id}/services`)}
            icon="construct-outline"
            variant="secondary"
          />
          <CarvixButton
            label={t("vehicleDetail.edit")}
            onPress={handleEdit}
            icon="create-outline"
          />
          <CarvixButton
            label={t("vehicleDetail.delete")}
            onPress={handleDelete}
            loading={deleting}
            icon="trash-outline"
            style={{
              backgroundColor: theme.colors.danger,
            }}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

// Helper komponenta za prikaz info redova
function InfoRow({
  label,
  value,
  theme,
  icon,
}: {
  label: string;
  value: string;
  theme: any;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {icon && (
          <Ionicons name={icon} size={18} color={theme.colors.mutedText} />
        )}
        <Text style={{ fontSize: 15, color: theme.colors.mutedText }}>
          {label}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 15,
          fontWeight: "500",
          color: theme.colors.text,
          maxWidth: "60%",
          textAlign: "right",
        }}
      >
        {value}
      </Text>
    </View>
  );
}
