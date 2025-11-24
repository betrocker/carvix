import { CarvixButton } from "@/components/CarvixButton";
import { CarvixInput } from "@/components/CarvixInput";
import { Screen } from "@/components/Screen";
import { useAuth } from "@/context/AuthProvider";
import { useCarvixTheme } from "@/theme/ThemeProvider";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { theme } = useCarvixTheme();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace("/");
    } catch (e: any) {
      setError(e.message ?? t("errors.loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View className="flex-1 px-6 justify-center">
        {/* HEADER */}
        <Text
          style={{ color: theme.colors.text }}
          className="font-inter text-3xl font-semibold mb-2"
        >
          {t("auth.loginHeader", "Dobrodošao nazad")}
        </Text>

        <Text
          style={{ color: theme.colors.mutedText }}
          className="font-inter text-base mb-8"
        >
          {t(
            "auth.loginSubtitle",
            "Prijavi se da nastaviš sa Carvix Garage Managerom."
          )}
        </Text>

        {error && (
          <Text className="text-red-500 font-inter text-sm mb-4">{error}</Text>
        )}

        {/* EMAIL */}
        <CarvixInput
          label={t("auth.email", "Email")}
          placeholder={t("auth.emailPlaceholder", "you@example.com")}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* PASSWORD */}
        <CarvixInput
          label={t("auth.password", "Lozinka")}
          placeholder={t("auth.passwordPlaceholder", "••••••••")}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
          onRightPress={() => setShowPassword(!showPassword)}
        />

        {/* BUTTON */}
        <CarvixButton
          label={t("auth.loginButton", "Prijavi se")}
          onPress={handleLogin}
          loading={loading}
          style={{ marginTop: 8 }}
        />

        {/* LINK TO SIGNUP */}
        <Pressable
          onPress={() => router.push("/(auth)/signup")}
          className="mt-8 items-center"
        >
          <Text
            style={{ color: theme.colors.text }}
            className="font-inter text-base"
          >
            {t("auth.noAccount", "Nemaš nalog?")}{" "}
            <Text className="text-carvix-orange font-semibold">
              {t("auth.register", "Registruj se")}
            </Text>
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
