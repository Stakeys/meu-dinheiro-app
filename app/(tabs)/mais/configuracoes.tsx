import { Ionicons } from "@expo/vector-icons";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card } from "../../../components/Card";
import { FormField } from "../../../components/FormField";
import { PillSelect } from "../../../components/PillSelect";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { pickImage } from "../../../lib/images";
import { seedDemoData, clearAllData } from "../../../store/useAppInit";
import { useSettingsStore } from "../../../store/useSettingsStore";
import { THEME_LIST } from "../../../theme/tokens";
import { useTheme } from "../../../theme/useTheme";

const CURRENCY_OPTIONS = [
  { value: "BRL", label: "Real (R$)" },
  { value: "USD", label: "Dólar (US$)" },
  { value: "EUR", label: "Euro (€)" },
];

export default function ConfiguracoesScreen() {
  const theme = useTheme();
  const settings = useSettingsStore();

  async function handlePickAvatar() {
    const uri = await pickImage("Foto de perfil");
    if (uri) settings.setAvatar(uri);
  }

  function handleSeed() {
    Alert.alert("Carregar dados de exemplo", "Isso vai substituir todos os dados atuais por dados de demonstração. Continuar?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Carregar", style: "default", onPress: () => seedDemoData() },
    ]);
  }

  function handleClear() {
    Alert.alert("Limpar todos os dados", "Isso vai apagar contas, transações, metas, orçamentos e investimentos. Essa ação não pode ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Limpar", style: "destructive", onPress: () => clearAllData() },
    ]);
  }

  return (
    <ScreenContainer safeTop={false}>
      <Card>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Tema visual</Text>
        <Text style={[styles.sectionSubtitle, { color: theme.colors.textMuted }]}>
          Teste os 3 estilos e escolha o que mais combina com você.
        </Text>
        <View style={{ marginTop: 12, gap: 10 }}>
          {THEME_LIST.map((t) => {
            const selected = t.name === settings.theme;
            return (
              <TouchableOpacity key={t.name} onPress={() => settings.setTheme(t.name)}>
                <View
                  style={[
                    styles.themeRow,
                    {
                      backgroundColor: t.colors.background,
                      borderRadius: theme.radius.md,
                      borderWidth: selected ? 2 : 1,
                      borderColor: selected ? theme.colors.accent : theme.colors.border,
                    },
                  ]}
                >
                  <View style={styles.swatches}>
                    <View style={[styles.swatch, { backgroundColor: t.heroGradient[0] }]} />
                    <View style={[styles.swatch, { backgroundColor: t.heroGradient[1] }]} />
                    <View style={[styles.swatch, { backgroundColor: t.colors.accent }]} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.themeName, { color: t.colors.textPrimary }]}>{t.label}</Text>
                    <Text style={[styles.themeDesc, { color: t.colors.textSecondary }]}>
                      {t.name === "clarity" && "Minimalista, estilo Apple"}
                      {t.name === "pulse" && "Cyberpunk, neon e vibrante"}
                      {t.name === "story" && "Acolhedor, estilo storytelling"}
                    </Text>
                  </View>
                  {selected ? <Ionicons name="checkmark-circle" size={22} color={theme.colors.accent} /> : null}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      <Card>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Perfil</Text>
        <View style={{ marginTop: 12, alignItems: "center" }}>
          <TouchableOpacity onPress={handlePickAvatar}>
            {settings.avatar_uri ? (
              <Image source={{ uri: settings.avatar_uri }} style={[styles.avatar, { borderColor: theme.colors.accent }]} />
            ) : (
              <View style={[styles.avatarFallback, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.accent }]}>
                <Ionicons name="camera" size={22} color={theme.colors.textMuted} />
              </View>
            )}
          </TouchableOpacity>
          <Text style={{ color: theme.colors.textMuted, fontSize: 12, marginTop: 8 }}>Toque para trocar a foto</Text>
        </View>
        <View style={{ marginTop: 16, gap: 14 }}>
          <FormField label="Seu nome" value={settings.user_name} onChangeText={settings.setUserName} />
          <PillSelect label="Moeda" value={settings.currency} onChange={(v) => settings.setCurrency(v)} options={CURRENCY_OPTIONS} />
        </View>
      </Card>

      <Card>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Dados</Text>
        <Text style={[styles.sectionSubtitle, { color: theme.colors.textMuted }]}>
          Todos os dados ficam salvos apenas neste dispositivo.
        </Text>
        <View style={{ marginTop: 14, gap: 10 }}>
          <PrimaryButton label="Carregar dados de exemplo" variant="outline" onPress={handleSeed} />
          <PrimaryButton label="Limpar todos os dados" variant="outline" color={theme.colors.danger} onPress={handleClear} />
        </View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 15, fontWeight: "700" },
  sectionSubtitle: { fontSize: 12, marginTop: 4 },
  themeRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12 },
  swatches: { flexDirection: "row", gap: 4 },
  swatch: { width: 12, height: 28, borderRadius: 4 },
  themeName: { fontSize: 14, fontWeight: "700" },
  themeDesc: { fontSize: 11, marginTop: 2 },
  avatar: { width: 84, height: 84, borderRadius: 42, borderWidth: 2 },
  avatarFallback: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
