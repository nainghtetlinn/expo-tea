import TeaList from "@/components/tea-list";
import { recipes } from "@/constants/Recipes";
import React from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

export function RecipesScreen() {
  const theme = useTheme();

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: theme.colors.background,
      }}
    >
      <TeaList teas={recipes} />
    </View>
  );
}
