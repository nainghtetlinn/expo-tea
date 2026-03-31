import { CustomTeaCard } from "@/components/custom-tea-card";
import { TeaRecipeFormDialog } from "@/components/tea-recipe-form-dialog";
import {
  addCustomRecipe,
  CustomTea,
  deleteCustomRecipe,
  updateCustomRecipe,
} from "@/lib/database";
import { useTeaContext } from "@/lib/tea-context";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";

export function RecipesScreen() {
  const { loading, customRecipes, loadRecipes } = useTeaContext();
  const [showForm, setShowForm] = useState(false);

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

  const handleEditRecipe = async (
    id: number,
    recipe: Omit<CustomTea, "id" | "created_at">,
  ) => {
    try {
      await updateCustomRecipe(id, recipe);
      await loadRecipes();
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <TeaRecipeFormDialog
        visible={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleAddRecipe}
      />

      <View className="flex-1 gap-2">
        <View className="px-4">
          <Button mode="contained-tonal" onPress={() => setShowForm(true)}>
            Add Custom Recipe
          </Button>
        </View>

        <FlatList
          data={customRecipes}
          keyExtractor={(r) => r.id.toString()}
          contentContainerClassName="p-4 pt-1 gap-4"
          renderItem={({ item }) => (
            <CustomTeaCard
              tea={item}
              onDelete={handleDeleteRecipe}
              onEdit={handleEditRecipe}
            />
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
