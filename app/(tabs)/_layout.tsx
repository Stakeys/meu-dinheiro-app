import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { useTheme } from "../../theme/useTheme";

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="transacoes"
        options={{
          title: "Transações",
          tabBarIcon: ({ color, size }) => <Ionicons name="list" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" color={color} size={size + 12} />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("/transacao/nova");
          },
        }}
      />
      <Tabs.Screen
        name="metas"
        options={{
          title: "Metas",
          tabBarIcon: ({ color, size }) => <Ionicons name="flag" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="mais"
        options={{
          title: "Mais",
          tabBarIcon: ({ color, size }) => <Ionicons name="menu" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
