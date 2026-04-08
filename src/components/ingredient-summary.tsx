import { TeaIngredients } from "@/types/tea";
import { View } from "react-native";
import { Text } from "react-native-paper";

export const IngredientSummary = ({
  ingredients,
}: {
  ingredients: TeaIngredients;
}) => {
  return (
    <View className="flex-row items-center justify-between">
      {Object.entries(ingredients).map(([k, v]) => (
        <View key={k} className="items-center">
          <Text variant="bodySmall">{k[0].toUpperCase()}</Text>
          <Text variant="labelSmall">{v} ml</Text>
        </View>
      ))}
    </View>
  );
};
