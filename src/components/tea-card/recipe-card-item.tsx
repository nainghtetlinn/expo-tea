import { TeaIngredients } from "@/types/tea";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";
import { TeaCup } from "../tea-cup";

export const RecipeCardItem = ({
  name,
  ingredients,
}: {
  name: string;
  ingredients: TeaIngredients;
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Surface
      mode="flat"
      style={{ borderRadius: theme.roundness * 3, overflow: "hidden" }}
    >
      <View className="flex-row gap-4 p-4">
        <View className="pt-2">
          <TeaCup ingredients={ingredients} totalHeight={60} />
        </View>
        <View className="flex-1">
          <Text variant="titleMedium">{name}</Text>
          <View className="mt-2">
            {Object.entries(ingredients)
              .filter(([, v]) => v > 0)
              .map(([k, v]) => (
                <View key={k} className="flex-row items-center justify-between">
                  <Text variant="bodySmall">{t(`ingredients.${k}`)}</Text>
                  <Text variant="bodySmall">{v} ml</Text>
                </View>
              ))}
          </View>
        </View>
      </View>
    </Surface>
  );
};
