import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../theme/useTheme";

export type PillOption = { value: string; label: string; color?: string };

type Props = {
  label?: string;
  options: PillOption[];
  value: string | null;
  onChange: (value: string) => void;
};

export function PillSelect({ label, options, value, onChange }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {options.map((option) => {
          const selected = option.value === value;
          const accent = option.color ?? theme.colors.accent;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onChange(option.value)}
              style={[
                styles.pill,
                {
                  backgroundColor: selected ? accent : theme.colors.surfaceAlt,
                  borderRadius: theme.radius.pill,
                  borderColor: selected ? accent : theme.colors.border,
                },
              ]}
            >
              <Text style={[styles.pillText, { color: selected ? "#FFFFFF" : theme.colors.textSecondary }]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontSize: 13, fontWeight: "600" },
  row: { gap: 8, paddingVertical: 2 },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: StyleSheet.hairlineWidth },
  pillText: { fontSize: 13, fontWeight: "600" },
});
