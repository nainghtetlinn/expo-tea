import { IngredientsType } from "@/lib/tea-context";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

export default function TeaGlass({
  totalHeight = 55,
  totalMl,
  ingredients,
}: {
  totalHeight?: number;
  totalMl: number;
  ingredients: IngredientsType;
}) {
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
    <View style={[styles.container, { height: totalHeight }]}>
      <View style={[styles.condensedMilk, { height: heights[1] }]} />
      <View style={[styles.evaporatedMilk, { height: heights[2] }]} />
      <View style={[styles.tea, { height: heights[0] }]} />
      <View style={[styles.milk, { height: heights[3] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column-reverse",
    aspectRatio: 4 / 5,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 4,
    overflow: "hidden",
  },
  tea: {
    backgroundColor: "#E67338",
  },
  condensedMilk: {
    backgroundColor: "#F8E6B6",
  },
  evaporatedMilk: {
    backgroundColor: "#FDFFF5",
  },
  milk: {
    backgroundColor: "#FDFFF5",
  },
});
