import { format } from "date-fns";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FieldGroup, FormField } from "../../components/FormField";
import { PillSelect } from "../../components/PillSelect";
import { PrimaryButton } from "../../components/PrimaryButton";
import { ScreenContainer } from "../../components/ScreenContainer";
import { useAccountsStore } from "../../store/useAccountsStore";
import { useCategoriesStore } from "../../store/useCategoriesStore";
import { useTransactionsStore } from "../../store/useTransactionsStore";
import { useTheme } from "../../theme/useTheme";

export default function NovaTransacaoModal() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const transactionId = id ? Number(id) : undefined;

  const accounts = useAccountsStore((s) => s.items);
  const categories = useCategoriesStore((s) => s.items);
  const transactions = useTransactionsStore((s) => s.items);
  const addTransaction = useTransactionsStore((s) => s.add);
  const editTransaction = useTransactionsStore((s) => s.edit);
  const removeTransaction = useTransactionsStore((s) => s.remove);

  const existing = useMemo(
    () => (transactionId ? transactions.find((t) => t.id === transactionId) : undefined),
    [transactionId, transactions]
  );

  const [type, setType] = useState<"income" | "expense">(existing?.type ?? "expense");
  const [amount, setAmount] = useState(existing ? String(existing.amount) : "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [accountId, setAccountId] = useState<number | null>(existing?.account_id ?? accounts[0]?.id ?? null);
  const [categoryId, setCategoryId] = useState<number | null>(existing?.category_id ?? categories[0]?.id ?? null);
  const [date, setDate] = useState(existing?.date ?? format(new Date(), "yyyy-MM-dd"));
  const [error, setError] = useState<string | null>(null);

  const filteredCategories = categories.filter((c) => (type === "income" ? c.name === "Salário" || c.bucket === "outros" : c.name !== "Salário"));

  function handleSave() {
    const parsedAmount = Number(amount.replace(",", "."));
    if (!parsedAmount || parsedAmount <= 0) {
      setError("Informe um valor válido.");
      return;
    }
    if (!accountId) {
      setError("Selecione uma conta.");
      return;
    }
    if (!categoryId) {
      setError("Selecione uma categoria.");
      return;
    }

    const payload = {
      account_id: accountId,
      category_id: categoryId,
      type,
      amount: parsedAmount,
      description: description.trim() || (type === "income" ? "Receita" : "Despesa"),
      date,
    };

    if (existing) {
      editTransaction(existing.id, payload);
    } else {
      addTransaction(payload);
    }
    router.back();
  }

  function handleDelete() {
    if (existing) {
      removeTransaction(existing.id);
      router.back();
    }
  }

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: theme.colors.textPrimary, fontWeight: theme.headingWeight }]}>
        {existing ? "Editar transação" : "Nova transação"}
      </Text>

      <FieldGroup>
        <PillSelect
          label="Tipo"
          value={type}
          onChange={(v) => setType(v as "income" | "expense")}
          options={[
            { value: "expense", label: "Despesa", color: theme.colors.expense },
            { value: "income", label: "Receita", color: theme.colors.income },
          ]}
        />

        <FormField
          label="Valor"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
          placeholder="0,00"
        />

        <FormField label="Descrição" value={description} onChangeText={setDescription} placeholder="Ex: Supermercado" />

        <PillSelect
          label="Conta"
          value={accountId ? String(accountId) : null}
          onChange={(v) => setAccountId(Number(v))}
          options={accounts.map((a) => ({ value: String(a.id), label: a.name, color: a.color }))}
        />

        <PillSelect
          label="Categoria"
          value={categoryId ? String(categoryId) : null}
          onChange={(v) => setCategoryId(Number(v))}
          options={filteredCategories.map((c) => ({ value: String(c.id), label: c.name, color: c.color }))}
        />

        <FormField label="Data" value={date} onChangeText={setDate} placeholder="AAAA-MM-DD" />

        {error ? <Text style={{ color: theme.colors.danger, fontSize: 13 }}>{error}</Text> : null}
      </FieldGroup>

      <View style={{ marginTop: 24, gap: 12 }}>
        <PrimaryButton label="Salvar" onPress={handleSave} />
        {existing ? <PrimaryButton label="Excluir" variant="outline" color={theme.colors.danger} onPress={handleDelete} /> : null}
        <PrimaryButton label="Cancelar" variant="outline" onPress={() => router.back()} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, marginBottom: 20 },
});
