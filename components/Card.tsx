import { LinearGradient } from "expo-linear-gradient";
import type { PropsWithChildren } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { useTheme } from "../theme/useTheme";

type Props = PropsWithChildren<{
  gradient?: [string, string, ...string[]];
  style?: ViewStyle;
  padding?: number;
}>;

export function Card({ children, gradient, style, padding = 16 }: Props) {
  const theme = useTheme();
  const colors = gradient ?? theme.cardGradient;

  return (
    <View
      style={[
        styles.wrapper,
        {
          borderRadius: theme.radius.lg,
          borderColor: theme.glow ? theme.colors.accent + "40" : theme.colors.border,
          borderWidth: theme.glow ? 1 : StyleSheet.hairlineWidth,
          shadowColor: theme.shadow.shadowColor,
          shadowOpacity: theme.shadow.shadowOpacity,
          shadowRadius: theme.shadow.shadowRadius,
          shadowOffset: theme.shadow.shadowOffset,
          elevation: theme.shadow.elevation,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { borderRadius: theme.radius.lg, padding }]}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { overflow: "visible" },
  gradient: { width: "100%", overflow: "hidden" },
});
