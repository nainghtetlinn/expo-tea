import { useTeaContext } from "@/lib/tea-context";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import TeaGlass from "./tea-glass";

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
    tea: number;
    condensedMilk: number;
    evaporatedMilk: number;
    milk: number;
  };
};

export default function TeaCard({ tea }: { tea: Tea }) {
  const { makeTea } = useTeaContext();

  const { i18n } = useTranslation();
  const lang = i18n.language as "en" | "my";

  const totalMl = Object.values(tea.ingredients).reduce((t, c) => {
    return t + c;
  }, 0);

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
      <Card.Content style={styles.container}>
        <View style={styles.detailsContainer}>
          <View>
            <Text variant="titleMedium">{tea.name[lang]}</Text>
            <Text variant="bodySmall">{tea.description[lang]}</Text>
          </View>
          <View style={styles.ingredientsContainer}>
            {Object.entries(tea.ingredients).map(([k, v]) => (
              <View key={k} style={styles.item}>
                <Text variant="bodySmall">{k[0].toUpperCase()}</Text>
                <Text variant="labelSmall">{v} ml</Text>
              </View>
            ))}
          </View>
        </View>
        <TeaGlass
          totalHeight={85}
          totalMl={totalMl}
          ingredients={tea.ingredients}
        />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 24,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  ingredientsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item: {
    alignItems: "center",
  },
});
