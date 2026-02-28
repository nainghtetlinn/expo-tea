import { useTeaContext } from "@/utils/tea-context";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const TOTAL_HEIGHT = 55;

export default function TeaProgress({}: {}) {
  const { targetIngredients, currentIngredients, progress } = useTeaContext();

  const heights = useMemo(() => {
    const total =
      targetIngredients.tea +
      targetIngredients.condensedMilk +
      targetIngredients.evaporatedMilk +
      targetIngredients.milk;

    if (total == 0) return [0, 0, 0, 0];

    return [
      (currentIngredients.tea / total) * TOTAL_HEIGHT,
      (currentIngredients.condensedMilk / total) * TOTAL_HEIGHT,
      (currentIngredients.evaporatedMilk / total) * TOTAL_HEIGHT,
      (currentIngredients.milk / total) * TOTAL_HEIGHT,
    ];
  }, [targetIngredients, currentIngredients]);

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={[styles.condensedMilk, { height: heights[1] }]} />
        <View style={[styles.evaporatedMilk, { height: heights[2] }]} />
        <View style={[styles.tea, { height: heights[0] }]} />
        <View style={[styles.milk, { height: heights[3] }]} />
      </View>
      <Text
        variant="labelSmall"
        style={styles.percentage}
      >
        {progress}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 2,
  },
  percentage: {
    textAlign: "center",
  },
  box: {
    flexDirection: "column-reverse",
    width: 50,
    height: TOTAL_HEIGHT + 15,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 4,
    overflow: "hidden",
  },
  tea: {
    backgroundColor: "#E67338",
  },
  condensedMilk: {
    backgroundColor: "#FFF7D9",
  },
  evaporatedMilk: {
    backgroundColor: "#F6EEE1",
  },
  milk: {
    backgroundColor: "#FDFFF5",
  },
});
