import { CustomTeaCard } from "@/components/custom-tea-card";
import { TeaRecipeFormDialog } from "@/components/tea-recipe-form-dialog";
import {
  addCustomRecipe,
  CustomTea,
  deleteCustomRecipe,
  getCustomRecipes,
  initDatabase,
} from "@/lib/database";
import { Tea } from "@/types/tea";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { Button, Text } from "react-native-paper";

export function RecipesScreen() {
  const [customRecipes, setCustomRecipes] = useState<CustomTea[]>([]);
  const [showForm, setShowForm] = useState(false);
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

  const handleAddRecipe = async (
    recipe: Omit<CustomTea, "id" | "created_at">,
  ) => {
    try {
      await addCustomRecipe(recipe);
      await loadRecipes();
      setShowForm(false);
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
  };

  const handleDeleteRecipe = async (id: number) => {
    try {
      await deleteCustomRecipe(id);
      await loadRecipes();
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  // Convert custom recipes to Tea format
  const customTeas: Tea[] = customRecipes.map((recipe) => ({
    id: recipe.id!,
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

  return (
    <>
      <TeaRecipeFormDialog
        visible={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleAddRecipe}
      />
      <View className="flex-1 gap-2 px-4">
        <View className="mb-2 items-center">
          <Text variant="titleLarge">Recipes</Text>
        </View>

        <Button mode="contained-tonal" onPress={() => setShowForm(true)}>
          Add Custom Recipe
        </Button>

        <FlatList
          data={[...customTeas]}
          keyExtractor={(r) => r.id.toString()}
          contentContainerClassName="gap-4"
          renderItem={({ item }) => (
            <CustomTeaCard tea={item} onDelete={handleDeleteRecipe} />
          )}
          ListEmptyComponent={
            <View className="items-center p-4">
              <Text variant="bodyMedium">No custom recipes</Text>
            </View>
          }
        />
      </View>
    </>
  );
}
