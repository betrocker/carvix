import { CarvixButton } from "@/components/CarvixButton";
import { CarvixInput } from "@/components/CarvixInput";
import { CarvixPicker } from "@/components/CarvixPicker";
import { Screen } from "@/components/Screen";
import { supabase } from "@/lib/supabase";
import { useCarvixTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function AddVehicleScreen() {
  const { theme } = useCarvixTheme();
  const { t } = useTranslation();

  const vehicleTypes = [
    { label: t("vehicleTypes.car"), value: "car", icon: "car" as const },
    {
      label: t("vehicleTypes.motorcycle"),
      value: "motorcycle",
      icon: "bicycle" as const,
    },
    { label: t("vehicleTypes.truck"), value: "truck", icon: "bus" as const },
    {
      label: t("vehicleTypes.bicycle"),
      value: "bicycle",
      icon: "bicycle-outline" as const,
    },
    {
      label: t("vehicleTypes.quad"),
      value: "quad",
      icon: "car-sport" as const,
    },
    {
      label: t("vehicleTypes.tractor"),
      value: "tractor",
      icon: "trail-sign" as const,
    },
  ];

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUserId(data.user.id);
    };
    fetchUser();
  }, []);

  const [vehicleType, setVehicleType] = useState("car");

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [year, setYear] = useState("");
  const [odometer, setOdometer] = useState("");
  const [vin, setVin] = useState("");

  const [loadCapacity, setLoadCapacity] = useState("");
  const [engineCapacity, setEngineCapacity] = useState("");

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requiresPlate = !["bicycle"].includes(vehicleType);
  const requiresVin = ["car", "truck", "motorcycle", "quad"].includes(
    vehicleType
  );

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        t("addVehicle.permissionTitle"),
        t("addVehicle.permissionMessage")
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string, vehicleId: string) => {
    try {
      const fileExt = uri.split(".").pop() || "jpg";
      const fileName = `${vehicleId}-${Date.now()}.${fileExt}`;

      // Koristi ArrayBuffer umesto blob-a
      const response = await fetch(uri);
      const arrayBuffer = await response.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from("vehicle-images")
        .upload(fileName, arrayBuffer, {
          contentType: `image/${fileExt}`,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("vehicle-images")
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error: any) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!make || !model) {
      Alert.alert(
        t("addVehicle.validationTitle"),
        t("addVehicle.validationBasic")
      );
      return;
    }

    if (requiresPlate && !plateNumber) {
      Alert.alert(
        t("addVehicle.validationTitle"),
        t("addVehicle.validationPlate")
      );
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    const parsedYear = year ? Number(year) : null;
    const parsedOdometer = odometer ? Number(odometer) : null;

    const name =
      `${make} ${model}`.trim() || plateNumber || t("addVehicle.defaultName");

    setLoading(true);

    try {
      const insertData: any = {
        userid: userId,
        orgid: null,
        type: vehicleType,
        name,
        make,
        model,
        year: parsedYear,
        platenumber: plateNumber || null,
        vin: vin || null,
        unit: "km",
        odometer: parsedOdometer,
        imageurl: null,
      };

      if (vehicleType === "truck" || vehicleType === "tractor") {
        insertData.loadcapacity = loadCapacity || null;
      }
      if (vehicleType === "motorcycle" || vehicleType === "quad") {
        insertData.enginecapacity = engineCapacity || null;
      }

      const { data, error } = await supabase
        .from("vehicles")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      // Upload image if selected
      if (imageUri && data) {
        const publicUrl = await uploadImage(imageUri, data.id);

        await supabase
          .from("vehicles")
          .update({ imageurl: publicUrl })
          .eq("id", data.id);
      }

      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
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

          {/* IMAGE PICKER */}
          <Pressable
            onPress={pickImage}
            style={{
              marginBottom: 16,
              borderRadius: 12,
              borderWidth: 2,
              borderStyle: "dashed",
              borderColor: theme.colors.border,
              overflow: "hidden",
              backgroundColor: theme.colors.card,
            }}
          >
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={{ width: "100%", height: 200 }}
                resizeMode="cover"
              />
            ) : (
              <View style={{ padding: 40, alignItems: "center" }}>
                <Ionicons
                  name="image-outline"
                  size={48}
                  color={theme.colors.mutedText}
                />
                <Text
                  style={{
                    color: theme.colors.mutedText,
                    marginTop: 8,
                    fontSize: 16,
                  }}
                >
                  {t("addVehicle.addImage")}
                </Text>
              </View>
            )}
          </Pressable>

          <CarvixPicker
            label={t("addVehicle.vehicleType")}
            value={vehicleType}
            options={vehicleTypes}
            onValueChange={setVehicleType}
            placeholder={t("addVehicle.selectVehicleType")}
          />

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

          {requiresPlate && (
            <CarvixInput
              label={t("addVehicle.plate")}
              placeholder="BG-123-AB"
              value={plateNumber}
              onChangeText={setPlateNumber}
              autoCapitalize="characters"
            />
          )}

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

          {requiresVin && (
            <CarvixInput
              label={t("addVehicle.vin")}
              placeholder="WBA3D31020F123456"
              value={vin}
              onChangeText={setVin}
              autoCapitalize="characters"
            />
          )}

          {(vehicleType === "truck" || vehicleType === "tractor") && (
            <CarvixInput
              label={t("addVehicle.loadCapacity")}
              placeholder="5000kg"
              value={loadCapacity}
              onChangeText={setLoadCapacity}
            />
          )}

          {(vehicleType === "motorcycle" || vehicleType === "quad") && (
            <CarvixInput
              label={t("addVehicle.engineCapacity")}
              placeholder="600cc"
              value={engineCapacity}
              onChangeText={setEngineCapacity}
            />
          )}

          <View style={{ marginTop: 16, gap: 12 }}>
            <CarvixButton
              label={t("addVehicle.save")}
              onPress={handleSave}
              loading={loading}
            />

            <CarvixButton
              label={t("addVehicle.cancel")}
              onPress={() => router.back()}
              loading={loading}
              variant="secondary"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
