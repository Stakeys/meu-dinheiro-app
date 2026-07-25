import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";
import { formatCurrency, formatPercent } from "../lib/format";
import { useTheme } from "../theme/useTheme";
import { Card } from "./Card";
import { IconBadge } from "./IconBadge";
import { ProgressBar } from "./ProgressBar";

type Props = {
  name: string;
  current: number;
  target: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  currency?: string;
  compact?: boolean;
  imageUri?: string | null;
};

export function GoalCard({ name, current, target, icon, color, currency, compact, imageUri }: Props) {
  const theme = useTheme();
  const progress = target > 0 ? (current / target) * 100 : 0;

  if (compact) {
    return (
      <View style={styles.compactRow}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.compactImage} />
        ) : (
          <IconBadge name={icon} color={color} size={36} />
        )}
        <View style={styles.compactInfo}>
          <View style={styles.compactHeader}>
            <Text style={[styles.name, { color: theme.colors.textPrimary }]} numberOfLines={1}>
              {name}
            </Text>
            <Text style={[styles.percent, { color }]}>{formatPercent(progress)}</Text>
          </View>
          <ProgressBar progress={progress} color={color} height={6} />
          <Text style={[styles.amounts, { color: theme.colors.textMuted }]}>
            {formatCurrency(current, currency)} / {formatCurrency(target, currency)}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <Card style={styles.card} padding={imageUri ? 0 : 16}>
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.coverImage} /> : null}
      <View style={{ padding: imageUri ? 14 : 0 }}>
        <View style={styles.header}>
          {imageUri ? <View /> : <IconBadge name={icon} color={color} size={44} />}
          <Text style={[styles.percent, { color }]}>{formatPercent(progress)}</Text>
        </View>
        <Text style={[styles.name, { color: theme.colors.textPrimary, marginTop: imageUri ? 0 : 10 }]}>{name}</Text>
        <View style={{ marginTop: 8 }}>
          <ProgressBar progress={progress} color={color} />
        </View>
        <Text style={[styles.amounts, { color: theme.colors.textMuted, marginTop: 6 }]}>
          {formatCurrency(current, currency)} / {formatCurrency(target, currency)}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { minWidth: 180 },
  coverImage: { width: "100%", height: 130 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  name: { fontSize: 14, fontWeight: "700" },
  percent: { fontSize: 13, fontWeight: "700" },
  amounts: { fontSize: 12 },
  compactRow: { flexDirection: "row", gap: 12, alignItems: "center", paddingVertical: 8 },
  compactImage: { width: 36, height: 36, borderRadius: 10 },
  compactInfo: { flex: 1, gap: 6 },
  compactHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});
