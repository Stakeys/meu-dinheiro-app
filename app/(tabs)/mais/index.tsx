import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card } from "../../../components/Card";
import { IconBadge } from "../../../components/IconBadge";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { useTheme } from "../../../theme/useTheme";

const ITEMS: { href: string; label: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
  { href: "/(tabs)/mais/orcamento", label: "Orçamento", icon: "pie-chart", color: "#F59E0B" },
  { href: "/(tabs)/mais/investimentos", label: "Investimentos", icon: "trending-up", color: "#14B8A6" },
  { href: "/(tabs)/mais/relatorios", label: "Relatórios", icon: "bar-chart", color: "#3B82F6" },
  { href: "/(tabs)/mais/contas", label: "Contas", icon: "wallet", color: "#7C3AED" },
  { href: "/(tabs)/mais/configuracoes", label: "Configurações", icon: "settings", color: "#94A3B8" },
];

export default function MaisScreen() {
  const theme = useTheme();

  return (
    <ScreenContainer safeTop={false}>
      <Card padding={8}>
        {ITEMS.map((item, index) => (
          <TouchableOpacity
            key={item.href}
            onPress={() => router.push(item.href as any)}
            style={[
              styles.row,
              index < ITEMS.length - 1 ? { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.border } : null,
            ]}
          >
            <IconBadge name={item.icon} color={item.color} size={38} />
            <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
        ))}
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14, paddingHorizontal: 8 },
  label: { flex: 1, fontSize: 15, fontWeight: "600" },
});
