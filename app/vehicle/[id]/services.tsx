import { CarvixButton } from "@/components/CarvixButton";
import { Screen } from "@/components/Screen";
import { supabase } from "@/lib/supabase";
import { useCarvixTheme } from "@/theme/ThemeProvider";
import { ServiceRecord } from "@/types/service";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";

const getServiceIcon = (type: string): keyof typeof Ionicons.glyphMap => {
  const icons: { [key: string]: keyof typeof Ionicons.glyphMap } = {
    maintenance: "construct",
    repair: "build",
    inspection: "checkmark-circle",
    oil_change: "water",
    tire_change: "ellipse",
    other: "document-text",
  };
  return icons[type] || "document-text";
};

export default function ServiceListScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useCarvixTheme();
  const { t } = useTranslation();
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchServices();
    }, [id])
  );

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("service_records")
        .select("*")
        .eq("vehicle_id", id)
        .order("service_date", { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      Alert.alert(t("services.error"), t("services.errorLoading"));
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchServices();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("sr-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount?: number, currency?: string) => {
    if (!amount) return "-";
    return `${amount.toLocaleString("sr-RS")} ${currency || "RSD"}`;
  };

  const renderServiceItem = ({ item }: { item: ServiceRecord }) => (
    <Pressable
      onPress={() => router.push(`/vehicle/${id}/services/${item.id}`)}
      style={{
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: theme.colors.primary + "20",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons
          name={getServiceIcon(item.service_type)}
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
            marginBottom: 4,
          }}
        >
          {item.title}
        </Text>
        <Text style={{ fontSize: 14, color: theme.colors.mutedText }}>
          {formatDate(item.service_date)}
          {item.odometer && ` • ${item.odometer} km`}
        </Text>
        {item.cost && (
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: theme.colors.primary,
              marginTop: 4,
            }}
          >
            {formatCurrency(item.cost, item.currency)}
          </Text>
        )}
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={theme.colors.mutedText}
      />
    </Pressable>
  );

  const renderHeader = () => (
    <Text
      style={{
        fontSize: 24,
        fontWeight: "bold",
        color: theme.colors.text,
        marginBottom: 16,
      }}
    >
      {t("services.title")}
    </Text>
  );

  const renderEmptyState = () => (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
      }}
    >
      <Ionicons
        name="document-text-outline"
        size={64}
        color={theme.colors.mutedText}
      />
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: theme.colors.text,
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        {t("services.noRecords")}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: theme.colors.mutedText,
          textAlign: "center",
          paddingHorizontal: 32,
        }}
      >
        {t("services.noRecordsDescription")}
      </Text>
    </View>
  );

  const renderFooter = () => (
    <View style={{ marginTop: 8, marginBottom: 20 }}>
      <CarvixButton
        label={t("services.addRecord")}
        onPress={() => router.push(`/vehicle/${id}/services/add`)}
        icon="add-circle"
      />
    </View>
  );

  return (
    <Screen showBackButton>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={renderServiceItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}
