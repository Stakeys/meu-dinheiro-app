import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AmountField } from "../../../components/AmountField";
import { Card } from "../../../components/Card";
import { IconBadge } from "../../../components/IconBadge";
import { ProgressBar } from "../../../components/ProgressBar";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { ScreenContainer } from "../../../components/ScreenContainer";
import * as transactionsRepo from "../../../db/repositories/transactions";
import { formatCurrency, getCurrencySymbol } from "../../../lib/format";
import { useBudgetsStore } from "../../../store/useBudgetsStore";
import { useCategoriesStore } from "../../../store/useCategoriesStore";
import { useSettingsStore } from "../../../store/useSettingsStore";
import { useTransactionsStore } from "../../../store/useTransactionsStore";
import { useTheme } from "../../../theme/useTheme";

export default function OrcamentoScreen() {
  const theme = useTheme();
  const categories = useCategoriesStore((s) => s.items).filter((c) => c.name !== "Salário");
  const budgets = useBudgetsStore((s) => s.items);
  const month = useBudgetsStore((s) => s.month);
  const saveBudget = useBudgetsStore((s) => s.save);
  const currency = useSettingsStore((s) => s.currency);
  const transactions = useTransactionsStore((s) => s.items);

  const spentByCategory = useMemo(() => {
    const rows = transactionsRepo.getExpensesByCategory(month);
    return new Map(rows.map((r) => [r.category_id, r.total]));
  }, [month, transactions]);

  const [drafts, setDrafts] = useState<Record<number, number>>({});

  function handleSave(categoryId: number, limitAmount: number) {
    const value = drafts[categoryId] ?? limitAmount;
    if (!value || value <= 0) return;
    saveBudget({ category_id: categoryId, month, limit_amount: value });
  }

  return (
    <ScreenContainer safeTop={false}>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Defina um limite mensal por categoria e acompanhe o quanto já gastou.
      </Text>

      {categories.map((category) => {
        const budget = budgets.find((b) => b.category_id === category.id);
        const spent = spentByCategory.get(category.id) ?? 0;
        const limit = budget?.limit_amount ?? 0;
        const progress = limit > 0 ? (spent / limit) * 100 : 0;
        const over = limit > 0 && spent > limit;

        return (
          <Card key={category.id}>
            <View style={styles.row}>
              <IconBadge name={category.icon as any} color={category.color} size={38} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: theme.colors.textPrimary }]}>{category.name}</Text>
                <Text style={[styles.spent, { color: over ? theme.colors.danger : theme.colors.textMuted }]}>
                  {formatCurrency(spent, currency)}
                  {limit > 0 ? ` / ${formatCurrency(limit, currency)}` : " gastos este mês"}
                </Text>
              </View>
            </View>

            {limit > 0 ? (
              <View style={{ marginTop: 10 }}>
                <ProgressBar progress={progress} color={over ? theme.colors.danger : category.color} />
              </View>
            ) : null}

            <View style={styles.editRow}>
              <View style={{ flex: 1 }}>
                <AmountField
                  label="Limite mensal"
                  initialValue={limit}
                  onChangeValue={(v) => setDrafts((prev) => ({ ...prev, [category.id]: v }))}
                  prefix={getCurrencySymbol(currency)}
                />
              </View>
              <View style={{ width: 100, marginTop: 20 }}>
                <PrimaryButton label="Salvar" onPress={() => handleSave(category.id, limit)} />
              </View>
            </View>
          </Card>
        );
      })}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: { fontSize: 13, lineHeight: 18 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  name: { fontSize: 14, fontWeight: "700" },
  spent: { fontSize: 12, marginTop: 2 },
  editRow: { flexDirection: "row", gap: 10, marginTop: 12, alignItems: "flex-start" },
});
