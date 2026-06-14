import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          animationDuration: 300,
          animationTypeForReplace: "push",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup/doador" />
        <Stack.Screen name="signup/orfanato" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}