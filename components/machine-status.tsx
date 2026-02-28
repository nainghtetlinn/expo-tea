import { useTeaContext } from "@/utils/tea-context";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import TeaProgress from "./tea-progress";

export default function MachineStatus() {
  const { t } = useTranslation();

  const { currentIngredients, targetIngredients } = useTeaContext();

  return (
    <View style={styles.container}>
      <TeaProgress />

      <View>
        <Text>
          {t("ingredients.tea")}: {currentIngredients.tea}/
          {targetIngredients.tea}
        </Text>
        <Text>
          {t("ingredients.condensedMilk")}: {currentIngredients.condensedMilk}/
          {targetIngredients.condensedMilk}
        </Text>
        <Text>
          {t("ingredients.evaporatedMilk")}: {currentIngredients.evaporatedMilk}
          /{targetIngredients.evaporatedMilk}
        </Text>
        <Text>
          {t("ingredients.milk")}: {currentIngredients.milk}/
          {targetIngredients.milk}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    paddingBottom: 12,
  },
});
