import { Ionicons } from "@expo/vector-icons";
import { Fragment } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";
import { formatCurrency, formatPercent } from "../lib/format";
import { useTheme } from "../theme/useTheme";
import { Card } from "./Card";
import { IconBadge } from "./IconBadge";

export type FlowBucket = {
  key: string;
  label: string;
  value: number;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type Props = {
  income: number;
  available: number;
  buckets: FlowBucket[];
  savingsPercent: number;
  currency?: string;
};

const ROW_HEIGHT = 52;
const GUTTER_WIDTH = 24;

export function MoneyFlowWidget({ income, available, buckets, savingsPercent, currency }: Props) {
  const theme = useTheme();
  const total = buckets.reduce((sum, b) => sum + b.value, 0);
  const spineX = GUTTER_WIDTH / 2;
  const svgHeight = buckets.length * ROW_HEIGHT;

  return (
    <Card>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.colors.textPrimary, fontWeight: theme.headingWeight }]}>
          Fluxo do Dinheiro
        </Text>
        <Ionicons name="information-circle-outline" size={16} color={theme.colors.textMuted} />
      </View>

      <View style={styles.topRow}>
        <View style={[styles.pill, { backgroundColor: theme.colors.surfaceAlt }]}>
          <IconBadge name="wallet-outline" color={theme.colors.textSecondary} size={32} />
          <View>
            <Text style={[styles.pillLabel, { color: theme.colors.textMuted }]}>Receitas</Text>
            <Text style={[styles.pillValue, { color: theme.colors.textPrimary }]} numberOfLines={1}>
              {formatCurrency(income, currency)}
            </Text>
          </View>
        </View>

        <Ionicons name="arrow-forward" size={18} color={theme.colors.textMuted} />

        <View style={[styles.hub, { borderColor: theme.colors.accent }]}>
          <View
            style={[
              styles.hubInner,
              { backgroundColor: theme.dark ? theme.colors.surfaceAlt : theme.colors.accent + "14" },
            ]}
          >
            <Text style={[styles.hubLabel, { color: theme.colors.textMuted }]}>Saldo</Text>
            <Text
              style={[styles.hubValue, { color: theme.colors.accent }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.6}
            >
              {formatCurrency(available, currency)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.flowBody}>
        <Svg width={GUTTER_WIDTH} height={svgHeight}>
          <Line x1={spineX} y1={0} x2={spineX} y2={svgHeight} stroke={theme.colors.border} strokeWidth={2} />
          {buckets.map((bucket, index) => {
            const y = index * ROW_HEIGHT + ROW_HEIGHT / 2;
            return (
              <Fragment key={bucket.key}>
                <Line x1={spineX} y1={y} x2={GUTTER_WIDTH} y2={y} stroke={bucket.color} strokeWidth={2} />
                <Circle cx={spineX} cy={y} r={4} fill={bucket.color} />
              </Fragment>
            );
          })}
        </Svg>
        <View style={styles.rowsColumn}>
          {buckets.map((bucket) => (
            <View key={bucket.key} style={[styles.bucketRow, { height: ROW_HEIGHT }]}>
              <IconBadge name={bucket.icon} color={bucket.color} size={34} />
              <Text style={[styles.bucketLabel, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                {bucket.label}
              </Text>
              <Text style={[styles.bucketPercent, { color: bucket.color }]}>
                {formatPercent(total > 0 ? (bucket.value / total) * 100 : 0)}
              </Text>
              <Text
                style={[styles.bucketValue, { color: theme.colors.textSecondary }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                {formatCurrency(bucket.value, currency)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
        {savingsPercent > 0 ? (
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            Você economizou <Text style={{ color: theme.colors.success, fontWeight: "700" }}>{formatPercent(savingsPercent)}</Text> da
            sua renda! 🎉
          </Text>
        ) : (
          <Text style={[styles.footerText, { color: theme.colors.warning }]}>
            Atenção: suas despesas superaram as receitas este mês.
          </Text>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  title: { fontSize: 15 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  pill: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8, padding: 10, borderRadius: 14 },
  pillLabel: { fontSize: 11 },
  pillValue: { fontSize: 13, fontWeight: "700" },
  hub: { borderRadius: 999, borderWidth: 2, padding: 3 },
  hubInner: {
    borderRadius: 999,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  hubLabel: { fontSize: 10 },
  hubValue: { fontSize: 13, fontWeight: "800", marginTop: 2 },
  flowBody: { flexDirection: "row" },
  rowsColumn: { flex: 1 },
  bucketRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  bucketLabel: { flex: 1, fontSize: 13, fontWeight: "600" },
  bucketPercent: { fontSize: 12, fontWeight: "700", width: 36, textAlign: "right" },
  bucketValue: { fontSize: 11, width: 84, textAlign: "right" },
  footer: { borderTopWidth: StyleSheet.hairlineWidth, marginTop: 14, paddingTop: 10 },
  footerText: { fontSize: 12, textAlign: "center" },
});
