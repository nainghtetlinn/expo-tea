import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Portal, useTheme } from "react-native-paper";
import { HomeWalkthroughContent } from "@/components/home-walkthrough-content";
import { useWalkthroughStore } from "@/stores/walkthrough-store";

export default function TabsLayout() {
  const theme = useTheme();
  const seen = useWalkthroughStore((state) => state.seen);

  return (
    <>
      {!seen && (
        <Portal>
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: "rgba(0,0,0,0.5)" },
            ]}
          />
        </Portal>
      )}
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
              <HomeWalkthroughContent placement="top" step={4}>
                <MaterialCommunityIcons name="tea" {...props} />
              </HomeWalkthroughContent>
            ),
          }}
        />
        <Tabs.Screen
          name="recipes"
          options={{
            title: "Recipes",
            tabBarIcon: (props) => (
              <HomeWalkthroughContent placement="top" step={5}>
                <MaterialCommunityIcons name="book-open-variant" {...props} />
              </HomeWalkthroughContent>
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "AI",
            tabBarIcon: (props) => (
              <HomeWalkthroughContent placement="top" step={6}>
                <Ionicons name="sparkles" {...props} />
              </HomeWalkthroughContent>
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: (props) => (
              <HomeWalkthroughContent placement="top" step={7}>
                <MaterialIcons name="settings" {...props} />
              </HomeWalkthroughContent>
            ),
          }}
        />
      </Tabs>
    </>
  );
}
