// app/(tabs)/settings.tsx
import { Screen } from "@/components/Screen";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useCarvixTheme } from "@/theme/ThemeProvider";
import Constants from "expo-constants";

import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type LanguageCode = "en" | "sr";

export default function SettingsScreen() {
  const { theme, mode, toggleMode } = useCarvixTheme();
  const { user, signOut } = useAuth();

  const [language, setLanguage] = useState<LanguageCode>("en");
  const [premiumVisible, setPremiumVisible] = useState(false);

  const isDark = mode === "dark";

  const appVersion =
    Constants.expoConfig?.version ??
    Constants.manifest2?.extra?.version ??
    "1.0.0";

  const buildNumber =
    // Android / iOS build (ako nema, fallback)
    (Constants.expoConfig as any)?.android?.versionCode?.toString() ??
    (Constants.expoConfig as any)?.ios?.buildNumber ??
    "1";

  // TODO: Ovde kasnije ubaciš pravog user-a iz Auth context-a
  const userEmail = user?.email ?? "Unknown user";

  const handleLogout = () => {
    // TODO: zameni ovim tvojim logout-om (Clerk / Supabase / custom)
    console.log("Logout pressed");
  };

  const handleDeleteAccount = () => {
    if (!user) return;

    Alert.alert(
      "Delete account",
      "This will permanently delete your account and all your garage data.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { data, error } = await supabase.functions.invoke(
                "delete-account",
                {
                  body: { userId: user.id },
                }
              );

              console.log("delete-account result:", { data, error });

              if (error) {
                Alert.alert(
                  "Error",
                  error.message || "Failed to delete account."
                );
                return;
              }

              await signOut();
            } catch (e: any) {
              console.log("delete-account exception:", e);
              Alert.alert("Error", e?.message ?? "Unexpected error occurred.");
            }
          },
        },
      ]
    );
  };

  const handleToggleLanguage = (code: LanguageCode) => {
    setLanguage(code);
    // TODO: kada ubaciš i18n, ovde pozovi i18n.changeLanguage(code)
  };

  return (
    <Screen>
      <View style={{ flex: 1, padding: 16, gap: 16 }}>
        {/* Title */}
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: theme.colors.text,
          }}
        >
          Settings
        </Text>

        {/* APPEARANCE SECTION */}
        <View
          style={{
            borderRadius: 16,
            backgroundColor: theme.colors.card,
            paddingHorizontal: 12,
            paddingVertical: 4,
          }}
        >
          <SectionLabel
            label="Appearance"
            themeTextColor={theme.colors.mutedText}
          />

          {/* Dark mode row */}
          <Pressable
            onPress={toggleMode}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: theme.colors.text,
                }}
              >
                Dark Mode
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: 2,
                  color: theme.colors.mutedText,
                }}
              >
                {isDark ? "Enabled" : "Disabled"}
              </Text>
            </View>

            <Switch
              value={isDark}
              onValueChange={toggleMode}
              trackColor={{
                false: "rgba(120,120,120,0.4)",
                true: theme.colors.primary,
              }}
              thumbColor={"#fff"}
            />
          </Pressable>
        </View>

        {/* LANGUAGE SECTION */}
        <View
          style={{
            borderRadius: 16,
            backgroundColor: theme.colors.card,
            paddingHorizontal: 12,
            paddingVertical: 4,
          }}
        >
          <SectionLabel
            label="Language"
            themeTextColor={theme.colors.mutedText}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: theme.colors.text,
                }}
              >
                App Language
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: 2,
                  color: theme.colors.mutedText,
                }}
              >
                {language === "en" ? "English" : "Srpski"}
              </Text>
            </View>

            {/* iOS-like segmented toggle */}
            <View
              style={{
                flexDirection: "row",
                borderRadius: 999,
                borderWidth: 1,
                borderColor: theme.colors.mutedText,
                overflow: "hidden",
              }}
            >
              <LangPill
                label="EN"
                active={language === "en"}
                onPress={() => handleToggleLanguage("en")}
                primaryColor={theme.colors.primary}
                bgColor={theme.colors.card}
                textColor={theme.colors.text}
              />
              <LangPill
                label="SR"
                active={language === "sr"}
                onPress={() => handleToggleLanguage("sr")}
                primaryColor={theme.colors.primary}
                bgColor={theme.colors.card}
                textColor={theme.colors.text}
              />
            </View>
          </View>
        </View>

        {/* ACCOUNT SECTION */}
        <View
          style={{
            borderRadius: 16,
            backgroundColor: theme.colors.card,
            paddingHorizontal: 12,
            paddingVertical: 4,
          }}
        >
          <SectionLabel
            label="Account"
            themeTextColor={theme.colors.mutedText}
          />

          {/* Email */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: theme.colors.text,
                }}
              >
                Signed in as
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: 2,
                  color: theme.colors.mutedText,
                }}
              >
                {userEmail}
              </Text>
            </View>
          </View>

          {/* Logout */}
          <Pressable
            onPress={signOut}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: theme.colors.text,
                }}
              >
                Log out
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: 2,
                  color: theme.colors.mutedText,
                }}
              >
                You will need to sign in again
              </Text>
            </View>
          </Pressable>

          {/* Delete account */}
          <Pressable
            onPress={handleDeleteAccount}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: theme.colors.danger, // npr. CarvixColors.errorRed
                }}
              >
                Delete account
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: 2,
                  color: theme.colors.mutedText,
                }}
              >
                This will permanently remove your data
              </Text>
            </View>
          </Pressable>
        </View>

        {/* PREMIUM SECTION */}
        <View
          style={{
            borderRadius: 16,
            backgroundColor: theme.colors.card,
            paddingHorizontal: 12,
            paddingVertical: 4,
          }}
        >
          <SectionLabel
            label="Carvix Premium"
            themeTextColor={theme.colors.mutedText}
          />

          <Pressable
            onPress={() => setPremiumVisible(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: theme.colors.text,
                }}
              >
                View benefits
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: 2,
                  color: theme.colors.mutedText,
                }}
              >
                Advanced stats, unlimited vehicles, export & more
              </Text>
            </View>
          </Pressable>
        </View>

        {/* APP INFO SECTION */}
        <View
          style={{
            borderRadius: 16,
            backgroundColor: theme.colors.card,
            paddingHorizontal: 12,
            paddingVertical: 4,
          }}
        >
          <SectionLabel label="About" themeTextColor={theme.colors.mutedText} />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                flex: 1,
                fontSize: 14,
                color: theme.colors.mutedText,
              }}
            >
              Version
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.text,
              }}
            >
              {appVersion} ({buildNumber})
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 6,
            }}
          >
            <Text
              style={{
                flex: 1,
                fontSize: 14,
                color: theme.colors.mutedText,
              }}
            >
              Made for
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.text,
              }}
            >
              Carvix Garage Manager
            </Text>
          </View>
        </View>
      </View>

      {/* Premium modal */}
      <Modal
        transparent
        visible={premiumVisible}
        animationType="slide"
        onRequestClose={() => setPremiumVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.card,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
              paddingBottom: 32,
            }}
          >
            <View
              style={{
                height: 4,
                width: 40,
                borderRadius: 999,
                alignSelf: "center",
                marginBottom: 12,
                backgroundColor: theme.colors.mutedText,
              }}
            />

            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: theme.colors.text,
                marginBottom: 8,
              }}
            >
              Carvix Premium
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: theme.colors.mutedText,
                marginBottom: 16,
              }}
            >
              Unlock advanced analytics, export reports, and manage an unlimited
              number of vehicles in your garage.
            </Text>

            <View style={{ gap: 8, marginBottom: 20 }}>
              <Bullet
                text="Unlimited vehicles and service history"
                color={theme.colors.text}
              />
              <Bullet
                text="Advanced cost & service analytics"
                color={theme.colors.text}
              />
              <Bullet
                text="Export to PDF/CSV (coming soon)"
                color={theme.colors.text}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                // TODO: ovde će ići RevenueCat / kupovina
                console.log("Upgrade to Premium");
              }}
              style={{
                backgroundColor: theme.colors.primary,
                borderRadius: 999,
                paddingVertical: 12,
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#fff",
                }}
              >
                Upgrade (placeholder)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPremiumVisible(false)}
              style={{
                borderRadius: 999,
                paddingVertical: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: theme.colors.mutedText,
                }}
              >
                Maybe later
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

function SectionLabel({
  label,
  themeTextColor,
}: {
  label: string;
  themeTextColor: string;
}) {
  return (
    <Text
      style={{
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: 0.8,
        color: themeTextColor,
        marginTop: 4,
        marginBottom: 2,
      }}
    >
      {label}
    </Text>
  );
}

function LangPill({
  label,
  active,
  onPress,
  primaryColor,
  bgColor,
  textColor,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  primaryColor: string;
  bgColor: string;
  textColor: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: active ? primaryColor : bgColor,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "600",
          color: active ? "#fff" : textColor,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function Bullet({ text, color }: { text: string; color: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 6 }}>
      <Text
        style={{
          marginTop: 2,
          color,
        }}
      >
        •
      </Text>
      <Text
        style={{
          flex: 1,
          fontSize: 14,
          color,
        }}
      >
        {text}
      </Text>
    </View>
  );
}
