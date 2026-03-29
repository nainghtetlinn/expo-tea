import { TeaCard } from "@/components/tea-card";
import { recipes } from "@/constants/Recipes";
import { CustomTea, getCustomRecipes, initDatabase } from "@/lib/database";
import { Tea } from "@/types/tea";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

export function HomeScreen() {
  const [customRecipes, setCustomRecipes] = useState<CustomTea[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRecipes = async () => {
    try {
      await initDatabase();
      const custom = await getCustomRecipes();
      setCustomRecipes(custom);
    } catch (error) {
      console.error("Error loading recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const customTeas: Tea[] = customRecipes.map((recipe) => ({
    id: recipe.id + 1000,
    name: {
      en: recipe.name,
      my: recipe.name,
    },
    description: {
      en: recipe.description,
      my: recipe.description,
    },
    ingredients: {
      tea: recipe.tea,
      condensedMilk: recipe.condensedMilk,
      evaporatedMilk: recipe.evaporatedMilk,
      milk: recipe.milk,
    },
  }));

  useEffect(() => {
    loadRecipes();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 gap-2">
      <View className="items-center">
        <Text variant="titleLarge">Tea Mixer</Text>
      </View>
      <FlatList
        data={[...customTeas, ...recipes]}
        keyExtractor={(r) => r.id.toString()}
        contentContainerClassName="p-4 gap-4"
        renderItem={({ item }) => <TeaCard tea={item} />}
      />
    </View>
  );
}
