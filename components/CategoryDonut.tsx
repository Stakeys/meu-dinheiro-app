import { PieChart } from "react-native-gifted-charts";
import { StyleSheet, Text, View } from "react-native";
import { formatCurrency, formatPercent } from "../lib/format";
import { useTheme } from "../theme/useTheme";

export type DonutSlice = { label: string; value: number; color: string };

type Props = {
  data: DonutSlice[];
  currency?: string;
  radius?: number;
};

export function CategoryDonut({ data, currency, radius = 76 }: Props) {
  const theme = useTheme();
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const chartData = data.length > 0 ? data.map((d) => ({ value: d.value, color: d.color })) : [{ value: 1, color: theme.colors.surfaceAlt }];

  return (
    <View style={styles.container}>
      <View style={styles.chartWrap}>
        <PieChart
          data={chartData}
          donut
          radius={radius}
          innerRadius={radius * 0.62}
          innerCircleColor={theme.colors.surface}
          centerLabelComponent={() => (
            <View style={styles.centerLabel}>
              <Text
                style={[styles.centerValue, { color: theme.colors.textPrimary }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.6}
              >
                {formatCurrency(total, currency)}
              </Text>
              <Text style={[styles.centerCaption, { color: theme.colors.textMuted }]}>Total</Text>
            </View>
          )}
        />
      </View>
      <View style={styles.legend}>
        {data.map((item) => (
          <View key={item.label} style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={[styles.legendLabel, { color: theme.colors.textPrimary }]} numberOfLines={1}>
              {item.label}
            </Text>
            <Text style={[styles.legendPercent, { color: theme.colors.textMuted }]}>
              {formatPercent(total > 0 ? (item.value / total) * 100 : 0)}
            </Text>
            <Text
              style={[styles.legendValue, { color: theme.colors.textSecondary }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {formatCurrency(item.value, currency)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", gap: 16 },
  chartWrap: { alignItems: "center", justifyContent: "center" },
  centerLabel: { alignItems: "center", justifyContent: "center", maxWidth: 90 },
  centerValue: { fontSize: 13, fontWeight: "700" },
  centerCaption: { fontSize: 11, marginTop: 2 },
  legend: { flex: 1, gap: 8 },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  legendLabel: { flex: 1, fontSize: 12, fontWeight: "600" },
  legendPercent: { fontSize: 11, width: 34, textAlign: "right" },
  legendValue: { fontSize: 11, width: 74, textAlign: "right" },
});
