import { CarvixButton } from "@/components/CarvixButton";
import { CarvixInput } from "@/components/CarvixInput";
import { Screen } from "@/components/Screen";
import { useAuth } from "@/context/AuthProvider";
import { useCarvixTheme } from "@/theme/ThemeProvider";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

export default function SignupScreen() {
  const { signUp } = useAuth();
  const { theme } = useCarvixTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError(null);
    setLoading(true);
    try {
      await signUp(email.trim(), password);

      Alert.alert(
        "Proveri email",
        "Poslali smo ti link za potvrdu naloga. Nakon potvrde, prijavi se sa svojim emailom i lozinkom."
      );

      router.replace("/(auth)/login");
    } catch (e: any) {
      setError(e.message ?? "Neuspela registracija.");
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
          Napravi nalog
        </Text>

        <Text
          style={{ color: theme.colors.textMuted }}
          className="font-inter text-base mb-8"
        >
          Samo par koraka i spreman si da vodiš evidenciju svojih vozila.
        </Text>

        {error && (
          <Text className="text-red-500 font-inter text-sm mb-4">{error}</Text>
        )}

        {/* EMAIL */}
        <CarvixInput
          label="Email"
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* PASSWORD */}
        <CarvixInput
          label="Lozinka"
          placeholder="••••••••"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
          onRightPress={() => setShowPassword(!showPassword)}
        />

        {/* CONFIRM PASSWORD */}
        <CarvixInput
          label="Potvrdi lozinku"
          placeholder="Ponovite lozinku"
          secureTextEntry={!showConfirmPassword}
          value={confirm}
          onChangeText={setConfirm}
          rightIcon={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
          onRightPress={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        {/* BUTTON */}
        <CarvixButton
          label="Registruj se"
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
            Već imaš nalog?{" "}
            <Text className="text-carvix-orange font-semibold">Prijavi se</Text>
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
