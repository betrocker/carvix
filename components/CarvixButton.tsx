import { useCarvixTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

type CarvixButtonProps = {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  iconSize?: number;
};

export function CarvixButton({
  label,
  onPress,
  loading,
  disabled,
  variant = "primary",
  style,
  textStyle,
  icon,
  iconPosition = "left",
  iconSize = 20,
}: CarvixButtonProps) {
  const { theme } = useCarvixTheme();

  const bg =
    variant === "primary"
      ? theme.colors.primary
      : variant === "secondary"
        ? theme.colors.card
        : "transparent";

  const color = variant === "primary" ? "#ffffff" : theme.colors.text;

  const border =
    variant === "outline"
      ? { borderWidth: 1, borderColor: theme.colors.mutedText }
      : {};

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator color={color} />;
    }

    if (icon) {
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          {iconPosition === "left" && (
            <Ionicons name={icon} size={iconSize} color={color} />
          )}
          <Text
            className="font-inter text-base font-semibold"
            style={[{ color }, textStyle]}
          >
            {label}
          </Text>
          {iconPosition === "right" && (
            <Ionicons name={icon} size={iconSize} color={color} />
          )}
        </View>
      );
    }

    return (
      <Text
        className="font-inter text-base font-semibold"
        style={[{ color }, textStyle]}
      >
        {label}
      </Text>
    );
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className="rounded-3xl py-4 items-center mt-2"
      style={[
        {
          backgroundColor: bg,
          opacity: disabled ? 0.6 : 1,
          shadowColor:
            variant === "primary" ? theme.colors.accent : "#00000000",
          shadowOpacity: variant === "primary" ? 0.25 : 0,
          shadowOffset: { width: 0, height: 6 },
          shadowRadius: 12,
        },
        border,
        style,
      ]}
    >
      {renderContent()}
    </Pressable>
  );
}
