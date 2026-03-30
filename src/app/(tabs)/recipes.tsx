import { RecipesScreen } from "@/screens/recipes-screen";
import React from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RecipesTab() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  return (
    <View
      className="flex-1"
      style={{
        paddingTop: insets.top,
        backgroundColor: theme.colors.background,
      }}
    >
      <View className="items-center pt-4 pb-2">
        <Text variant="titleLarge">Recipes</Text>
      </View>
      <RecipesScreen />
    </View>
  );
}
