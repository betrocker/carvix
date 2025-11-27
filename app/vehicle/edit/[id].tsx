import { CarvixButton } from "@/components/CarvixButton";
import { CarvixInput } from "@/components/CarvixInput";
import { CarvixPicker } from "@/components/CarvixPicker";
import { Screen } from "@/components/Screen";
import { supabase } from "@/lib/supabase";
import { useCarvixTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Pressable,
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
};

export default function EditVehicleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useCarvixTheme();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [vehicleType, setVehicleType] = useState("car");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [year, setYear] = useState("");
  const [odometer, setOdometer] = useState("");
  const [vin, setVin] = useState("");
  const [engineCapacity, setEngineCapacity] = useState("");
  const [loadCapacity, setLoadCapacity] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      // Popuni polja sa postojećim podacima
      setVehicleType(data.type || "car");
      setMake(data.make || "");
      setModel(data.model || "");
      setPlateNumber(data.platenumber || "");
      setYear(data.year?.toString() || "");
      setOdometer(data.odometer?.toString() || "");
      setVin(data.vin || "");
      setEngineCapacity(data.enginecapacity || "");
      setLoadCapacity(data.loadcapacity || "");
      setExistingImageUrl(data.imageurl || null);
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      Alert.alert(t("editVehicle.error"), t("editVehicle.errorLoading"));
    } finally {
      setLoading(false);
    }
  };

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

  const requiresPlate = !["bicycle"].includes(vehicleType);
  const requiresVin = ["car", "truck", "motorcycle", "quad"].includes(
    vehicleType
  );
  const showEngineCapacity = ["motorcycle", "quad"].includes(vehicleType);
  const showLoadCapacity = ["truck", "tractor"].includes(vehicleType);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        t("editVehicle.permissionTitle"),
        t("editVehicle.permissionMessage")
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string, userId: string): Promise<string> => {
    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();
    const fileExt = uri.split(".").pop();
    const fileName = `${userId}/${id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("vehicle-images")
      .upload(fileName, arrayBuffer, {
        contentType: `image/${fileExt}`,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("vehicle-images").getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSave = async () => {
    // Validacija
    if (!make || !model) {
      Alert.alert(
        t("editVehicle.validationTitle"),
        t("editVehicle.validationBasic")
      );
      return;
    }

    if (requiresPlate && !plateNumber) {
      Alert.alert(
        t("editVehicle.validationTitle"),
        t("editVehicle.validationPlate")
      );
      return;
    }

    try {
      setSaving(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      let uploadedImageUrl = existingImageUrl;

      // Upload nove slike ako je izabrana
      if (imageUri) {
        uploadedImageUrl = await uploadImage(imageUri, user.id);

        // Obriši staru sliku iz storage-a
        if (existingImageUrl) {
          const oldFileName = existingImageUrl.split("/").pop();
          if (oldFileName) {
            await supabase.storage
              .from("vehicle-images")
              .remove([`${user.id}/${oldFileName}`]);
          }
        }
      }

      const updateData: any = {
        type: vehicleType,
        name: `${make} ${model}`,
        make,
        model,
        platenumber: requiresPlate ? plateNumber : null,
        year: year ? parseInt(year) : null,
        odometer: odometer ? parseInt(odometer) : null,
        vin: requiresVin && vin ? vin : null,
        enginecapacity:
          showEngineCapacity && engineCapacity ? engineCapacity : null,
        loadcapacity: showLoadCapacity && loadCapacity ? loadCapacity : null,
        imageurl: uploadedImageUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("vehicles")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      // Vrati se nazad bez alert-a
      router.back();
    } catch (error) {
      console.error("Error updating vehicle:", error);
      Alert.alert(t("editVehicle.error"), t("editVehicle.errorSaving"));
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
          {t("editVehicle.title")}
        </Text>

        {/* Slika */}
        <Pressable
          onPress={pickImage}
          style={{
            width: "100%",
            height: 200,
            borderRadius: 12,
            backgroundColor: theme.colors.card,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
            overflow: "hidden",
          }}
        >
          {imageUri || existingImageUrl ? (
            <Image
              source={{ uri: imageUri || existingImageUrl! }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          ) : (
            <Ionicons name="camera" size={48} color={theme.colors.mutedText} />
          )}
          <View
            style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              backgroundColor: theme.colors.primary,
              borderRadius: 20,
              padding: 8,
            }}
          >
            <Ionicons name="camera" size={20} color="#fff" />
          </View>
        </Pressable>

        {/* Tip vozila */}
        <CarvixPicker
          label={t("editVehicle.vehicleType")}
          value={vehicleType}
          options={vehicleTypes}
          onValueChange={setVehicleType}
          placeholder={t("editVehicle.selectVehicleType")}
        />

        {/* Osnovna polja */}
        <CarvixInput
          label={t("editVehicle.make")}
          placeholder={t("editVehicle.makePlaceholder")}
          value={make}
          onChangeText={setMake}
        />

        <CarvixInput
          label={t("editVehicle.model")}
          placeholder={t("editVehicle.modelPlaceholder")}
          value={model}
          onChangeText={setModel}
        />

        {requiresPlate && (
          <CarvixInput
            label={t("editVehicle.plate")}
            placeholder="BG-123-AB"
            value={plateNumber}
            onChangeText={setPlateNumber}
            autoCapitalize="characters"
          />
        )}

        <CarvixInput
          label={t("editVehicle.year")}
          placeholder="2020"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
        />

        <CarvixInput
          label={t("editVehicle.odometer")}
          placeholder="50000"
          value={odometer}
          onChangeText={setOdometer}
          keyboardType="numeric"
        />

        {requiresVin && (
          <CarvixInput
            label={t("editVehicle.vin")}
            placeholder="WVWZZZ3CZBE123456"
            value={vin}
            onChangeText={setVin}
            autoCapitalize="characters"
          />
        )}

        {showEngineCapacity && (
          <CarvixInput
            label={t("editVehicle.engineCapacity")}
            placeholder="600cc"
            value={engineCapacity}
            onChangeText={setEngineCapacity}
          />
        )}

        {showLoadCapacity && (
          <CarvixInput
            label={t("editVehicle.loadCapacity")}
            placeholder="5000kg"
            value={loadCapacity}
            onChangeText={setLoadCapacity}
          />
        )}

        {/* Action buttons */}
        <View style={{ marginTop: 24, gap: 12, marginBottom: 20 }}>
          <CarvixButton
            label={t("editVehicle.save")}
            onPress={handleSave}
            loading={saving}
            icon="checkmark-circle-outline"
          />
          <CarvixButton
            label={t("editVehicle.cancel")}
            onPress={() => router.back()}
            variant="outline"
            icon="close-circle-outline"
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
