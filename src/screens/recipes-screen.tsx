import { TeaRecipeFormDialog } from "@/components/dialogs/tea-recipe-form-dialog";
import { CustomTeaCard } from "@/components/tea-card";
import { addCustomRecipe, CustomTea } from "@/lib/database";
import { useTeaContext } from "@/lib/tea-context";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";

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
        visible={showForm}
        onClose={() => setShowForm(false)}
        title={t("recipes.Add Custom Recipe")}
        submitLabel={t("Add")}
        onSubmit={handleAddRecipe}
      />

      <View className="flex-1 gap-2">
        <View className="px-4">
          <Button mode="contained-tonal" onPress={() => setShowForm(true)}>
            {t("recipes.Add Custom Recipe")}
          </Button>
        </View>

        <FlatList
          data={customRecipes}
          keyExtractor={(r) => r.id.toString()}
          contentContainerClassName="p-4 pt-1 gap-4"
          renderItem={({ item }) => <CustomTeaCard tea={item} />}
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
