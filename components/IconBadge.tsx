import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

type Props = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size?: number;
};

export function IconBadge({ name, color, size = 40 }: Props) {
  return (
    <View
      style={[
        styles.badge,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color + "26" },
      ]}
    >
      <Ionicons name={name} size={size * 0.5} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignItems: "center", justifyContent: "center" },
});
