import { useTeaContext } from "@/lib/tea-context";
import { Tea } from "@/types/tea";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Card, Text } from "react-native-paper";
import TeaGlass from "./tea-glass";

export default function TeaCard({ tea }: { tea: Tea }) {
  const { makeTea } = useTeaContext();

  const { i18n } = useTranslation();
  const lang = i18n.language as "en" | "my";

  return (
    <Card
      onPress={() => {
        makeTea(tea);
      }}
    >
      <View className="flex flex-row gap-4 p-4">
        <View className="flex-1">
          <View className="pb-4">
            <Text variant="titleMedium">{tea.name[lang]}</Text>
            <Text variant="bodySmall">{tea.description[lang]}</Text>
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

        <TeaGlass ingredients={tea.ingredients} />
      </View>
    </Card>
  );
}
