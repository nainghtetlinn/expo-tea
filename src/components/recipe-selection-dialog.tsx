import { recipes as presetRecipes } from "@/constants/Recipes";
import { useTeaContext } from "@/lib/tea-context";
import { cn } from "@/lib/utils";
import { Tea } from "@/types/tea";
import { useTranslation } from "react-i18next";
import { ScrollView, TouchableOpacity, View } from "react-native";
import {
  Button,
  Dialog,
  Portal,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
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
  const theme = useTheme();
  const { customRecipes } = useTeaContext();

  const allRecipes = [...presetRecipes, ...customRecipes];

  const renderRecipeItem = (recipe: Tea) => {
    return (
      <TouchableOpacity
        key={recipe.id}
        onPress={() => onSelect(recipe)}
        className="mb-2"
      >
        <Surface
          mode="flat"
          style={{ borderRadius: theme.roundness * 3, overflow: "hidden" }}
        >
          <View className="flex-row gap-4 p-4">
            <View className="pt-2">
              <TeaCup ingredients={recipe.ingredients} totalHeight={60} />
            </View>
            <View className="flex-1">
              <Text variant="titleMedium">{recipe.name[lang]}</Text>
              <View
                className={cn("mt-2", i18n.resolvedLanguage == "en" && "gap-2")}
              >
                {Object.entries(recipe.ingredients)
                  .filter(([, v]) => v > 0)
                  .map(([k, v]) => (
                    <View
                      key={k}
                      className="flex-row items-center justify-between"
                    >
                      <Text variant="bodySmall">{t(`ingredients.${k}`)}</Text>
                      <Text variant="bodySmall">{v} ml</Text>
                    </View>
                  ))}
              </View>
            </View>
          </View>
        </Surface>
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
        <Dialog.Title>{t("machine.Select Recipe")}</Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView>
            {presetRecipes.length > 0 && (
              <>
                <Text variant="labelLarge" className="py-2 opacity-50">
                  {t("machine.Preset Recipes")}
                </Text>
                {presetRecipes.map((r, i) => (
                  <View key={r.id}>{renderRecipeItem(r)}</View>
                ))}
              </>
            )}

            {customRecipes.length > 0 && (
              <>
                <Text variant="labelLarge" className="py-2 opacity-50">
                  {t("machine.Custom Recipes")}
                </Text>
                {customRecipes.map((r, i) => (
                  <View key={r.id}>{renderRecipeItem(r)}</View>
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
