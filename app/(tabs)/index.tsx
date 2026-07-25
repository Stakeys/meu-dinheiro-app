import { Ionicons } from "@expo/vector-icons";
import { format, subMonths } from "date-fns";
import { router } from "expo-router";
import { useMemo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AlertItem } from "../../components/AlertItem";
import { CategoryDonut } from "../../components/CategoryDonut";
import { ExpenseLineChart } from "../../components/ExpenseLineChart";
import { GoalCard } from "../../components/GoalCard";
import { MoneyFlowWidget, type FlowBucket } from "../../components/MoneyFlowWidget";
import { ScreenContainer } from "../../components/ScreenContainer";
import { SectionHeader } from "../../components/SectionHeader";
import { StatCard } from "../../components/StatCard";
import { StreakRing } from "../../components/StreakRing";
import { Card } from "../../components/Card";
import { TransactionRow } from "../../components/TransactionRow";
import * as transactionsRepo from "../../db/repositories/transactions";
import type { Bucket } from "../../db/types";
import { formatCurrency, formatMonthYear } from "../../lib/format";
import { useTheme } from "../../theme/useTheme";
import { useBudgetsStore } from "../../store/useBudgetsStore";
import { useCategoriesStore } from "../../store/useCategoriesStore";
import { useGoalsStore } from "../../store/useGoalsStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useTransactionsStore } from "../../store/useTransactionsStore";

const BUCKET_ICON: Record<Bucket, keyof typeof Ionicons.glyphMap> = {
  necessidades: "home",
  estilo_vida: "heart",
  investimentos: "trending-up",
  outros: "ellipsis-horizontal",
};

const BUCKET_LABEL: Record<Bucket, string> = {
  necessidades: "Necessidades",
  estilo_vida: "Estilo de vida",
  investimentos: "Investimentos",
  outros: "Outros",
};

