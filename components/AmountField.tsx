import { useState } from "react";
import { StyleSheet, Text, TextInput, View, type LayoutChangeEvent } from "react-native";
import { useTheme } from "../theme/useTheme";

type Props = {
  label: string;
  initialValue?: number;
  onChangeValue: (value: number) => void;
  prefix?: string;
  autoFocus?: boolean;
};

function centsToDisplay(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function AmountField({ label, initialValue = 0, onChangeValue, prefix, autoFocus }: Props) {
  const theme = useTheme();
  const [digits, setDigits] = useState(() => (initialValue > 0 ? String(Math.round(initialValue * 100)) : ""));
  const [prefixWidth, setPrefixWidth] = useState(0);

  function handleChangeText(text: string) {
    const cleaned = text.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
    setDigits(cleaned);
    const cents = cleaned ? parseInt(cleaned, 10) : 0;
    onChangeValue(cents / 100);
  }

  function handlePrefixLayout(event: LayoutChangeEvent) {
    setPrefixWidth(event.nativeEvent.layout.width);
  }

  const display = digits ? centsToDisplay(parseInt(digits, 10)) : "";

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
      <View style={styles.inputWrap}>
        <TextInput
          autoFocus={autoFocus}
          keyboardType="number-pad"
          value={display}
          onChangeText={handleChangeText}
          placeholder="0,00"
          placeholderTextColor={theme.colors.textMuted}
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surfaceAlt,
              color: theme.colors.textPrimary,
              borderRadius: theme.radius.md,
              borderColor: theme.colors.border,
              paddingLeft: prefix ? 14 + prefixWidth + 8 : 14,
            },
          ]}
        />
        {prefix ? (
          <View style={styles.prefixWrap} pointerEvents="none">
            <Text style={[styles.prefix, { color: theme.colors.textSecondary }]} onLayout={handlePrefixLayout}>
              {prefix}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontSize: 13, fontWeight: "600" },
  inputWrap: { position: "relative", justifyContent: "center" },
  prefixWrap: { position: "absolute", left: 14, top: 0, bottom: 0, justifyContent: "center" },
  prefix: { fontSize: 15, fontWeight: "700" },
  input: { paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, borderWidth: StyleSheet.hairlineWidth },
});
