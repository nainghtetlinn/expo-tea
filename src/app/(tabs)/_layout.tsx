import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Portal, useTheme } from "react-native-paper";
import { HomeWalkthroughContent } from "@/components/home-walkthrough-content";
import { useWalkthroughStore } from "@/stores/walkthrough-store";

export default function TabsLayout() {
  const theme = useTheme();
  const seen = useWalkthroughStore((state) => state.seen);

  const tabParentWrapperStyle = { flex: 1 };
  const tabChildrenWrapperStyle = { backgroundColor: theme.colors.background };

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
              <MaterialCommunityIcons name="tea" {...props} />
            ),
            tabBarButton: (props) => (
              <HomeWalkthroughContent
                childrenWrapperStyle={tabChildrenWrapperStyle}
                parentWrapperStyle={tabParentWrapperStyle}
                placement="top"
                step={4}
              >
                <Pressable {...(props as any)} />
              </HomeWalkthroughContent>
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
            tabBarButton: (props) => (
              <HomeWalkthroughContent
                childrenWrapperStyle={tabChildrenWrapperStyle}
                parentWrapperStyle={tabParentWrapperStyle}
                placement="top"
                step={5}
              >
                <Pressable {...(props as any)} />
              </HomeWalkthroughContent>
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "AI",
            tabBarIcon: (props) => <Ionicons name="sparkles" {...props} />,
            tabBarButton: (props) => (
              <HomeWalkthroughContent
                childrenWrapperStyle={tabChildrenWrapperStyle}
                parentWrapperStyle={tabParentWrapperStyle}
                placement="top"
                step={6}
              >
                <Pressable {...(props as any)} />
              </HomeWalkthroughContent>
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: (props) => <MaterialIcons name="settings" {...props} />,
            tabBarButton: (props) => (
              <HomeWalkthroughContent
                childrenWrapperStyle={tabChildrenWrapperStyle}
                parentWrapperStyle={tabParentWrapperStyle}
                placement="top"
                step={7}
              >
                <Pressable {...(props as any)} />
              </HomeWalkthroughContent>
            ),
          }}
        />
      </Tabs>
    </>
  );
}
