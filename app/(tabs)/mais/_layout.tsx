import { Stack } from "expo-router";
import { useTheme } from "../../../theme/useTheme";

export default function MaisLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.textPrimary,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Mais" }} />
      <Stack.Screen name="orcamento" options={{ title: "Orçamento" }} />
      <Stack.Screen name="investimentos" options={{ title: "Investimentos" }} />
      <Stack.Screen name="relatorios" options={{ title: "Relatórios" }} />
      <Stack.Screen name="contas" options={{ title: "Contas" }} />
      <Stack.Screen name="configuracoes" options={{ title: "Configurações" }} />
    </Stack>
  );
}
