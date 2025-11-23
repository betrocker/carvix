import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// Ako ti je ThemeProvider na drugoj putanji, prilagodi import
import { useCarvixTheme } from "@/theme/ThemeProvider";

// Možeš naknadno dotegnuti tip ako hoćeš, za sada any je najjednostavnije
type HeaderProps = any;

export function CarvixHeader({
  navigation,
  back,
  options,
  route,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const { theme, mode } = useCarvixTheme();

  const title =
    options.headerTitle && typeof options.headerTitle === "string"
      ? options.headerTitle
      : (options.title ?? route.name);

  const showShadow = options.headerShadowVisible ?? true;

  const tint: "light" | "dark" = mode === "dark" ? "dark" : "light";

  return (
    <BlurView
      intensity={Platform.OS === "ios" ? 30 : 20}
      tint={tint}
      style={{
        paddingTop: insets.top,
        borderBottomWidth: showShadow ? 0.5 : 0,
        borderBottomColor:
          mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)",
      }}
    >
      <View
        style={{
          height: 44,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        {/* Back dugme ili placeholder da naslov bude centriran */}
        {back ? (
          <Pressable
            onPress={navigation.goBack}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
            }}
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
          </Pressable>
        ) : (
          <View style={{ width: 32 }} />
        )}

        {/* Naslov */}
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: "Inter-Medium",
              fontSize: 17,
              color: theme.colors.text,
            }}
          >
            {title}
          </Text>
        </View>

        {/* headerRight ili placeholder */}
        <View style={{ width: 32, alignItems: "flex-end" }}>
          {options.headerRight
            ? options.headerRight({
                tintColor: theme.colors.text,
                pressColor: "rgba(0,0,0,0.1)",
              })
            : null}
        </View>
      </View>
    </BlurView>
  );
}
