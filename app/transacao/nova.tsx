import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AmountField } from "../../components/AmountField";
import { Card } from "../../components/Card";
import { FieldGroup, FormField } from "../../components/FormField";
import { IconBadge } from "../../components/IconBadge";
import { PillSelect } from "../../components/PillSelect";
import { PrimaryButton } from "../../components/PrimaryButton";
import { ScreenContainer } from "../../components/ScreenContainer";
import type { Account, Bucket, Category } from "../../db/types";
import { getCurrencySymbol } from "../../lib/format";
import { useAccountsStore } from "../../store/useAccountsStore";
import { useCategoriesStore } from "../../store/useCategoriesStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useTransactionsStore } from "../../store/useTransactionsStore";
import { useTheme } from "../../theme/useTheme";

const CATEGORY_ICON_PRESETS: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: "home", label: "Moradia" },
  { icon: "fast-food", label: "Alimentação" },
  { icon: "car", label: "Transporte" },
  { icon: "medkit", label: "Saúde" },
  { icon: "game-controller", label: "Lazer" },
  { icon: "repeat", label: "Assinaturas" },
  { icon: "cash", label: "Salário" },
  { icon: "ellipsis-horizontal", label: "Outros" },
];

const BUCKET_OPTIONS: { value: Bucket; label: string }[] = [
  { value: "necessidades", label: "Necessidades" },
  { value: "estilo_vida", label: "Estilo de vida" },
  { value: "investimentos", label: "Investimentos" },
  { value: "outros", label: "Outros" },
];

const EXPENSE_CATEGORY_SUGGESTIONS: Omit<Category, "id">[] = [
  { name: "Moradia", icon: "home", color: "#F59E0B", bucket: "necessidades" },
  { name: "Alimentação", icon: "fast-food", color: "#F43F5E", bucket: "necessidades" },
  { name: "Transporte", icon: "car", color: "#3B82F6", bucket: "necessidades" },
  { name: "Saúde", icon: "medkit", color: "#10B981", bucket: "necessidades" },
  { name: "Lazer", icon: "game-controller", color: "#8B5CF6", bucket: "estilo_vida" },
  { name: "Assinaturas", icon: "repeat", color: "#F472B6", bucket: "estilo_vida" },
  { name: "Outros", icon: "ellipsis-horizontal", color: "#94A3B8", bucket: "outros" },
];

const INCOME_CATEGORY_SUGGESTIONS: Omit<Category, "id">[] = [
  { name: "Salário", icon: "cash", color: "#22C55E", bucket: "outros" },
  { name: "Freelance", icon: "briefcase", color: "#3B82F6", bucket: "outros" },
  { name: "Investimentos", icon: "trending-up", color: "#14B8A6", bucket: "outros" },
  { name: "Outros", icon: "ellipsis-horizontal", color: "#94A3B8", bucket: "outros" },
];

const ACCOUNT_SUGGESTIONS: Omit<Account, "id">[] = [
  { name: "Conta Corrente", type: "corrente", balance: 0, icon: "wallet", color: "#7C3AED" },
  { name: "Cartão de Crédito", type: "cartao", balance: 0, icon: "card", color: "#EC4899" },
  { name: "Dinheiro", type: "dinheiro", balance: 0, icon: "cash-outline", color: "#22C55E" },
];

