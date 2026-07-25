import type { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View, type ScrollViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../theme/useTheme";

type Props = PropsWithChildren<{
  scroll?: boolean;
  contentStyle?: ScrollViewProps["contentContainerStyle"];
  safeTop?: boolean;
}>;

export function ScreenContainer({ children, scroll = true, contentStyle, safeTop = true }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const paddingTop = safeTop ? insets.top + 12 : 16;

  if (!scroll) {
    return (
      <View style={[styles.flex, { backgroundColor: theme.colors.background, paddingTop }]}>{children}</View>
    );
  }

  return (
    <ScrollView
      style={[styles.flex, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop }, contentStyle]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 16, paddingBottom: 40, gap: 16 },
});
