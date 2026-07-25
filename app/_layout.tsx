import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAppInit } from "../store/useAppInit";
import { useTheme } from "../theme/useTheme";

export default function RootLayout() {
  const { ready } = useAppInit();
  const theme = useTheme();

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.background }}>
        <ActivityIndicator color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="transacao/nova" options={{ presentation: "modal" }} />
      </Stack>
      <StatusBar style={theme.dark ? "light" : "dark"} />
    </SafeAreaProvider>
  );
}
