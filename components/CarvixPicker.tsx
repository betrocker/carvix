import { useCarvixTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { CarvixButton } from "./CarvixButton";

type PickerOption = {
  label: string;
  value: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

type CarvixPickerProps = {
  label: string;
  value: string;
  options: PickerOption[];
  onValueChange: (value: string) => void;
  placeholder?: string;
};

export function CarvixPicker({
  label,
  value,
  options,
  onValueChange,
  placeholder = "Izaberi opciju",
}: CarvixPickerProps) {
  const { theme } = useCarvixTheme();
  const [visible, setVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          color: theme.colors.text,
          marginBottom: 8,
        }}
      >
        {label}
      </Text>

      <CarvixButton
        label={selectedOption?.label || placeholder}
        onPress={() => setVisible(true)}
        icon={selectedOption?.icon}
      />

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
          onPress={() => setVisible(false)}
        >
          <Pressable
            style={{
              backgroundColor: theme.colors.background,
              borderRadius: 16,
              width: "100%",
              maxWidth: 400,
              maxHeight: "70%",
              overflow: "hidden",
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <View
              style={{
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: theme.colors.text,
                }}
              >
                {label}
              </Text>
            </View>

            <ScrollView
              style={{ maxHeight: 400 }}
              contentContainerStyle={{ padding: 8 }}
            >
              {options.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    onValueChange(option.value);
                    setVisible(false);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 16,
                    borderRadius: 12,
                    marginBottom: 4,
                    backgroundColor:
                      value === option.value
                        ? theme.colors.primary + "20"
                        : "transparent",
                  }}
                >
                  {option.icon && (
                    <Ionicons
                      name={option.icon}
                      size={24}
                      color={
                        value === option.value
                          ? theme.colors.primary
                          : theme.colors.text
                      }
                      style={{ marginRight: 12 }}
                    />
                  )}
                  <Text
                    style={{
                      fontSize: 16,
                      color:
                        value === option.value
                          ? theme.colors.primary
                          : theme.colors.text,
                      fontWeight: value === option.value ? "600" : "400",
                      flex: 1,
                    }}
                  >
                    {option.label}
                  </Text>
                  {value === option.value && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={theme.colors.primary}
                    />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
