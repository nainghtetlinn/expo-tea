import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { useTheme } from "react-native-paper";

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: (props) => (
            <MaterialCommunityIcons name="tea" {...props} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: "Recipes",
          tabBarIcon: (props) => (
            <MaterialCommunityIcons name="book-open-variant" {...props} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "AI",
          tabBarIcon: (props) => <Ionicons name="sparkles" {...props} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: (props) => <MaterialIcons name="settings" {...props} />,
        }}
      />
    </Tabs>
  );
}
