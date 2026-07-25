import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../theme/useTheme";

type Props = {
  onRetry: () => void;
};

export function AppLockScreen({ onRetry }: Props) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.iconWrap, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.accent }]}>
        <Ionicons name="lock-closed" size={32} color={theme.colors.accent} />
      </View>
      <Text style={[styles.title, { color: theme.colors.textPrimary, fontWeight: theme.headingWeight }]}>
        MeuDinheiro está bloqueado
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Use o código do aparelho (ou Face ID/Touch ID, quando disponível) para continuar.
      </Text>
      <TouchableOpacity
        onPress={onRetry}
        style={[styles.button, { backgroundColor: theme.colors.accent, borderRadius: theme.radius.md }]}
      >
        <Text style={styles.buttonText}>Desbloquear</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 12 },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: { fontSize: 18, textAlign: "center" },
  subtitle: { fontSize: 13, textAlign: "center", marginBottom: 16 },
  button: { paddingHorizontal: 28, paddingVertical: 14 },
  buttonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});
