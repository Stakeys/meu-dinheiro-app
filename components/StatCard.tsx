import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/useTheme";
import { Card } from "./Card";
import { ProgressBar } from "./ProgressBar";

type Props = {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  footnote?: string;
  progress?: number;
  progressColor?: string;
  gradient?: [string, string, ...string[]];
  emphasis?: boolean;
};

export function StatCard({ label, value, icon, footnote, progress, progressColor, gradient, emphasis }: Props) {
  const theme = useTheme();
  const onGradient = Boolean(gradient) || emphasis;
  const textColor = onGradient ? "#FFFFFF" : theme.colors.textPrimary;
  const subColor = onGradient ? "rgba(255,255,255,0.8)" : theme.colors.textSecondary;

  return (
    <Card gradient={gradient ?? (emphasis ? theme.heroGradient : undefined)} style={styles.card}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: subColor }]}>{label}</Text>
        <Ionicons name={icon} size={18} color={subColor} />
      </View>
      <Text
        style={[styles.value, { color: textColor, fontWeight: theme.headingWeight }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.6}
      >
        {value}
      </Text>
      {footnote ? <Text style={[styles.footnote, { color: subColor }]}>{footnote}</Text> : null}
      {progress !== undefined ? (
        <View style={styles.progressWrap}>
          <ProgressBar progress={progress} color={progressColor ?? (onGradient ? "#FFFFFF" : theme.colors.accent)} />
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 150 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  label: { fontSize: 13, fontWeight: "600" },
  value: { fontSize: 20, marginBottom: 4 },
  footnote: { fontSize: 12 },
  progressWrap: { marginTop: 10 },
});
