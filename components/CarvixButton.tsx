import { useCarvixTheme } from "@/theme/ThemeProvider";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextStyle,
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
};

export function CarvixButton({
  label,
  onPress,
  loading,
  disabled,
  variant = "primary",
  style,
  textStyle,
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
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <Text
          className="font-inter text-base font-semibold"
          style={[{ color }, textStyle]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
