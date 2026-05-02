import type { PropsWithChildren } from "react";
import { View } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";
import type { TeaIngredients } from "@/types/tea";
import { TeaCup } from "../tea-cup";

const RecipeCard = ({
  name,
  description,
  ingredients,
  children,
}: {
  name: string;
  description: string;
  ingredients: TeaIngredients;
} & PropsWithChildren) => {
  const theme = useTheme();

  return (
    <Surface
      mode="flat"
      style={{ borderRadius: theme.roundness * 3, overflow: "hidden" }}
    >
      <View className="gap-4 p-4">
        <View className="flex-row gap-4">
          <View className="flex-1">
            <Text variant="titleMedium">{name}</Text>
            <Text variant="bodySmall">{description}</Text>
          </View>

          <TeaCup ingredients={ingredients} />
        </View>

        <View className="flex-row items-center justify-between">
          {Object.entries(ingredients).map(([k, v]) => (
            <View className="items-center" key={k}>
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

export default RecipeCard;
