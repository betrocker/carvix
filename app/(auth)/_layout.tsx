// app/(auth)/_layout.tsx
import { useAuth } from "@/context/AuthProvider";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    // možeš ovde da vratiš neki splash / spinner
    return null;
  }

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
