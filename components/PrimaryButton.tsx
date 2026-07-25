import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../theme/useTheme";

type Props = {
  label: string;
  onPress: () => void;
  variant?: "solid" | "outline";
  color?: string;
  disabled?: boolean;
};

export function PrimaryButton({ label, onPress, variant = "solid", color, disabled }: Props) {
  const theme = useTheme();
  const accent = color ?? theme.colors.accent;
  const isSolid = variant === "solid";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        {
          borderRadius: theme.radius.md,
          backgroundColor: isSolid ? accent : "transparent",
          borderWidth: isSolid ? 0 : 1.5,
          borderColor: accent,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <Text style={[styles.label, { color: isSolid ? "#FFFFFF" : accent }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { paddingVertical: 14, alignItems: "center", justifyContent: "center" },
  label: { fontSize: 15, fontWeight: "700" },
});
