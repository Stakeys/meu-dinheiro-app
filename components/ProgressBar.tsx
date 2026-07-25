import { StyleSheet, View } from "react-native";
import { useTheme } from "../theme/useTheme";

type Props = {
  progress: number;
  color?: string;
  height?: number;
};

export function ProgressBar({ progress, color, height = 8 }: Props) {
  const theme = useTheme();
  const clamped = Math.max(0, Math.min(100, progress));

  return (
    <View
      style={[
        styles.track,
        { backgroundColor: theme.colors.surfaceAlt, height, borderRadius: theme.radius.pill },
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clamped}%`,
            backgroundColor: color ?? theme.colors.accent,
            borderRadius: theme.radius.pill,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: "100%", overflow: "hidden" },
  fill: { height: "100%" },
});
