import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { TeaRecipeFormDialog } from "@/components/dialogs/tea-recipe-form-dialog";
import { CustomTeaCard } from "@/components/tea-card";
import { addCustomRecipe, type CustomTea } from "@/lib/database";
import { useTeaContext } from "@/lib/tea-context";

export function RecipesScreen() {
  const { t } = useTranslation();

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
        onClose={() => setShowForm(false)}
        onSubmit={handleAddRecipe}
        submitLabel={t("Add")}
        title={t("recipes.Add Custom Recipe")}
        visible={showForm}
      />

      <View className="flex-1 gap-2">
        <View className="px-4">
          <Button mode="contained-tonal" onPress={() => setShowForm(true)}>
            {t("recipes.Add Custom Recipe")}
          </Button>
        </View>

        <FlatList
          contentContainerClassName="gap-4 p-4 pt-1"
          data={customRecipes}
          keyExtractor={(r) => r.id.toString()}
          ListEmptyComponent={
            <View className="items-center p-4">
              <Text variant="bodyMedium">No custom recipes</Text>
            </View>
          }
          renderItem={({ item }) => <CustomTeaCard tea={item} />}
        />
      </View>
    </>
  );
}
