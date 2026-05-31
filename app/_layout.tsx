import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",          // todas as telas com fade
        animationDuration: 300,     // duração da transição em ms
        animationTypeForReplace: "push", // mantém animação mesmo ao substituir tela
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup/doador" />
      <Stack.Screen name="signup/orfanato" />
    </Stack>
  );
}
