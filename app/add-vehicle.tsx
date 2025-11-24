import { CarvixButton } from "@/components/CarvixButton";
import { CarvixInput } from "@/components/CarvixInput";
import { Screen } from "@/components/Screen";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useCarvixTheme } from "@/theme/ThemeProvider";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
} from "react-native";

export default function AddVehicleScreen() {
  const { theme } = useCarvixTheme();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [year, setYear] = useState("");
  const [odometer, setOdometer] = useState("");
  const [vin, setVin] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!make || !model || !plateNumber) {
      Alert.alert(
        t("addVehicle.validationTitle"),
        t("addVehicle.validationRequired")
      );
      return;
    }

    if (!user) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    const parsedYear = year ? Number(year) : null;
    const parsedOdometer = odometer ? Number(odometer) : null;

    const name =
      `${make} ${model}`.trim() || plateNumber || t("addVehicle.defaultName");

    setLoading(true);

    const { error } = await supabase.from("vehicles").insert({
      userid: user.id,
      orgid: null,
      type: "car",
      name,
      make,
      model,
      year: parsedYear,
      platenumber: plateNumber,
      vin: vin || null,
      unit: "km",
      odometer: parsedOdometer,
      imageurl: null,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    router.back();
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 200,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: theme.colors.text,
              marginBottom: 16,
            }}
          >
            {t("addVehicle.title")}
          </Text>

          <CarvixInput
            label={t("addVehicle.make")}
            placeholder={t("addVehicle.makePlaceholder")}
            value={make}
            onChangeText={setMake}
          />

          <CarvixInput
            label={t("addVehicle.model")}
            placeholder={t("addVehicle.modelPlaceholder")}
            value={model}
            onChangeText={setModel}
          />

          <CarvixInput
            label={t("addVehicle.plate")}
            placeholder="BG-123-AB"
            value={plateNumber}
            onChangeText={setPlateNumber}
            autoCapitalize="characters"
          />

          <CarvixInput
            label={t("addVehicle.year")}
            placeholder="2016"
            keyboardType="numeric"
            value={year}
            onChangeText={setYear}
          />

          <CarvixInput
            label={t("addVehicle.odometer")}
            placeholder="150000"
            keyboardType="numeric"
            value={odometer}
            onChangeText={setOdometer}
          />

          <CarvixInput
            label={t("addVehicle.vin")}
            placeholder="WBA3D31020F123456"
            value={vin}
            onChangeText={setVin}
            autoCapitalize="characters"
          />

          <CarvixButton
            label={t("addVehicle.save")}
            onPress={handleSave}
            loading={loading}
            style={{ marginTop: 16 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
