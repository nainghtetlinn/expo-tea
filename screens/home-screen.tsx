import LanguageSwitcher from "@/components/language-switcher";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { t, i18n } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <Text
        variant="headlineSmall"
        style={styles.header}
      >
        Tea Mixer
      </Text>
      <Text>{t("recipe_header.tea")}</Text>
      <Text>{t("recipe_header.milk")}</Text>
      <Text>{t("recipe_header.c_milk")}</Text>
      <Text>{t("recipe_header.e_milk")}</Text>

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
