import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card } from "../../../components/Card";
import { FieldGroup, FormField } from "../../../components/FormField";
import { IconBadge } from "../../../components/IconBadge";
import { PillSelect } from "../../../components/PillSelect";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { formatCurrency } from "../../../lib/format";
import { useAccountsStore } from "../../../store/useAccountsStore";
import { useSettingsStore } from "../../../store/useSettingsStore";
import { useTheme } from "../../../theme/useTheme";

const TYPE_OPTIONS: { value: "corrente" | "poupanca" | "cartao" | "dinheiro"; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: "corrente", label: "Conta Corrente", icon: "wallet" },
  { value: "poupanca", label: "Poupança", icon: "cash" },
  { value: "cartao", label: "Cartão de Crédito", icon: "card" },
  { value: "dinheiro", label: "Dinheiro", icon: "cash-outline" },
];

const COLOR_PRESETS = ["#7C3AED", "#EC4899", "#3B82F6", "#10B981", "#F59E0B"];

export default function ContasScreen() {
  const theme = useTheme();
  const accounts = useAccountsStore((s) => s.items);
  const addAccount = useAccountsStore((s) => s.add);
  const removeAccount = useAccountsStore((s) => s.remove);
  const currency = useSettingsStore((s) => s.currency);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<"corrente" | "poupanca" | "cartao" | "dinheiro">("corrente");
  const [color, setColor] = useState(COLOR_PRESETS[0]);

  function handleCreate() {
    if (!name.trim()) return;
    const icon = TYPE_OPTIONS.find((t) => t.value === type)?.icon ?? "wallet";
    addAccount({ name: name.trim(), type, balance: 0, color, icon });
    setName("");
    setShowForm(false);
  }

  const total = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <ScreenContainer safeTop={false}>
      <Card gradient={theme.heroGradient}>
        <Text style={[styles.summaryLabel, { color: "rgba(255,255,255,0.85)" }]}>Saldo total em contas</Text>
        <Text style={styles.summaryValue}>{formatCurrency(total, currency)}</Text>
      </Card>

      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.textPrimary, fontWeight: theme.headingWeight }]}>
          Minhas contas
        </Text>
        <TouchableOpacity
          onPress={() => setShowForm((v) => !v)}
          style={[styles.addButton, { backgroundColor: theme.colors.accent, borderRadius: theme.radius.pill }]}
        >
          <Ionicons name={showForm ? "close" : "add"} size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {showForm ? (
        <Card>
          <FieldGroup>
            <FormField label="Nome" value={name} onChangeText={setName} placeholder="Ex: Nubank" />
            <PillSelect
              label="Tipo"
              value={type}
              onChange={(v) => setType(v as typeof type)}
              options={TYPE_OPTIONS.map((t) => ({ value: t.value, label: t.label }))}
            />
            <View>
              <Text style={{ color: theme.colors.textSecondary, fontSize: 13, fontWeight: "600", marginBottom: 6 }}>Cor</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                {COLOR_PRESETS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setColor(c)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: c,
                      borderWidth: color === c ? 2 : 0,
                      borderColor: theme.colors.textPrimary,
                    }}
                  />
                ))}
              </View>
            </View>
          </FieldGroup>
          <View style={{ marginTop: 16 }}>
            <PrimaryButton label="Adicionar conta" onPress={handleCreate} />
          </View>
        </Card>
      ) : null}

      {accounts.map((account) => (
        <Card key={account.id}>
          <View style={styles.row}>
            <IconBadge name={account.icon as keyof typeof Ionicons.glyphMap} color={account.color} size={42} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: theme.colors.textPrimary }]}>{account.name}</Text>
              <Text style={[styles.type, { color: theme.colors.textMuted }]}>
                {TYPE_OPTIONS.find((t) => t.value === account.type)?.label ?? account.type}
              </Text>
            </View>
            <Text style={[styles.balance, { color: theme.colors.textPrimary }]}>
              {formatCurrency(account.balance, currency)}
            </Text>
          </View>
          <TouchableOpacity onPress={() => removeAccount(account.id)} style={{ marginTop: 10 }}>
            <Text style={{ color: theme.colors.danger, fontSize: 12, fontWeight: "600" }}>Remover</Text>
          </TouchableOpacity>
        </Card>
      ))}

      {accounts.length === 0 ? (
        <Text style={{ color: theme.colors.textMuted, fontSize: 13 }}>Nenhuma conta cadastrada.</Text>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  summaryLabel: { fontSize: 12, fontWeight: "600" },
  summaryValue: { fontSize: 24, fontWeight: "800", color: "#FFFFFF", marginTop: 4 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 16 },
  addButton: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  name: { fontSize: 14, fontWeight: "700" },
  type: { fontSize: 12, marginTop: 2 },
  balance: { fontSize: 15, fontWeight: "700" },
});
