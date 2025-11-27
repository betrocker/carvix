// app/(tabs)/settings.tsx
import { Screen } from "@/components/Screen";
import { useAuth } from "@/context/AuthProvider";
import { useCurrency } from "@/context/CurrencyProvider";
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

import { useLanguage } from "@/context/LanguageProvider";
import type { LanguageCode } from "@/i18n";
import { useTranslation } from "react-i18next";

export default function SettingsScreen() {
  const { theme, mode, toggleMode } = useCarvixTheme();
  const { user, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const { currency, setCurrency } = useCurrency();

  const [premiumVisible, setPremiumVisible] = useState(false);

  const isDark = mode === "dark";

  const appVersion =
    Constants.expoConfig?.version ??
    Constants.manifest2?.extra?.version ??
    "1.0.0";

  const buildNumber =
    (Constants.expoConfig as any)?.android?.versionCode?.toString() ??
    (Constants.expoConfig as any)?.ios?.buildNumber ??
    "1";

  const userEmail = user?.email ?? "Unknown user";

  const handleDeleteAccount = () => {
    if (!user) return;

    Alert.alert(
      t("dialogs.deleteAccountTitle"),
      t("dialogs.deleteAccountBody"),
      [
        { text: t("dialogs.cancel"), style: "cancel" },
        {
          text: t("dialogs.delete"),
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
                  t("dialogs.error"),
                  error.message || t("dialogs.failedDeleteAccount")
                );
                return;
              }

              await signOut();
            } catch (e: any) {
              console.log("delete-account exception:", e);
              Alert.alert(
                t("dialogs.error"),
                e?.message ?? t("dialogs.unexpectedError")
              );
            }
          },
        },
      ]
    );
  };

  const handleToggleLanguage = (code: LanguageCode) => {
    void setLanguage(code);
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
          {t("settings.title")}
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
            label={t("settings.appearance")}
            themeTextColor={theme.colors.mutedText}
          />

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
                {t("settings.darkModeTitle")}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: 2,
                  color: theme.colors.mutedText,
                }}
              >
                {isDark
                  ? t("settings.darkModeEnabled")
                  : t("settings.darkModeDisabled")}
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
            label={t("settings.language")}
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
                {t("settings.appLanguage")}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: 2,
                  color: theme.colors.mutedText,
                }}
              >
                {language === "en"
                  ? t("settings.english")
                  : t("settings.serbian")}
              </Text>
            </View>

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

        {/* CURRENCY SECTION */}
        <View
          style={{
            borderRadius: 16,
            backgroundColor: theme.colors.card,
            paddingHorizontal: 12,
            paddingVertical: 4,
          }}
        >
          <SectionLabel
            label={t("settings.currency", "Valuta")}
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
                {t("settings.preferredCurrency", "Preferirana valuta")}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: 2,
                  color: theme.colors.mutedText,
                }}
              >
                {t(
                  "settings.currencyDescription",
                  "Troškovi će biti konvertovani"
                )}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                borderRadius: 999,
                borderWidth: 1,
                borderColor: theme.colors.mutedText,
                overflow: "hidden",
              }}
            >
              <CurrencyPill
                label="RSD"
                active={currency === "RSD"}
                onPress={() => setCurrency("RSD")}
                primaryColor={theme.colors.primary}
                bgColor={theme.colors.card}
                textColor={theme.colors.text}
              />
              <CurrencyPill
                label="EUR"
                active={currency === "EUR"}
                onPress={() => setCurrency("EUR")}
                primaryColor={theme.colors.primary}
                bgColor={theme.colors.card}
                textColor={theme.colors.text}
              />
              <CurrencyPill
                label="USD"
                active={currency === "USD"}
                onPress={() => setCurrency("USD")}
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
            label={t("settings.account")}
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
                {t("settings.signedInAs")}
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
                {t("settings.logoutTitle")}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: 2,
                  color: theme.colors.mutedText,
                }}
              >
                {t("settings.logoutSubtitle")}
              </Text>
            </View>
          </Pressable>

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
                  color: theme.colors.danger,
                }}
              >
                {t("settings.deleteTitle")}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: 2,
                  color: theme.colors.mutedText,
                }}
              >
                {t("settings.deleteSubtitle")}
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
            label={t("settings.premiumSection")}
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
                {t("settings.premiumTitle")}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: 2,
                  color: theme.colors.mutedText,
                }}
              >
                {t("settings.premiumSubtitle")}
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
          <SectionLabel
            label={t("settings.about")}
            themeTextColor={theme.colors.mutedText}
          />

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
              {t("settings.versionLabel")}
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
              {t("settings.madeFor")}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.text,
              }}
            >
              {t("common.appName")}
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
              {t("settings.premiumTitle")}
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: theme.colors.mutedText,
                marginBottom: 16,
              }}
            >
              {t("settings.premiumSubtitle")}
            </Text>

            <View style={{ gap: 8, marginBottom: 20 }}>
              <Bullet
                text={t("settings.premiumBullet1")}
                color={theme.colors.text}
              />
              <Bullet
                text={t("settings.premiumBullet2")}
                color={theme.colors.text}
              />
              <Bullet
                text={t("settings.premiumBullet3")}
                color={theme.colors.text}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
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
                {t("settings.premiumUpgrade")}
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
                {t("settings.premiumLater")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

function CurrencyPill({
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
