import { CarvixButton } from "@/components/CarvixButton";
import { CarvixInput } from "@/components/CarvixInput";
import { CarvixPicker } from "@/components/CarvixPicker";
import { Screen } from "@/components/Screen";
import { supabase } from "@/lib/supabase";
import { useCarvixTheme } from "@/theme/ThemeProvider";
import { ServiceType } from "@/types/service";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, Text, View } from "react-native";

export default function AddServiceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useCarvixTheme();
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);

  // Form states
  const [serviceType, setServiceType] = useState<ServiceType>("maintenance");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [serviceDate, setServiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
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

  const handleSave = async () => {
    // Validacija
    if (!title || !serviceDate) {
      Alert.alert(
        t("addService.validationTitle"),
        t("addService.validationMessage")
      );
      return;
    }

    try {
      setSaving(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const serviceData = {
        vehicle_id: id,
        user_id: user.id,
        service_type: serviceType,
        title,
        description: description || null,
        service_date: serviceDate,
        odometer: odometer ? parseInt(odometer) : null,
        cost: cost ? parseFloat(cost) : null,
        currency: "RSD",
        service_provider: serviceProvider || null,
        notes: notes || null,
      };

      const { error } = await supabase
        .from("service_records")
        .insert(serviceData);

      if (error) throw error;

      router.back();
    } catch (error) {
      console.error("Error adding service:", error);
      Alert.alert(t("addService.error"), t("addService.errorSaving"));
    } finally {
      setSaving(false);
    }
  };

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
          {t("addService.title")}
        </Text>

        {/* Tip servisa */}
        <CarvixPicker
          label={t("addService.serviceType")}
          value={serviceType}
          options={serviceTypes}
          onValueChange={(value) => setServiceType(value as ServiceType)}
          placeholder={t("addService.selectServiceType")}
        />

        {/* Naslov */}
        <CarvixInput
          label={t("addService.serviceTitle")}
          placeholder={t("addService.serviceTitlePlaceholder")}
          value={title}
          onChangeText={setTitle}
        />

        {/* Datum */}
        <CarvixInput
          label={t("addService.date")}
          placeholder="2024-12-25"
          value={serviceDate}
          onChangeText={setServiceDate}
        />

        {/* Kilometraža */}
        <CarvixInput
          label={t("addService.odometer")}
          placeholder="50000"
          value={odometer}
          onChangeText={setOdometer}
          keyboardType="numeric"
        />

        {/* Trošak */}
        <CarvixInput
          label={t("addService.cost")}
          placeholder="15000"
          value={cost}
          onChangeText={setCost}
          keyboardType="decimal-pad"
        />

        {/* Servis */}
        <CarvixInput
          label={t("addService.serviceProvider")}
          placeholder={t("addService.serviceProviderPlaceholder")}
          value={serviceProvider}
          onChangeText={setServiceProvider}
        />

        {/* Opis */}
        <CarvixInput
          label={t("addService.description")}
          placeholder={t("addService.descriptionPlaceholder")}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        {/* Napomene */}
        <CarvixInput
          label={t("addService.notes")}
          placeholder={t("addService.notesPlaceholder")}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />

        {/* Action buttons */}
        <View style={{ marginTop: 24, gap: 12, marginBottom: 20 }}>
          <CarvixButton
            label={t("addService.save")}
            onPress={handleSave}
            loading={saving}
            icon="checkmark-circle-outline"
          />
          <CarvixButton
            label={t("addService.cancel")}
            onPress={() => router.back()}
            variant="outline"
            icon="close-circle-outline"
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
