import type { PropsWithChildren } from "react";
import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import { useTheme } from "../theme/useTheme";

type Props = {
  label: string;
} & TextInputProps;

export function FormField({ label, style, ...inputProps }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
      <TextInput
        placeholderTextColor={theme.colors.textMuted}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surfaceAlt,
            color: theme.colors.textPrimary,
            borderRadius: theme.radius.md,
            borderColor: theme.colors.border,
          },
          style,
        ]}
        {...inputProps}
      />
    </View>
  );
}

export function FieldGroup({ children }: PropsWithChildren<{}>) {
  return <View style={styles.group}>{children}</View>;
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontSize: 13, fontWeight: "600" },
  input: { paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, borderWidth: StyleSheet.hairlineWidth },
  group: { gap: 14 },
});
