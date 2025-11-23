import { useCarvixTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";

type CarvixInputProps = TextInputProps & {
  label?: string;
  error?: string | null;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
};

export function CarvixInput({
  label,
  error,
  rightIcon,
  leftIcon,
  onRightPress,
  style,
  ...props
}: CarvixInputProps) {
  const { theme } = useCarvixTheme();

  return (
    <View className="mb-5">
      {label && (
        <Text
          className="font-inter text-sm mb-2"
          style={{ color: theme.colors.text }}
        >
          {label}
        </Text>
      )}

      <View
        style={{
          backgroundColor: theme.colors.card,
        }}
        className="rounded-3xl px-4 py-4 flex-row items-center shadow-sm"
      >
        {/* LEFT ICON */}
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={theme.colors.textMuted}
            style={{ marginRight: 10 }}
          />
        )}

        {/* INPUT */}
        <TextInput
          {...props}
          style={[
            {
              flex: 1,
              color: theme.colors.text,
              fontSize: 16,
            },
            style,
          ]}
          placeholderTextColor={theme.colors.textMuted}
        />

        {/* RIGHT ICON */}
        {rightIcon && (
          <Pressable onPress={onRightPress}>
            <Ionicons
              name={rightIcon}
              size={20}
              color={theme.colors.textMuted}
            />
          </Pressable>
        )}
      </View>

      {error && (
        <Text className="text-red-500 mt-1 font-inter text-xs">{error}</Text>
      )}
    </View>
  );
}
