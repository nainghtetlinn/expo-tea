import { TeaIngredients } from "@/types/tea";
import React, { useMemo } from "react";
import { View } from "react-native";

export default function TeaGlass({
  totalHeight = 55,
  ingredients,
}: {
  totalHeight?: number;
  ingredients: TeaIngredients;
}) {
  const totalMl =
    ingredients.tea +
    ingredients.condensedMilk +
    ingredients.evaporatedMilk +
    ingredients.milk;

  const heights = useMemo(() => {
    if (totalMl == 0) return [0, 0, 0, 0];

    return [
      (ingredients.tea / totalMl) * totalHeight,
      (ingredients.condensedMilk / totalMl) * totalHeight,
      (ingredients.evaporatedMilk / totalMl) * totalHeight,
      (ingredients.milk / totalMl) * totalHeight,
    ];
  }, [totalMl, ingredients]);

  return (
    <View
      className="aspect-4/5 flex-col-reverse overflow-hidden rounded-lg border border-black"
      style={{ height: totalHeight }}
    >
      <View className="bg-[#F8E6B6]" style={{ height: heights[1] }} />
      <View className="bg-[#FDFFF5]" style={{ height: heights[2] }} />
      <View className="bg-[#E67338]" style={{ height: heights[0] }} />
      <View className="bg-[#FDFFF5]" style={{ height: heights[3] }} />
    </View>
  );
}