export default function NovaTransacaoModal() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const transactionId = id ? Number(id) : undefined;

  const accounts = useAccountsStore((s) => s.items);
  const addAccount = useAccountsStore((s) => s.add);
  const categories = useCategoriesStore((s) => s.items);
  const addCategory = useCategoriesStore((s) => s.add);
  const transactions = useTransactionsStore((s) => s.items);
  const addTransaction = useTransactionsStore((s) => s.add);
  const editTransaction = useTransactionsStore((s) => s.edit);
  const removeTransaction = useTransactionsStore((s) => s.remove);
  const currency = useSettingsStore((s) => s.currency);

  const existing = useMemo(
    () => (transactionId ? transactions.find((t) => t.id === transactionId) : undefined),
    [transactionId, transactions]
  );

  const [type, setType] = useState<"income" | "expense">(existing?.type ?? "expense");
  const [amount, setAmount] = useState(existing?.amount ?? 0);
  const [description, setDescription] = useState(existing?.description ?? "");
  const [accountId, setAccountId] = useState<number | null>(existing?.account_id ?? accounts[0]?.id ?? null);
  const [categoryId, setCategoryId] = useState<number | null>(existing?.category_id ?? null);
  const [date, setDate] = useState(existing?.date ?? format(new Date(), "yyyy-MM-dd"));
  const [error, setError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const colorPresets = Array.from(
    new Set([
      theme.colors.accent,
      theme.colors.success,
      theme.colors.warning,
      theme.colors.danger,
      theme.bucketColors.investimentos,
      theme.bucketColors.estilo_vida,
    ])
  );

  const [showAccountForm, setShowAccountForm] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showMoreCategorySuggestions, setShowMoreCategorySuggestions] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState<keyof typeof Ionicons.glyphMap>("ellipsis-horizontal");
  const [newCategoryColor, setNewCategoryColor] = useState(colorPresets[0]);
  const [newCategoryBucket, setNewCategoryBucket] = useState<Bucket>("necessidades");

  const filteredCategories = categories.filter((c) => (type === "income" ? c.name === "Salário" || c.bucket === "outros" : c.name !== "Salário"));
  const selectedAccount = accounts.find((a) => a.id === accountId);
  const selectedCategory = categories.find((c) => c.id === categoryId);

  const allCategorySuggestions = type === "income" ? INCOME_CATEGORY_SUGGESTIONS : EXPENSE_CATEGORY_SUGGESTIONS;
  const availableCategorySuggestions = allCategorySuggestions.filter(
    (s) => !categories.some((c) => c.name === s.name)
  );
  const visibleCategorySuggestions = showMoreCategorySuggestions
    ? availableCategorySuggestions
    : availableCategorySuggestions.slice(0, 3);

  const availableAccountSuggestions = ACCOUNT_SUGGESTIONS.filter((s) => !accounts.some((a) => a.name === s.name));

  // Categorias são específicas de Despesa ou Receita. Ao trocar o Tipo, uma categoria
  // selecionada que não pertence mais à lista filtrada precisa ser limpa — senão a
  // transação salvaria com uma categoria do tipo errado (ou o usuário fica sem
  // entender por que não consegue salvar).
  useEffect(() => {
    if (categoryId && !filteredCategories.some((c) => c.id === categoryId)) {
      setCategoryId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  function handleQuickCreateAccount(suggestion: Omit<Account, "id">) {
    const created = addAccount(suggestion);
    setAccountId(created.id);
  }

  function handleCreateAccount() {
    if (!newAccountName.trim()) return;
    const created = addAccount({ name: newAccountName.trim(), type: "corrente", balance: 0, icon: "wallet", color: theme.colors.accent });
    setAccountId(created.id);
    setNewAccountName("");
    setShowAccountForm(false);
  }

  function handleQuickCreateCategory(suggestion: Omit<Category, "id">) {
    const created = addCategory(suggestion);
    setCategoryId(created.id);
  }

  function handleCreateCategory() {
    if (!newCategoryName.trim()) {
      setCategoryError("Dê um nome para a categoria.");
      return;
    }
    const created = addCategory({
      name: newCategoryName.trim(),
      icon: newCategoryIcon,
      color: newCategoryColor,
      bucket: type === "income" ? "outros" : newCategoryBucket,
    });
    setCategoryId(created.id);
    setNewCategoryName("");
    setCategoryError(null);
    setShowCategoryForm(false);
  }

  function handleSave() {
    if (!amount || amount <= 0) {
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
      amount,
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

        <AmountField label="Valor" initialValue={amount} onChangeValue={setAmount} prefix={getCurrencySymbol(currency)} />

        <FormField label="Descrição" value={description} onChangeText={setDescription} placeholder="Ex: Supermercado" />

        {/* Conta */}
        <View>
          <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>Conta</Text>
          <Text style={{ color: theme.colors.textMuted, fontSize: 11, marginBottom: 8 }}>
            De onde o dinheiro sai ou entra.
          </Text>

          {accounts.length > 0 ? (
            <PillSelect
              value={accountId ? String(accountId) : null}
              onChange={(v) => setAccountId(Number(v))}
              options={accounts.map((a) => ({ value: String(a.id), label: a.name, color: a.color }))}
            />
          ) : null}

          {selectedAccount ? (
            <View style={styles.confirmRow}>
              <Ionicons name="checkmark-circle" size={14} color={theme.colors.success} />
              <Text style={{ color: theme.colors.success, fontSize: 12, fontWeight: "600" }}>
                Conta selecionada: {selectedAccount.name}
              </Text>
            </View>
          ) : null}

          {availableAccountSuggestions.length > 0 ? (
            <View style={styles.suggestionRow}>
              {availableAccountSuggestions.map((s) => (
                <TouchableOpacity
                  key={s.name}
                  onPress={() => handleQuickCreateAccount(s)}
                  style={[styles.suggestionChip, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}
                >
                  <IconBadge name={s.icon as keyof typeof Ionicons.glyphMap} color={s.color} size={22} />
                  <Text style={{ color: theme.colors.textPrimary, fontSize: 12, fontWeight: "600" }}>{s.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}

          <TouchableOpacity onPress={() => setShowAccountForm((v) => !v)} style={{ marginTop: 8 }}>
            <Text style={{ color: theme.colors.accent, fontSize: 12, fontWeight: "700" }}>
              {showAccountForm ? "Cancelar" : "+ Outra conta"}
            </Text>
          </TouchableOpacity>

          {showAccountForm ? (
            <Card style={{ marginTop: 10 }}>
              <FieldGroup>
                <FormField label="Nome da conta" value={newAccountName} onChangeText={setNewAccountName} placeholder="Ex: Nubank" />
              </FieldGroup>
              <View style={{ marginTop: 16 }}>
                <PrimaryButton label="Criar conta" onPress={handleCreateAccount} />
              </View>
            </Card>
          ) : null}
        </View>

        {/* Categoria */}
        <View>
          <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>Categoria</Text>
          <Text style={{ color: theme.colors.textMuted, fontSize: 11, marginBottom: 8 }}>
            O tipo de {type === "income" ? "receita" : "gasto"} (ex: {type === "income" ? "Salário, Freelance" : "Moradia, Alimentação"}).
          </Text>

          {filteredCategories.length > 0 ? (
            <PillSelect
              value={categoryId ? String(categoryId) : null}
              onChange={(v) => setCategoryId(Number(v))}
              options={filteredCategories.map((c) => ({ value: String(c.id), label: c.name, color: c.color }))}
            />
          ) : null}

          {selectedCategory ? (
            <View style={styles.confirmRow}>
              <Ionicons name="checkmark-circle" size={14} color={theme.colors.success} />
              <Text style={{ color: theme.colors.success, fontSize: 12, fontWeight: "600" }}>
                Categoria selecionada: {selectedCategory.name}
              </Text>
            </View>
          ) : null}

          {visibleCategorySuggestions.length > 0 ? (
            <View style={styles.suggestionRow}>
              {visibleCategorySuggestions.map((s) => (
                <TouchableOpacity
                  key={s.name}
                  onPress={() => handleQuickCreateCategory(s)}
                  style={[styles.suggestionChip, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}
                >
                  <IconBadge name={s.icon as keyof typeof Ionicons.glyphMap} color={s.color} size={22} />
                  <Text style={{ color: theme.colors.textPrimary, fontSize: 12, fontWeight: "600" }}>{s.name}</Text>
                </TouchableOpacity>
              ))}
              {!showMoreCategorySuggestions && availableCategorySuggestions.length > 3 ? (
                <TouchableOpacity
                  onPress={() => setShowMoreCategorySuggestions(true)}
                  style={[styles.suggestionChip, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}
                >
                  <Ionicons name="chevron-forward-circle" size={22} color={theme.colors.accent} />
                  <Text style={{ color: theme.colors.accent, fontSize: 12, fontWeight: "600" }}>Mais</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}

          <TouchableOpacity
            onPress={() => {
              setShowCategoryForm((v) => !v);
              setCategoryError(null);
            }}
            style={{ marginTop: 8 }}
          >
            <Text style={{ color: theme.colors.accent, fontSize: 12, fontWeight: "700" }}>
              {showCategoryForm ? "Cancelar" : "+ Categoria personalizada"}
            </Text>
          </TouchableOpacity>

          {showCategoryForm ? (
            <Card style={{ marginTop: 10 }}>
              <Text style={{ color: theme.colors.textMuted, fontSize: 11, marginBottom: 10 }}>
                Essa categoria será criada como categoria de{" "}
                <Text style={{ fontWeight: "700", color: type === "income" ? theme.colors.income : theme.colors.expense }}>
                  {type === "income" ? "Receita" : "Despesa"}
                </Text>{" "}
                (o Tipo selecionado acima). Categorias de receita e despesa aparecem em listas separadas.
              </Text>
              <FieldGroup>
                <FormField label="Nome" value={newCategoryName} onChangeText={setNewCategoryName} placeholder="Ex: Educação" />
                <PillSelect
                  label="Ícone"
                  value={newCategoryIcon}
                  onChange={(v) => setNewCategoryIcon(v as keyof typeof Ionicons.glyphMap)}
                  options={CATEGORY_ICON_PRESETS.map((p) => ({ value: p.icon, label: p.label }))}
                />
                {type === "expense" ? (
                  <PillSelect
                    label="Grupo"
                    value={newCategoryBucket}
                    onChange={(v) => setNewCategoryBucket(v as Bucket)}
                    options={BUCKET_OPTIONS}
                  />
                ) : null}
                <View>
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 13, fontWeight: "600", marginBottom: 6 }}>Cor</Text>
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    {colorPresets.map((color) => (
                      <TouchableOpacity
                        key={color}
                        onPress={() => setNewCategoryColor(color)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          backgroundColor: color,
                          borderWidth: newCategoryColor === color ? 2 : 0,
                          borderColor: theme.colors.textPrimary,
                        }}
                      />
                    ))}
                  </View>
                </View>
                {categoryError ? <Text style={{ color: theme.colors.danger, fontSize: 12 }}>{categoryError}</Text> : null}
              </FieldGroup>
              <View style={{ marginTop: 16 }}>
                <PrimaryButton label="Criar categoria" onPress={handleCreateCategory} />
              </View>
            </Card>
          ) : null}
        </View>

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
  fieldLabel: { fontSize: 13, fontWeight: "600", marginBottom: 2 },
  confirmRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 },
  suggestionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  suggestionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
