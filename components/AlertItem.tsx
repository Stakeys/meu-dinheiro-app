import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/useTheme";
import { IconBadge } from "./IconBadge";

type Props = {
  title: string;
  message: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

export function AlertItem({ title, message, icon, color }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <IconBadge name={icon} color={color} size={36} />
      <View style={styles.info}>
        <Text style={[styles.title, { color }]}>{title}</Text>
        <Text style={[styles.message, { color: theme.colors.textSecondary }]}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12, paddingVertical: 10, alignItems: "flex-start" },
  info: { flex: 1 },
  title: { fontSize: 13, fontWeight: "700", marginBottom: 2 },
  message: { fontSize: 12, lineHeight: 17 },
});
