// components/CarvixTabBar.tsx
import { useCarvixTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function CarvixTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { theme, mode } = useCarvixTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const barBackground = mode === "light" ? "#F3F4F6" : theme.colors.card;
  const barBorderColor =
    mode === "light" ? "rgba(15,23,42,0.06)" : "rgba(15,23,42,0.4)";

  const activeColor = theme.colors.primary;
  const inactiveColor = theme.colors.mutedText;

  const pillColor =
    mode === "light" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.16)";

  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const tabCount = state.routes.length;

  const handleRowLayout = (e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    setContainerWidth(width);
  };

  useEffect(() => {
    if (!containerWidth || tabCount === 0) return;

    const segmentWidth = containerWidth / tabCount;
    const pillWidth = segmentWidth * 1.1;
    const offset = (segmentWidth - pillWidth) / 2;
    const targetX = state.index * segmentWidth + offset;

    Animated.spring(translateX, {
      toValue: targetX,
      useNativeDriver: false,
      friction: 10,
      tension: 140,
    }).start();
  }, [state.index, containerWidth, tabCount, translateX]);

  const segmentWidth = containerWidth / (tabCount || 1);
  const pillWidth = segmentWidth * 1.1;

  return (
    <View
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: insets.bottom + 12,
      }}
      pointerEvents="box-none"
    >
      <View
        style={{
          borderRadius: 999,
          backgroundColor: barBackground,
          paddingHorizontal: 10,
          paddingVertical: 14, // veći bar po visini
          borderWidth: 1,
          borderColor: barBorderColor,
          shadowColor: "#000",
          shadowOpacity: mode === "light" ? 0.12 : 0.3,
          shadowOffset: { width: 0, height: 8 },
          shadowRadius: 16,
          elevation: 10,
        }}
      >
        {/* SLIDING PILLA – SADA RELATIVNO NA CEO BAR */}
        {containerWidth > 0 && (
          <Animated.View
            style={{
              position: "absolute",
              left: 10, // isti padding kao container
              top: 6, // više prostora gore/dole
              bottom: 6,
              borderRadius: 999,
              backgroundColor: pillColor,
              transform: [{ translateX }],
              width: pillWidth,
            }}
          />
        )}

        {/* ROW SA TABOVIMA */}
        <View
          onLayout={handleRowLayout}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            let labelKey = "";

            switch (route.name) {
              case "index":
                labelKey = "tabs.home";
                break;
              case "garage":
                labelKey = "tabs.garage";
                break;
              case "stats":
                labelKey = "tabs.stats";
                break;
              case "settings":
                labelKey = "tabs.settings";
                break;
              default:
                labelKey = "";
            }

            const label = labelKey ? t(labelKey) : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            const iconName = getIconName(route.name, isFocused);

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{
                  width: segmentWidth || undefined,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 4,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name={iconName}
                    size={20}
                    color={isFocused ? activeColor : inactiveColor}
                    style={{ marginRight: isFocused ? 4 : 0 }}
                  />
                  {isFocused && (
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "600",
                        color: activeColor,
                      }}
                      numberOfLines={1}
                    >
                      {label as string}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function getIconName(
  routeName: string,
  focused: boolean
): keyof typeof Ionicons.glyphMap {
  switch (routeName) {
    case "index":
      return focused ? "speedometer" : "speedometer-outline";
    case "garage":
      return focused ? "car-sport" : "car-sport-outline";
    case "stats":
      return focused ? "stats-chart" : "stats-chart-outline";
    case "settings":
      return focused ? "settings" : "settings-outline";
    default:
      return focused ? "ellipse" : "ellipse-outline";
  }
}
