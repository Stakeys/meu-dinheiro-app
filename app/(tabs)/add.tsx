import { View } from "react-native";

// Nunca renderizado: o tabPress é interceptado em (tabs)/_layout.tsx e abre o modal de nova transação.
export default function AddTabPlaceholder() {
  return <View />;
}
