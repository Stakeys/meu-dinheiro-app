import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card } from "../../components/Card";
import { ScreenContainer } from "../../components/ScreenContainer";
import { TransactionRow } from "../../components/TransactionRow";
import { useCategoriesStore } from "../../store/useCategoriesStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useTransactionsStore } from "../../store/useTransactionsStore";
import { useTheme } from "../../theme/useTheme";

export default function TransacoesScreen() {
  const theme = useTheme();
  const transactions = useTransactionsStore((s) => s.items);
  const categories = useCategoriesStore((s) => s.items);
  const currency = useSettingsStore((s) => s.currency);

  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.textPrimary, fontWeight: theme.headingWeight }]}>
          Transações
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/transacao/nova")}
          style={[styles.addButton, { backgroundColor: theme.colors.accent, borderRadius: theme.radius.pill }]}
        >
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <Card>
        {transactions.map((tx) => {
          const category = tx.category_id ? categoryMap.get(tx.category_id) : undefined;
          return (
            <TouchableOpacity key={tx.id} onPress={() => router.push({ pathname: "/transacao/nova", params: { id: String(tx.id) } })}>
              <TransactionRow
                description={tx.description}
                date={tx.date}
                amount={tx.amount}
                type={tx.type}
                icon={(category?.icon as any) ?? "ellipsis-horizontal"}
                categoryColor={category?.color ?? theme.colors.textMuted}
                currency={currency}
              />
            </TouchableOpacity>
          );
        })}
        {transactions.length === 0 ? (
          <Text style={{ color: theme.colors.textMuted, fontSize: 13, paddingVertical: 12 }}>
            Nenhuma transação ainda. Toque em + para adicionar.
          </Text>
        ) : null}
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 22 },
  addButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
});
