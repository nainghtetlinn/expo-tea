import { useTeaContext } from "@/lib/tea-context";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function MachineStatus() {
  const { t } = useTranslation();

  const { currentIngredients, targetIngredients, progress } = useTeaContext();

  return (
    <View style={styles.container}>
      <View style={styles.cup}>
        <Text style={styles.percentage}>{progress}%</Text>
      </View>

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
  cup: {
    gap: 8,
  },
  percentage: {
    textAlign: "center",
  },
});
