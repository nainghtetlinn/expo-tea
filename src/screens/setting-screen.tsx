import LanguageSwitcher from "@/src/components/language-switcher";
import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text
        variant="headlineSmall"
        style={styles.header}
      >
        Settings
      </Text>
      <LanguageSwitcher />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 24,
    fontWeight: "bold",
  },
});