export default function DashboardScreen() {
  const theme = useTheme();
  const userName = useSettingsStore((s) => s.user_name);
  const avatarUri = useSettingsStore((s) => s.avatar_uri);
  const currency = useSettingsStore((s) => s.currency);
  const transactions = useTransactionsStore((s) => s.items);
  const categories = useCategoriesStore((s) => s.items);
  const goals = useGoalsStore((s) => s.items);
  const budgets = useBudgetsStore((s) => s.items);

  const month = format(new Date(), "yyyy-MM");

  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const totals = useMemo(() => transactionsRepo.getTotalsByType(month), [month, transactions]);
  const expensesByCategory = useMemo(
    () => transactionsRepo.getExpensesByCategory(month),
    [month, transactions]
  );
  const expensesByBucket = useMemo(() => transactionsRepo.getExpensesByBucket(month), [month, transactions]);

  const evolutionMonths = useMemo(
    () => Array.from({ length: 6 }, (_, i) => format(subMonths(new Date(), 5 - i), "yyyy-MM")),
    [month]
  );
  const evolution = useMemo(
    () => transactionsRepo.getMonthlyExpenseEvolution(evolutionMonths),
    [evolutionMonths, transactions]
  );

  const available = totals.income - totals.expense;
  const savingsPercent = totals.income > 0 ? (available / totals.income) * 100 : 0;

  const donutData = expensesByCategory.map((c) => ({ label: c.name, value: c.total, color: c.color }));

  const flowBuckets: FlowBucket[] = (["necessidades", "estilo_vida", "investimentos", "outros"] as Bucket[]).map(
    (bucket) => ({
      key: bucket,
      label: BUCKET_LABEL[bucket],
      value: expensesByBucket.find((b) => b.bucket === bucket)?.total ?? 0,
      color: theme.bucketColors[bucket],
      icon: BUCKET_ICON[bucket],
    })
  );

  const alerts = useMemo(() => {
    const list: { title: string; message: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [];

    for (const budget of budgets) {
      const category = categoryMap.get(budget.category_id);
      const spent = expensesByCategory.find((c) => c.category_id === budget.category_id)?.total ?? 0;
      if (category && spent > budget.limit_amount) {
        list.push({
          title: "Gasto acima do orçamento",
          message: `Você excedeu o orçamento em ${category.name} em ${formatCurrency(
            spent - budget.limit_amount,
            currency
          )} este mês.`,
          icon: "alert-circle",
          color: theme.colors.danger,
        });
      }
    }

    const assinaturas = categories.find((c) => c.name === "Assinaturas");
    if (assinaturas) {
      const relatedTx = transactions.filter(
        (t) => t.category_id === assinaturas.id && t.date.startsWith(month) && t.type === "expense"
      );
      if (relatedTx.length > 0) {
        const sum = relatedTx.reduce((acc, t) => acc + t.amount, 0);
        list.push({
          title: "Assinaturas ativas",
          message: `Você tem ${relatedTx.length} assinaturas ativas somando ${formatCurrency(sum, currency)} por mês.`,
          icon: "repeat",
          color: theme.colors.warning,
        });
      }
    }

    if (savingsPercent >= 30) {
      list.push({
        title: "Parabéns!",
        message: `Você atingiu ${Math.round(savingsPercent)}% de economia. Continue assim!`,
        icon: "trophy",
        color: theme.colors.success,
      });
    }

    return list;
  }, [budgets, categoryMap, expensesByCategory, categories, transactions, month, savingsPercent, currency, theme]);

  const dayOfMonth = new Date().getDate();
  const streakRemaining = Math.max(0, 30 - Math.min(30, dayOfMonth));

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/mais/configuracoes")}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={[styles.avatar, { borderColor: theme.colors.accent }]} />
          ) : (
            <View style={[styles.avatarFallback, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.accent }]}>
              <Ionicons name="person" size={20} color={theme.colors.textMuted} />
            </View>
          )}
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.greeting, { color: theme.colors.textPrimary, fontWeight: theme.headingWeight }]}>
            Olá, {userName}! 👋
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Aqui está o resumo da sua vida financeira hoje.
          </Text>
        </View>
        <View style={[styles.monthChip, { backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.radius.pill }]}>
          <Text style={[styles.monthChipText, { color: theme.colors.textPrimary }]}>{formatMonthYear(month)}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatCard
          label="Saldo disponível"
          value={formatCurrency(available, currency)}
          icon="wallet"
          footnote="Receitas menos despesas"
          emphasis
        />
        <StatCard
          label="Receitas"
          value={formatCurrency(totals.income, currency)}
          icon="arrow-down-circle-outline"
          footnote="Este mês"
        />
      </View>
      <View style={styles.statsRow}>
        <StatCard
          label="Despesas"
          value={formatCurrency(totals.expense, currency)}
          icon="cart-outline"
          footnote="Este mês"
          progressColor={theme.colors.expense}
        />
        <StatCard
          label="Economia"
          value={formatCurrency(available, currency)}
          icon="save-outline"
          footnote={`${Math.round(savingsPercent)}% da renda`}
        />
      </View>

      <MoneyFlowWidget
        income={totals.income}
        available={available}
        buckets={flowBuckets}
        savingsPercent={savingsPercent}
        currency={currency}
      />

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

      <View>
        <SectionHeader title="Metas" actionLabel="Ver todas" onAction={() => router.push("/(tabs)/metas")} />
        <View style={{ marginTop: 10, gap: 10 }}>
          {goals.slice(0, 3).map((goal) => (
            <Card key={goal.id} padding={12}>
              <GoalCard
                name={goal.name}
                current={goal.current_amount}
                target={goal.target_amount}
                icon={goal.icon as keyof typeof Ionicons.glyphMap}
                color={goal.color}
                currency={currency}
                imageUri={goal.image_uri}
                compact
              />
            </Card>
          ))}
          {goals.length === 0 ? (
            <Text style={{ color: theme.colors.textMuted, fontSize: 13 }}>Nenhuma meta cadastrada ainda.</Text>
          ) : null}
        </View>
      </View>

      {alerts.length > 0 ? (
        <Card>
          <SectionHeader title="Alertas" />
          <View style={{ marginTop: 4 }}>
            {alerts.map((alert, index) => (
              <AlertItem key={index} {...alert} />
            ))}
          </View>
        </Card>
      ) : null}

      <View style={styles.bottomRow}>
        <Card style={styles.streakCard}>
          <Text style={[styles.streakTitle, { color: theme.colors.textPrimary }]}>Desafio 30 dias</Text>
          <Text style={[styles.streakSubtitle, { color: theme.colors.textMuted }]}>Sem gastos extras!</Text>
          <View style={{ alignItems: "center", marginTop: 12 }}>
            <StreakRing value={streakRemaining} total={30} color={theme.colors.accent} />
            <Text style={[styles.streakCaption, { color: theme.colors.textMuted }]}>dias restantes</Text>
          </View>
        </Card>
      </View>

      <View>
        <SectionHeader
          title="Transações recentes"
          actionLabel="Ver todas"
          onAction={() => router.push("/(tabs)/transacoes")}
        />
        <Card style={{ marginTop: 10 }}>
          {transactions.slice(0, 5).map((tx) => {
            const category = tx.category_id ? categoryMap.get(tx.category_id) : undefined;
            return (
              <TransactionRow
                key={tx.id}
                description={tx.description}
                date={tx.date}
                amount={tx.amount}
                type={tx.type}
                icon={(category?.icon as keyof typeof Ionicons.glyphMap) ?? "ellipsis-horizontal"}
                categoryColor={category?.color ?? theme.colors.textMuted}
                currency={currency}
              />
            );
          })}
          {transactions.length === 0 ? (
            <Text style={{ color: theme.colors.textMuted, fontSize: 13 }}>Nenhuma transação ainda.</Text>
          ) : null}
        </Card>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2 },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  greeting: { fontSize: 20 },
  subtitle: { fontSize: 13, marginTop: 2 },
  monthChip: { paddingHorizontal: 14, paddingVertical: 8 },
  monthChipText: { fontSize: 12, fontWeight: "700" },
  statsRow: { flexDirection: "row", gap: 12 },
  bottomRow: { flexDirection: "row" },
  streakCard: { flex: 1, alignItems: "center" },
  streakTitle: { fontSize: 14, fontWeight: "700" },
  streakSubtitle: { fontSize: 12, marginTop: 2 },
  streakCaption: { fontSize: 12, marginTop: 4 },
});
