import { recipes as presetRecipes } from "@/constants/Recipes";
import { useTeaContext } from "@/lib/tea-context";
import { Tea } from "@/types/tea";
import { useTranslation } from "react-i18next";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Button, Dialog, Divider, Portal, Text } from "react-native-paper";
import { TeaCup } from "./tea-cup";

export function RecipeSelectionDialog({
  visible,
  onClose,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (ingredients: Tea) => void;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "my";
  const { customRecipes } = useTeaContext();

  const allRecipes = [...presetRecipes, ...customRecipes];

  const renderRecipeItem = (recipe: Tea) => {
    return (
      <TouchableOpacity
        key={recipe.id}
        onPress={() => onSelect(recipe)}
        className="flex flex-row items-center justify-between px-4 py-3"
      >
        <View className="flex-1 pr-4">
          <Text variant="titleMedium">{recipe.name[lang]}</Text>
          <View className="mt-1 flex flex-row flex-wrap gap-2">
            {Object.entries(recipe.ingredients).map(([k, v]) => {
              if (!v) return null; // hide 0 values optionally, but let's just show all or non-zero
              return (
                <Text key={k} variant="labelSmall" className="opacity-70">
                  {t(`ingredients.${k}`, { defaultValue: k })} {v}ml
                </Text>
              );
            })}
          </View>
        </View>
        <View className="opacity-80">
          <TeaCup ingredients={recipe.ingredients} totalHeight={40} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onClose}
        style={{ maxHeight: "80%" }}
      >
        <Dialog.Title>{t("Select Recipe")}</Dialog.Title>
        <Dialog.ScrollArea className="px-0">
          <ScrollView>
            {presetRecipes.length > 0 && (
              <>
                <Text variant="labelLarge" className="px-4 py-2 opacity-50">
                  Preset Recipes
                </Text>
                {presetRecipes.map((r, i) => (
                  <View key={r.id}>
                    {i > 0 && <Divider />}
                    {renderRecipeItem(r)}
                  </View>
                ))}
              </>
            )}

            {customRecipes.length > 0 && (
              <>
                <Text
                  variant="labelLarge"
                  className="mt-2 px-4 py-2 opacity-50"
                >
                  Custom Recipes
                </Text>
                {customRecipes.map((r, i) => (
                  <View key={r.id}>
                    {i === 0 && presetRecipes.length > 0 && <Divider />}
                    {i > 0 && <Divider />}
                    {renderRecipeItem(r)}
                  </View>
                ))}
              </>
            )}

            {allRecipes.length === 0 && (
              <View className="items-center p-4">
                <Text variant="bodyMedium">No recipes available</Text>
              </View>
            )}
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={onClose}>{t("Cancel")}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
