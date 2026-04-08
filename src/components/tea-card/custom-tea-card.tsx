import { CustomTea } from "@/lib/database";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button, Dialog, Portal, Text, useTheme } from "react-native-paper";
import {
  RecipeFormValues,
  TeaRecipeFormDialog,
} from "../dialogs/tea-recipe-form-dialog";
import { RecipeCard } from "./recipe-card";

export function CustomTeaCard({
  tea,
  onDelete,
  onEdit,
}: {
  tea: CustomTea;
  onDelete: (id: number) => Promise<unknown>;
  onEdit: (id: number, data: RecipeFormValues) => Promise<unknown>;
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleDelete = () => {
    onDelete(tea.id);
  };

  const handleEdit = async (data: RecipeFormValues) => {
    await onEdit(tea.id, data);
    setShowEdit(false);
  };

  return (
    <>
      <TeaRecipeFormDialog
        visible={showEdit}
        onClose={() => setShowEdit(false)}
        title={t("custom-tea-card.Edit Recipe")}
        submitLabel={t("Edit")}
        defaultValues={tea}
        onSubmit={handleEdit}
      />

      <Portal>
        <Dialog visible={showDelete} onDismiss={() => setShowDelete(false)}>
          <Dialog.Title>{t("custom-tea-card.Delete Recipe")}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {t("custom-tea-card.Are you sure you want to delete this tea", {
                tea: tea.name,
              })}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDelete(false)}>{t("Cancel")}</Button>
            <Button onPress={handleDelete}>{t("Delete")}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <RecipeCard
        name={tea.name}
        description={tea.description}
        ingredients={{
          tea: tea.tea,
          condensedMilk: tea.condensedMilk,
          evaporatedMilk: tea.evaporatedMilk,
          milk: tea.milk,
        }}
      >
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
      </RecipeCard>
    </>
  );
}
