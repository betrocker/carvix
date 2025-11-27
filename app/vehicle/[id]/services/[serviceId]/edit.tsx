import { CarvixButton } from "@/components/CarvixButton";
import { CarvixInput } from "@/components/CarvixInput";
import { CarvixPicker } from "@/components/CarvixPicker";
import { Screen } from "@/components/Screen";
import { useCurrency } from "@/context/CurrencyProvider";
import { supabase } from "@/lib/supabase";
import { useCarvixTheme } from "@/theme/ThemeProvider";
import { ServiceType } from "@/types/service";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";

export default function EditServiceScreen() {
  const { id, serviceId } = useLocalSearchParams<{
    id: string;
    serviceId: string;
  }>();
  const { theme } = useCarvixTheme();
  const { t } = useTranslation();
  const { currency, convertCurrency } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [serviceType, setServiceType] = useState<ServiceType>("maintenance");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [odometer, setOdometer] = useState("");
  const [cost, setCost] = useState("");
  const [serviceProvider, setServiceProvider] = useState("");
  const [notes, setNotes] = useState("");

  const serviceTypes = [
    {
      label: t("serviceTypes.maintenance"),
      value: "maintenance" as ServiceType,
      icon: "construct" as const,
    },
    {
      label: t("serviceTypes.repair"),
      value: "repair" as ServiceType,
      icon: "build" as const,
    },
    {
      label: t("serviceTypes.inspection"),
      value: "inspection" as ServiceType,
      icon: "checkmark-circle" as const,
    },
    {
      label: t("serviceTypes.oil_change"),
      value: "oil_change" as ServiceType,
      icon: "water" as const,
    },
    {
      label: t("serviceTypes.tire_change"),
      value: "tire_change" as ServiceType,
      icon: "ellipse" as const,
    },
    {
      label: t("serviceTypes.other"),
      value: "other" as ServiceType,
      icon: "document-text" as const,
    },
  ];

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

      // Konvertuj trošak iz originalne valute u trenutnu
      const convertedCost = data.cost
        ? convertCurrency(data.cost, data.currency || "RSD")
        : 0;

      // Popuni formu sa postojećim podacima
      setServiceType(data.service_type);
      setTitle(data.title);
      setDescription(data.description || "");
      setServiceDate(data.service_date);
      setOdometer(data.odometer?.toString() || "");
      setCost(convertedCost > 0 ? Math.round(convertedCost).toString() : ""); // Konvertovani trošak
      setServiceProvider(data.service_provider || "");
      setNotes(data.notes || "");
    } catch (error) {
      console.error("Error fetching service:", error);
      Alert.alert(t("editService.error"), t("editService.errorLoading"));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validacija
    if (!title || !serviceDate) {
      Alert.alert(
        t("editService.validationTitle"),
        t("editService.validationMessage")
      );
      return;
    }

    try {
      setSaving(true);

      const serviceData = {
        service_type: serviceType,
        title,
        description: description || null,
        service_date: serviceDate,
        odometer: odometer ? parseInt(odometer) : null,
        cost: cost ? parseFloat(cost) : null,
        currency: currency,
        service_provider: serviceProvider || null,
        notes: notes || null,
      };

      const { error } = await supabase
        .from("service_records")
        .update(serviceData)
        .eq("id", serviceId);

      if (error) throw error;

      router.back();
    } catch (error) {
      console.error("Error updating service:", error);
      Alert.alert(t("editService.error"), t("editService.errorSaving"));
    } finally {
      setSaving(false);
    }
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

  return (
    <Screen showBackButton>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: theme.colors.text,
            marginBottom: 20,
          }}
        >
          {t("editService.title")}
        </Text>

        {/* Tip servisa */}
        <CarvixPicker
          label={t("editService.serviceType")}
          value={serviceType}
          options={serviceTypes}
          onValueChange={(value) => setServiceType(value as ServiceType)}
          placeholder={t("editService.selectServiceType")}
        />

        {/* Naslov */}
        <CarvixInput
          label={t("editService.serviceTitle")}
          placeholder={t("editService.serviceTitlePlaceholder")}
          value={title}
          onChangeText={setTitle}
        />

        {/* Datum */}
        <CarvixInput
          label={t("editService.date")}
          placeholder="2024-12-25"
          value={serviceDate}
          onChangeText={setServiceDate}
        />

        {/* Kilometraža */}
        <CarvixInput
          label={t("editService.odometer")}
          placeholder="50000"
          value={odometer}
          onChangeText={setOdometer}
          keyboardType="numeric"
        />

        {/* Trošak */}
        <CarvixInput
          label={`${t("editService.cost")} (${currency})`}
          placeholder="15000"
          value={cost}
          onChangeText={setCost}
          keyboardType="decimal-pad"
        />

        {/* Servis */}
        <CarvixInput
          label={t("editService.serviceProvider")}
          placeholder={t("editService.serviceProviderPlaceholder")}
          value={serviceProvider}
          onChangeText={setServiceProvider}
        />

        {/* Opis */}
        <CarvixInput
          label={t("editService.description")}
          placeholder={t("editService.descriptionPlaceholder")}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        {/* Napomene */}
        <CarvixInput
          label={t("editService.notes")}
          placeholder={t("editService.notesPlaceholder")}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />

        {/* Action buttons */}
        <View style={{ marginTop: 24, gap: 12, marginBottom: 20 }}>
          <CarvixButton
            label={t("editService.save")}
            onPress={handleSave}
            loading={saving}
          />
          <CarvixButton
            label={t("editService.cancel")}
            onPress={() => router.back()}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
