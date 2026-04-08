import { recipes as presetRecipes } from "@/constants/Recipes";
import { ButtonInfo } from "@/contracts/deviceNotifications";
import { useTeaContext } from "@/lib/tea-context";
import { TeaIngredients } from "@/types/tea";
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
  onSelect: (info: ButtonInfo) => void;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { customRecipes } = useTeaContext();

  const renderRecipeItem = ({
    name,
    ingredients,
  }: {
    name: string;
    ingredients: TeaIngredients;
  }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          onSelect({
            name,
            ...ingredients,
          })
        }
        className="mb-2"
      >
        <Surface
          mode="flat"
          style={{ borderRadius: theme.roundness * 3, overflow: "hidden" }}
        >
          <View className="flex-row gap-4 p-4">
            <View className="pt-2">
              <TeaCup ingredients={ingredients} totalHeight={60} />
            </View>
            <View className="flex-1">
              <Text variant="titleMedium">{name}</Text>
              <View className="mt-2">
                {Object.entries(ingredients)
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
        <Dialog.Title>
          {t("recipe-selection-dialog.Select Recipe")}
        </Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView>
            {presetRecipes.length > 0 && (
              <>
                <Text variant="labelLarge" className="py-2 opacity-50">
                  {t("recipe-selection-dialog.Preset Recipes")}
                </Text>
                {presetRecipes.map((r, i) => (
                  <View key={r.id}>
                    {renderRecipeItem({
                      name: r.name.en,
                      ingredients: r.ingredients,
                    })}
                  </View>
                ))}
              </>
            )}

            {customRecipes.length > 0 && (
              <>
                <Text variant="labelLarge" className="py-2 opacity-50">
                  {t("recipe-selection-dialog.Custom Recipes")}
                </Text>
                {customRecipes.map((r, i) => (
                  <View key={r.id}>
                    {renderRecipeItem({
                      name: r.name,
                      ingredients: {
                        tea: r.tea,
                        condensedMilk: r.condensedMilk,
                        evaporatedMilk: r.evaporatedMilk,
                        milk: r.milk,
                      },
                    })}
                  </View>
                ))}
              </>
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
