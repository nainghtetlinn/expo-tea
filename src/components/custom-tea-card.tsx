import { Tea } from "@/types/tea";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import {
  Button,
  Card,
  Dialog,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import { TeaCup } from "./tea-cup";
import {
  RecipeFormValues,
  TeaRecipeFormDialog,
} from "./tea-recipe-form-dialog";

export function CustomTeaCard({
  tea,
  onDelete,
  onEdit,
}: {
  tea: Tea;
  onDelete: (id: number) => Promise<unknown>;
  onEdit: (id: number, data: RecipeFormValues) => Promise<unknown>;
}) {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "my";

  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleDelete = () => {
    onDelete(+tea.id);
  };

  const handleEdit = async (data: RecipeFormValues) => {
    await onEdit(+tea.id, data);
    setShowEdit(false);
  };

  return (
    <>
      <TeaRecipeFormDialog
        visible={showEdit}
        onClose={() => setShowEdit(false)}
        title={t("recipes.Edit Recipe")}
        submitLabel={t("Edit")}
        defaultValues={{
          name: tea.name.en,
          description: tea.description.en,
          tea: tea.ingredients.tea,
          condensedMilk: tea.ingredients.condensedMilk,
          evaporatedMilk: tea.ingredients.evaporatedMilk,
          milk: tea.ingredients.milk,
        }}
        onSubmit={handleEdit}
      />
      <Portal>
        <Dialog visible={showDelete} onDismiss={() => setShowDelete(false)}>
          <Dialog.Title>{t("recipes.Delete Recipe")}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {t("recipes.Are you sure you want to delete this tea", {
                tea: tea.name[lang],
              })}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDelete(false)}>{t("Cancel")}</Button>
            <Button onPress={handleDelete}>{t("Delete")}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Card>
        <View className="gap-4 p-4">
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text variant="titleMedium">{tea.name[lang]}</Text>
              <Text variant="bodySmall">{tea.description[lang]}</Text>
            </View>
            <TeaCup ingredients={tea.ingredients} />
          </View>

          <View className="flex-row items-center justify-between">
            {Object.entries(tea.ingredients).map(([k, v]) => (
              <View key={k} className="items-center">
                <Text variant="bodySmall">{k[0].toUpperCase()}</Text>
                <Text variant="labelSmall">{v} ml</Text>
              </View>
            ))}
          </View>

          <View className="flex-row justify-end gap-2">
            <Button
              onPress={() => setShowDelete(true)}
              mode="contained-tonal"
              buttonColor={theme.colors.errorContainer}
              textColor={theme.colors.onErrorContainer}
              icon={({ color, size }) => (
                <MaterialCommunityIcons
                  name="trash-can"
                  color={color}
                  size={size}
                />
              )}
            >
              {t("Delete")}
            </Button>
            <Button
              onPress={() => setShowEdit(true)}
              mode="contained-tonal"
              icon={({ color, size }) => (
                <MaterialIcons name="edit" color={color} size={size} />
              )}
            >
              {t("Edit")}
            </Button>
          </View>
        </View>
      </Card>
    </>
  );
}
