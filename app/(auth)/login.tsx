import { CarvixButton } from "@/components/CarvixButton";
import { CarvixInput } from "@/components/CarvixInput";
import { Screen } from "@/components/Screen";
import { useAuth } from "@/context/AuthProvider";
import { useCarvixTheme } from "@/theme/ThemeProvider";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { theme } = useCarvixTheme();

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
      setError(e.message ?? "Neuspela prijava.");
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
          Dobrodošao nazad
        </Text>

        <Text
          style={{ color: theme.colors.mutedText }}
          className="font-inter text-base mb-8"
        >
          Prijavi se da nastaviš sa Carvix Garage Managerom.
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

        {/* BUTTON */}
        <CarvixButton
          label="Prijavi se"
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
            Nemaš nalog?{" "}
            <Text className="text-carvix-orange font-semibold">
              Registruj se
            </Text>
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
