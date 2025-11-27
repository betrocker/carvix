import { CarvixButton } from "@/components/CarvixButton";
import { Screen } from "@/components/Screen";
import { supabase } from "@/lib/supabase";
import { useCarvixTheme } from "@/theme/ThemeProvider";
import { ServiceRecord } from "@/types/service";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";

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

export default function ServiceDetailScreen() {
  const { id, serviceId } = useLocalSearchParams<{
    id: string;
    serviceId: string;
  }>();
  const { theme } = useCarvixTheme();
  const { t } = useTranslation();
  const [service, setService] = useState<ServiceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchService();
    }, [serviceId])
  );

  const fetchService = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("service_records")
        .select("*")
        .eq("id", serviceId)
        .single();

      if (error) throw error;
      setService(data);
    } catch (error) {
      console.error("Error fetching service:", error);
      Alert.alert(t("serviceDetail.error"), t("serviceDetail.errorLoading"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      t("serviceDetail.deleteTitle"),
      t("serviceDetail.deleteMessage"),
      [
        {
          text: t("serviceDetail.cancel"),
          style: "cancel",
        },
        {
          text: t("serviceDetail.delete"),
          style: "destructive",
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);

      const { error } = await supabase
        .from("service_records")
        .delete()
        .eq("id", serviceId);

      if (error) throw error;

      router.back();
    } catch (error) {
      console.error("Error deleting service:", error);
      Alert.alert(t("serviceDetail.error"), t("serviceDetail.errorDeleting"));
    } finally {
      setDeleting(false);
    }
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

  if (loading) {
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

  if (!service) {
    return (
      <Screen showBackButton>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: theme.colors.text }}>
            {t("serviceDetail.notFound")}
          </Text>
          <CarvixButton
            label={t("serviceDetail.goBack")}
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
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header sa ikonom */}
        <View
          style={{
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: theme.colors.primary + "20",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons
              name={getServiceIcon(service.service_type)}
              size={40}
              color={theme.colors.primary}
            />
          </View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: theme.colors.text,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            {service.title}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: theme.colors.mutedText,
              textTransform: "capitalize",
            }}
          >
            {t(`serviceTypes.${service.service_type}`)}
          </Text>
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
            {t("serviceDetail.basicInfo")}
          </Text>

          <InfoRow
            label={t("serviceDetail.date")}
            value={formatDate(service.service_date)}
            theme={theme}
            icon="calendar"
          />
          {service.odometer && (
            <InfoRow
              label={t("serviceDetail.odometer")}
              value={`${service.odometer} km`}
              theme={theme}
              icon="speedometer"
            />
          )}
          {service.cost && (
            <InfoRow
              label={t("serviceDetail.cost")}
              value={formatCurrency(service.cost, service.currency)}
              theme={theme}
              icon="cash"
            />
          )}
          {service.service_provider && (
            <InfoRow
              label={t("serviceDetail.serviceProvider")}
              value={service.service_provider}
              theme={theme}
              icon="business"
            />
          )}
        </View>

        {/* Detalji */}
        {(service.description || service.notes) && (
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
              {t("serviceDetail.details")}
            </Text>

            {service.description && (
              <View style={{ marginBottom: service.notes ? 16 : 0 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: theme.colors.mutedText,
                    marginBottom: 8,
                  }}
                >
                  {t("serviceDetail.description")}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: theme.colors.text,
                    lineHeight: 22,
                  }}
                >
                  {service.description}
                </Text>
              </View>
            )}

            {service.notes && (
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: theme.colors.mutedText,
                    marginBottom: 8,
                  }}
                >
                  {t("serviceDetail.notes")}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: theme.colors.text,
                    lineHeight: 22,
                  }}
                >
                  {service.notes}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Action buttons */}
        <View style={{ gap: 12, marginTop: 8 }}>
          <CarvixButton
            label={t("serviceDetail.delete")}
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
