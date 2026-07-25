import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../theme/useTheme";

type Props = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, actionLabel, onAction }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <Text style={[styles.title, { color: theme.colors.textPrimary, fontWeight: theme.headingWeight }]}>
        {title}
      </Text>
      {actionLabel ? (
        <TouchableOpacity onPress={onAction}>
          <Text style={[styles.action, { color: theme.colors.accent }]}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 15 },
  action: { fontSize: 12, fontWeight: "600" },
});
