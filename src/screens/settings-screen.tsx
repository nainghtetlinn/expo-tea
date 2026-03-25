import LanguageSwitcher from "@/components/language-switcher";
import React from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

export function SettingsScreen() {
  const theme = useTheme();

  return (
    <View
      className="flex-1 p-4"
      style={{
        backgroundColor: theme.colors.background,
      }}
    >
      <LanguageSwitcher />
    </View>
  );
}
