import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card } from "../../../components/Card";
import { FieldGroup, FormField } from "../../../components/FormField";
import { PillSelect } from "../../../components/PillSelect";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { formatCurrency, formatPercent } from "../../../lib/format";
import { useInvestmentsStore } from "../../../store/useInvestmentsStore";
import { useSettingsStore } from "../../../store/useSettingsStore";
import { useTheme } from "../../../theme/useTheme";

const TYPE_OPTIONS = [
  { value: "renda_fixa", label: "Renda Fixa" },
  { value: "renda_variavel", label: "Renda Variável" },
  { value: "fundos", label: "Fundos" },
  { value: "cripto", label: "Cripto" },
  { value: "outro", label: "Outro" },
];

export default function InvestimentosScreen() {
  const theme = useTheme();
  const investments = useInvestmentsStore((s) => s.items);
  const addInvestment = useInvestmentsStore((s) => s.add);
  const removeInvestment = useInvestmentsStore((s) => s.remove);
  const currency = useSettingsStore((s) => s.currency);

  const totalInvested = investments.reduce((sum, i) => sum + i.invested_amount, 0);
  const totalCurrent = investments.reduce((sum, i) => sum + i.current_amount, 0);
  const totalReturn = totalInvested > 0 ? ((totalCurrent - totalInvested) / totalInvested) * 100 : 0;

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("renda_fixa");
  const [invested, setInvested] = useState("");
  const [current, setCurrent] = useState("");

  function handleCreate() {
    const investedValue = Number(invested.replace(",", "."));
    const currentValue = Number((current || invested).replace(",", "."));
    if (!name.trim() || !investedValue || investedValue <= 0) return;
    addInvestment({
      name: name.trim(),
      type,
      invested_amount: investedValue,
      current_amount: currentValue,
      date: format(new Date(), "yyyy-MM-dd"),
    });
    setName("");
    setInvested("");
    setCurrent("");
    setShowForm(false);
  }

  return (
    <ScreenContainer safeTop={false}>
      <Card gradient={theme.heroGradient}>
        <Text style={[styles.summaryLabel, { color: "rgba(255,255,255,0.85)" }]}>Total investido</Text>
        <Text style={styles.summaryValue}>{formatCurrency(totalCurrent, currency)}</Text>
        <Text style={[styles.summaryReturn, { color: totalReturn >= 0 ? "#BBF7D0" : "#FECACA" }]}>
          {totalReturn >= 0 ? "+" : ""}
          {formatPercent(totalReturn)} sobre {formatCurrency(totalInvested, currency)} aportados
        </Text>
      </Card>

      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.textPrimary, fontWeight: theme.headingWeight }]}>
          Meus investimentos
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
            <FormField label="Nome" value={name} onChangeText={setName} placeholder="Ex: Tesouro Selic" />
            <PillSelect label="Tipo" value={type} onChange={setType} options={TYPE_OPTIONS} />
            <FormField label="Valor investido" keyboardType="decimal-pad" value={invested} onChangeText={setInvested} placeholder="0,00" />
            <FormField label="Valor atual (opcional)" keyboardType="decimal-pad" value={current} onChangeText={setCurrent} placeholder="0,00" />
          </FieldGroup>
          <View style={{ marginTop: 16 }}>
            <PrimaryButton label="Adicionar" onPress={handleCreate} />
          </View>
        </Card>
      ) : null}

      {investments.map((investment) => {
        const returnPct =
          investment.invested_amount > 0
            ? ((investment.current_amount - investment.invested_amount) / investment.invested_amount) * 100
            : 0;
        const typeLabel = TYPE_OPTIONS.find((t) => t.value === investment.type)?.label ?? investment.type;
        const positive = returnPct >= 0;

        return (
          <Card key={investment.id}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: theme.colors.textPrimary }]}>{investment.name}</Text>
                <Text style={[styles.type, { color: theme.colors.textMuted }]}>{typeLabel}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={[styles.value, { color: theme.colors.textPrimary }]}>
                  {formatCurrency(investment.current_amount, currency)}
                </Text>
                <Text style={{ color: positive ? theme.colors.success : theme.colors.danger, fontSize: 12, fontWeight: "700" }}>
                  {positive ? "+" : ""}
                  {formatPercent(returnPct)}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => removeInvestment(investment.id)} style={{ marginTop: 10 }}>
              <Text style={{ color: theme.colors.danger, fontSize: 12, fontWeight: "600" }}>Remover</Text>
            </TouchableOpacity>
          </Card>
        );
      })}

      {investments.length === 0 ? (
        <Text style={{ color: theme.colors.textMuted, fontSize: 13 }}>Nenhum investimento ainda.</Text>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  summaryLabel: { fontSize: 12, fontWeight: "600" },
  summaryValue: { fontSize: 24, fontWeight: "800", color: "#FFFFFF", marginTop: 4 },
  summaryReturn: { fontSize: 12, marginTop: 6, fontWeight: "600" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 16 },
  addButton: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row", alignItems: "flex-start" },
  name: { fontSize: 14, fontWeight: "700" },
  type: { fontSize: 12, marginTop: 2 },
  value: { fontSize: 14, fontWeight: "700" },
});
