import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useTheme } from "../theme/useTheme";

type Props = {
  value: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
};

export function StreakRing({ value, total, size = 96, strokeWidth = 10, color }: Props) {
  const theme = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? Math.max(0, Math.min(1, value / total)) : 0;
  const dashOffset = circumference * (1 - progress);
  const ringColor = color ?? theme.colors.accent;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.colors.surfaceAlt}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          fill="none"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.center]}>
        <Text style={[styles.value, { color: theme.colors.textPrimary, fontWeight: theme.headingWeight }]}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center" },
  value: { fontSize: 24 },
});
