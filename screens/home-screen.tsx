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
      <Text>{t("ingredients.tea")}</Text>
      <Text>{t("ingredients.milk")}</Text>
      <Text>{t("ingredients.condensedMilk")}</Text>
      <Text>{t("ingredients.evaporatedMilk")}</Text>
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
