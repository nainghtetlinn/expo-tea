import { Tea } from "@/types/tea";
import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";
import { TeaCup } from "../tea-cup";

export const RecipeCard = ({
  tea,
  children,
}: { tea: Tea } & PropsWithChildren) => {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const lang = i18n.language as "en" | "my";

  return (
    <Surface
      mode="flat"
      style={{ borderRadius: theme.roundness * 3, overflow: "hidden" }}
    >
      <View className="gap-4 p-4">
        <View className="flex-row gap-4">
          <View className="flex-1">
            <Text variant="titleMedium">{tea.name[lang]}</Text>
            <Text variant="bodySmall">{tea.description[lang]}</Text>
          </View>

          <TeaCup ingredients={tea.ingredients} />
        </View>

        <View className="flex-row items-center justify-between">
          {Object.entries(tea.ingredients).map(([k, v]) => (
            <View key={k} className="items-center">
              <Text variant="bodySmall">{k[0].toUpperCase()}</Text>
              <Text variant="labelSmall">{v} ml</Text>
            </View>
          ))}
        </View>

        {children}
      </View>
    </Surface>
  );
};
