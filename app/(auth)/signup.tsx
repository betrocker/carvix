import { CarvixButton } from "@/components/CarvixButton";
import { CarvixInput } from "@/components/CarvixInput";
import { Screen } from "@/components/Screen";
import { useAuth } from "@/context/AuthProvider";
import { useCarvixTheme } from "@/theme/ThemeProvider";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, Text, View } from "react-native";

export default function SignupScreen() {
  const { signUp } = useAuth();
  const { theme } = useCarvixTheme();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError(null);

    // lokalna provera lozinke
    if (password !== confirm) {
      setError(t("errors.passwordsDontMatch", "Lozinke se ne poklapaju."));
      return;
    }

    setLoading(true);
    try {
      await signUp(email.trim(), password);

      Alert.alert(
        t("dialogs.checkEmailTitle", "Proveri email"),
        t(
          "dialogs.checkEmailBody",
          "Poslali smo ti link za potvrdu naloga. Nakon potvrde, prijavi se sa svojim emailom i lozinkom."
        )
      );

      router.replace("/(auth)/login");
    } catch (e: any) {
      setError(
        e.message ?? t("errors.registerFailed", "Neuspela registracija.")
      );
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
          {t("auth.signupHeader", "Napravi nalog")}
        </Text>

        <Text
          style={{ color: theme.colors.mutedText ?? theme.colors.text }}
          className="font-inter text-base mb-8"
        >
          {t(
            "auth.signupSubtitle",
            "Samo par koraka i spreman si da vodiš evidenciju svojih vozila."
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

        {/* CONFIRM PASSWORD */}
        <CarvixInput
          label={t("auth.confirmPassword", "Potvrdi lozinku")}
          placeholder={t("auth.confirmPasswordPlaceholder", "Ponovite lozinku")}
          secureTextEntry={!showConfirmPassword}
          value={confirm}
          onChangeText={setConfirm}
          rightIcon={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
          onRightPress={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        {/* BUTTON */}
        <CarvixButton
          label={t("auth.signupButton", "Registruj se")}
          onPress={handleSignup}
          loading={loading}
          style={{ marginTop: 8 }}
        />

        {/* LINK TO LOGIN */}
        <Pressable
          onPress={() => router.push("/(auth)/login")}
          className="mt-8 items-center"
        >
          <Text
            style={{ color: theme.colors.text }}
            className="font-inter text-base"
          >
            {t("auth.haveAccount", "Već imaš nalog?")}{" "}
            <Text className="text-carvix-orange font-semibold">
              {t("auth.login", "Prijavi se")}
            </Text>
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
