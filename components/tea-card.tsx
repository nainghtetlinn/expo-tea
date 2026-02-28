import { useTeaContext } from "@/utils/tea-context";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";

type Tea = {
  id: number;
  name: {
    en: string;
    my: string;
  };
  description: {
    en: string;
    my: string;
  };
  ingredients: {
    tea?: number;
    condensedMilk?: number;
    evaporatedMilk?: number;
    milk?: number;
  };
};

export default function TeaCard({ tea }: { tea: Tea }) {
  const { makeTea } = useTeaContext();

  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "my";

  return (
    <Card
      onPress={() => {
        makeTea({
          tea: tea.ingredients.tea || 0,
          condensedMilk: tea.ingredients.condensedMilk || 0,
          evaporatedMilk: tea.ingredients.evaporatedMilk || 0,
          milk: tea.ingredients.milk || 0,
        });
      }}
    >
      <Card.Title
        title={`${tea.id}. ${tea.name[lang]}`}
        subtitle={tea.description[lang]}
        titleVariant="titleLarge"
        subtitleVariant="bodySmall"
      />
      <Card.Content>
        {Object.entries(tea.ingredients).map(([k, v]) => (
          <View
            key={k}
            style={styles.item}
          >
            <Text variant="labelMedium">{t("ingredients." + k)}</Text>
            <Text variant="bodyMedium">{v} ml</Text>
          </View>
        ))}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
