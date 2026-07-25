import { format, subMonths } from "date-fns";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "../../../components/Card";
import { CategoryDonut } from "../../../components/CategoryDonut";
import { ExpenseLineChart } from "../../../components/ExpenseLineChart";
import { PillSelect } from "../../../components/PillSelect";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { SectionHeader } from "../../../components/SectionHeader";
import * as transactionsRepo from "../../../db/repositories/transactions";
import { formatCurrency, formatMonthYear } from "../../../lib/format";
import { useSettingsStore } from "../../../store/useSettingsStore";
import { useTransactionsStore } from "../../../store/useTransactionsStore";
import { useTheme } from "../../../theme/useTheme";

const PERIODS = [
  { value: "3", label: "3 meses" },
  { value: "6", label: "6 meses" },
  { value: "12", label: "12 meses" },
];

export default function RelatoriosScreen() {
  const theme = useTheme();
  const currency = useSettingsStore((s) => s.currency);
  const transactions = useTransactionsStore((s) => s.items);
  const [period, setPeriod] = useState("6");
  const monthsCount = Number(period);

  const months = useMemo(
    () => Array.from({ length: monthsCount }, (_, i) => format(subMonths(new Date(), monthsCount - 1 - i), "yyyy-MM")),
    [monthsCount]
  );
  const startMonth = months[0];
  const endMonth = months[months.length - 1];

  const totals = useMemo(
    () => transactionsRepo.getTotalsByTypeRange(startMonth, endMonth),
    [startMonth, endMonth, transactions]
  );
  const expensesByCategory = useMemo(
    () => transactionsRepo.getExpensesByCategoryRange(startMonth, endMonth),
    [startMonth, endMonth, transactions]
  );
  const evolution = useMemo(
    () => transactionsRepo.getMonthlyExpenseEvolution(months),
    [months, transactions]
  );

  const donutData = expensesByCategory.map((c) => ({ label: c.name, value: c.total, color: c.color }));
  const balance = totals.income - totals.expense;

  return (
    <ScreenContainer safeTop={false}>
      <PillSelect label="Período" value={period} onChange={setPeriod} options={PERIODS} />

      <View style={styles.row}>
        <Card style={{ flex: 1 }}>
          <Text style={[styles.label, { color: theme.colors.textMuted }]}>Receitas</Text>
          <Text style={[styles.value, { color: theme.colors.income }]}>{formatCurrency(totals.income, currency)}</Text>
        </Card>
        <Card style={{ flex: 1 }}>
          <Text style={[styles.label, { color: theme.colors.textMuted }]}>Despesas</Text>
          <Text style={[styles.value, { color: theme.colors.expense }]}>{formatCurrency(totals.expense, currency)}</Text>
        </Card>
      </View>

      <Card>
        <Text style={[styles.label, { color: theme.colors.textMuted }]}>Saldo do período</Text>
        <Text style={[styles.value, { color: balance >= 0 ? theme.colors.success : theme.colors.danger, fontSize: 22 }]}>
          {formatCurrency(balance, currency)}
        </Text>
      </Card>

      <Card>
        <SectionHeader title="Gastos por categoria" />
        <View style={{ marginTop: 12 }}>
          <CategoryDonut data={donutData} currency={currency} />
        </View>
      </Card>

      <Card>
        <SectionHeader title="Evolução dos gastos" />
        <View style={{ marginTop: 12, alignItems: "center" }}>
          <ExpenseLineChart data={evolution.map((e) => ({ label: formatMonthYear(e.month).split(" ")[0], value: e.total }))} />
        </View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12 },
  label: { fontSize: 12, fontWeight: "600" },
  value: { fontSize: 16, fontWeight: "700", marginTop: 4 },
});
