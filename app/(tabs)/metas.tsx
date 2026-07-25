import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card } from "../../components/Card";
import { FieldGroup, FormField } from "../../components/FormField";
import { GoalCard } from "../../components/GoalCard";
import { PillSelect } from "../../components/PillSelect";
import { PrimaryButton } from "../../components/PrimaryButton";
import { ScreenContainer } from "../../components/ScreenContainer";
import { pickImage } from "../../lib/images";
import { useGoalsStore } from "../../store/useGoalsStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useTheme } from "../../theme/useTheme";

const ICON_PRESETS: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: "airplane", label: "Viagem" },
  { icon: "home", label: "Casa" },
  { icon: "car", label: "Carro" },
  { icon: "shield-checkmark", label: "Reserva" },
  { icon: "school", label: "Estudos" },
  { icon: "gift", label: "Presente" },
  { icon: "flag", label: "Outro" },
];

export default function MetasScreen() {
  const theme = useTheme();
  const goals = useGoalsStore((s) => s.items);
  const addGoal = useGoalsStore((s) => s.add);
  const removeGoal = useGoalsStore((s) => s.remove);
  const contribute = useGoalsStore((s) => s.contribute);
  const setGoalImage = useGoalsStore((s) => s.setImage);
  const currency = useSettingsStore((s) => s.currency);

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

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [iconChoice, setIconChoice] = useState<keyof typeof Ionicons.glyphMap>("flag");
  const [colorChoice, setColorChoice] = useState(colorPresets[0]);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [contributionDrafts, setContributionDrafts] = useState<Record<number, string>>({});

  async function handlePickPhoto() {
    const uri = await pickImage("Foto da meta");
    if (uri) setPhotoUri(uri);
  }

  async function handleChangeGoalPhoto(goalId: number) {
    const uri = await pickImage("Trocar foto da meta");
    if (uri) setGoalImage(goalId, uri);
  }

  function handleCreate() {
    const value = Number(target.replace(",", "."));
    if (!name.trim() || !value || value <= 0) return;
    addGoal({
      name: name.trim(),
      target_amount: value,
      current_amount: 0,
      deadline: null,
      icon: iconChoice,
      color: colorChoice,
      image_uri: photoUri,
    });
    setName("");
    setTarget("");
    setPhotoUri(null);
    setShowForm(false);
  }

  function handleContribute(goalId: number) {
    const raw = contributionDrafts[goalId];
    const value = Number((raw ?? "").replace(",", "."));
    if (!value || value <= 0) return;
    contribute(goalId, value);
    setContributionDrafts((prev) => ({ ...prev, [goalId]: "" }));
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.textPrimary, fontWeight: theme.headingWeight }]}>Metas</Text>
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
            <FormField label="Nome da meta" value={name} onChangeText={setName} placeholder="Ex: Viagem para o Japão" />
            <FormField label="Valor alvo" keyboardType="decimal-pad" value={target} onChangeText={setTarget} placeholder="0,00" />

            <View>
              <Text style={{ color: theme.colors.textSecondary, fontSize: 13, fontWeight: "600", marginBottom: 6 }}>
                Foto da meta (opcional)
              </Text>
              <TouchableOpacity onPress={handlePickPhoto}>
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={styles.photoPreview} />
                ) : (
                  <View
                    style={[
                      styles.photoPlaceholder,
                      { backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.radius.md, borderColor: theme.colors.border },
                    ]}
                  >
                    <Ionicons name="image-outline" size={22} color={theme.colors.textMuted} />
                    <Text style={{ color: theme.colors.textMuted, fontSize: 12, marginTop: 4 }}>
                      Escolha uma foto que represente sua meta
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <PillSelect
              label="Ícone"
              value={iconChoice}
              onChange={(v) => setIconChoice(v as keyof typeof Ionicons.glyphMap)}
              options={ICON_PRESETS.map((p) => ({ value: p.icon, label: p.label }))}
            />
            <View>
              <Text style={{ color: theme.colors.textSecondary, fontSize: 13, fontWeight: "600", marginBottom: 6 }}>Cor</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                {colorPresets.map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setColorChoice(color)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: color,
                      borderWidth: colorChoice === color ? 2 : 0,
                      borderColor: theme.colors.textPrimary,
                    }}
                  />
                ))}
              </View>
            </View>
          </FieldGroup>
          <View style={{ marginTop: 16 }}>
            <PrimaryButton label="Criar meta" onPress={handleCreate} />
          </View>
        </Card>
      ) : null}

      {goals.map((goal) => {
        const expanded = expandedId === goal.id;
        return (
          <View key={goal.id}>
            <TouchableOpacity onPress={() => setExpandedId(expanded ? null : goal.id)}>
              <GoalCard
                name={goal.name}
                current={goal.current_amount}
                target={goal.target_amount}
                icon={goal.icon as keyof typeof Ionicons.glyphMap}
                color={goal.color}
                currency={currency}
                imageUri={goal.image_uri}
                onAddPhoto={() => handleChangeGoalPhoto(goal.id)}
              />
            </TouchableOpacity>
            {expanded ? (
              <Card style={{ marginTop: 8 }}>
                <View style={styles.contributeRow}>
                  <View style={{ flex: 1 }}>
                    <FormField
                      label="Adicionar aporte"
                      keyboardType="decimal-pad"
                      value={contributionDrafts[goal.id] ?? ""}
                      onChangeText={(v) => setContributionDrafts((prev) => ({ ...prev, [goal.id]: v }))}
                      placeholder="0,00"
                    />
                  </View>
                  <View style={{ width: 110, marginTop: 20 }}>
                    <PrimaryButton label="Aportar" onPress={() => handleContribute(goal.id)} />
                  </View>
                </View>
                <View style={{ marginTop: 12, gap: 10 }}>
                  <PrimaryButton
                    label={goal.image_uri ? "Trocar foto" : "Adicionar foto"}
                    variant="outline"
                    onPress={() => handleChangeGoalPhoto(goal.id)}
                  />
                  <PrimaryButton
                    label="Excluir meta"
                    variant="outline"
                    color={theme.colors.danger}
                    onPress={() => {
                      removeGoal(goal.id);
                      setExpandedId(null);
                    }}
                  />
                </View>
              </Card>
            ) : null}
          </View>
        );
      })}

      {goals.length === 0 ? (
        <Text style={{ color: theme.colors.textMuted, fontSize: 13 }}>Nenhuma meta ainda. Toque em + para criar.</Text>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 22 },
  addButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  contributeRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  photoPreview: { width: "100%", height: 120, borderRadius: 12 },
  photoPlaceholder: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
});
