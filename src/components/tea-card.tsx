import { useTeaContext } from "@/lib/tea-context";
import { Tea } from "@/types/tea";
import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { TeaCup } from "./tea-cup";

export default function TeaCard({ tea }: { tea: Tea }) {
  const { makeTea } = useTeaContext();

  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "my";

  const handlePress = () => {
    const ingredientsText = Object.entries(tea.ingredients)
      .map(([k, v]) => `${t("ingredients." + k)}: ${v} ml\n`)
      .join("");
    Alert.alert(
      "Confirm Tea Preparation",
      `Are you sure you want to make "${tea.name[lang]}"?\n\n${ingredientsText}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => makeTea(tea) },
      ],
    );
  };

  return (
    <Card onPress={handlePress}>
      <View className="flex flex-row gap-4 p-4">
        <View className="flex-1">
          <View className="mb-4 flex flex-row gap-4">
            <View className="flex-1">
              <Text variant="titleMedium">{tea.name[lang]}</Text>
              <Text variant="bodySmall">{tea.description[lang]}</Text>
            </View>
            <TeaCup ingredients={tea.ingredients} />
          </View>
          <View className="flex flex-row items-center justify-between">
            {Object.entries(tea.ingredients).map(([k, v]) => (
              <View key={k} className="items-center">
                <Text variant="bodySmall">{k[0].toUpperCase()}</Text>
                <Text variant="labelSmall">{v} ml</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Card>
  );
}
