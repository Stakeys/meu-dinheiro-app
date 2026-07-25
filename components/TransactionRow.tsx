import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { formatCurrency, formatDateShort } from "../lib/format";
import { useTheme } from "../theme/useTheme";
import { IconBadge } from "./IconBadge";

type Props = {
  description: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  icon: keyof typeof Ionicons.glyphMap;
  categoryColor: string;
  currency?: string;
};

export function TransactionRow({ description, date, amount, type, icon, categoryColor, currency }: Props) {
  const theme = useTheme();
  const isIncome = type === "income";
  const amountColor = isIncome ? theme.colors.income : theme.colors.expense;
  const sign = isIncome ? "+ " : "- ";

  return (
    <View style={styles.row}>
      <IconBadge name={icon} color={categoryColor} size={40} />
      <View style={styles.info}>
        <Text style={[styles.description, { color: theme.colors.textPrimary }]} numberOfLines={1}>
          {description}
        </Text>
        <Text style={[styles.date, { color: theme.colors.textMuted }]}>{formatDateShort(date)}</Text>
      </View>
      <Text style={[styles.amount, { color: amountColor }]}>
        {sign}
        {formatCurrency(amount, currency)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8 },
  info: { flex: 1 },
  description: { fontSize: 14, fontWeight: "600" },
  date: { fontSize: 12, marginTop: 2 },
  amount: { fontSize: 14, fontWeight: "700" },
});
