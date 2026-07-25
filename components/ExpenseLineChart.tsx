import { LineChart } from "react-native-gifted-charts";
import { useWindowDimensions } from "react-native";
import { useTheme } from "../theme/useTheme";

export type LinePoint = { label: string; value: number };

type Props = {
  data: LinePoint[];
};

export function ExpenseLineChart({ data }: Props) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const chartWidth = Math.min(width - 96, 320);
  const spacing = data.length > 1 ? chartWidth / (data.length - 1) : chartWidth;

  return (
    <LineChart
      data={data.map((d) => ({ value: d.value, label: d.label }))}
      color={theme.colors.accent}
      thickness={3}
      curved
      areaChart
      startFillColor={theme.colors.accent}
      endFillColor={theme.colors.accent}
      startOpacity={0.28}
      endOpacity={0.02}
      hideRules
      hideYAxisText
      xAxisColor={theme.colors.border}
      xAxisLabelTextStyle={{ color: theme.colors.textMuted, fontSize: 11 }}
      dataPointsColor={theme.colors.accent}
      dataPointsRadius={4}
      noOfSections={4}
      spacing={spacing}
      initialSpacing={12}
      endSpacing={12}
      width={chartWidth}
      adjustToWidth
    />
  );
}
