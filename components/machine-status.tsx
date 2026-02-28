import { useTeaContext } from "@/utils/tea-context";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function MachineStatus() {
  const { t } = useTranslation();

  const { currentIngredients, targetIngredients, progress } = useTeaContext();

  return (
    <View>
      <Text>{progress}%</Text>

      <Text>
        {t("ingredients.tea")}: {currentIngredients.tea}/{targetIngredients.tea}
      </Text>
      <Text>
        {t("ingredients.condensedMilk")}: {currentIngredients.condensedMilk}/
        {targetIngredients.condensedMilk}
      </Text>
      <Text>
        {t("ingredients.evaporatedMilk")}: {currentIngredients.evaporatedMilk}/
        {targetIngredients.evaporatedMilk}
      </Text>
      <Text>
        {t("ingredients.milk")}: {currentIngredients.milk}/
        {targetIngredients.milk}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
