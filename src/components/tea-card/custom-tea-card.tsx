import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { useTeaContext } from "@/lib/tea-context";
import { updateCustomTea } from "@/services/database";
import type { CustomTea } from "@/types/custom-tea";
import { DeleteTeaDialog } from "../dialogs";
import {
  type RecipeFormValues,
  TeaRecipeFormDialog,
} from "../dialogs/tea-recipe-form-dialog";
import RecipeCard from "./recipe-card";

const CustomTeaCard = ({ tea }: { tea: CustomTea }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { loadRecipes } = useTeaContext();

  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleEdit = async (data: RecipeFormValues) => {
    try {
      await updateCustomTea(tea.id, data);
      await loadRecipes();
    } catch (error) {
      console.error("Error updating recipe:", error);
    } finally {
      setShowEdit(false);
    }
  };

  return (
    <>
      <TeaRecipeFormDialog
        defaultValues={tea}
        onClose={() => setShowEdit(false)}
        onSubmit={handleEdit}
        submitLabel={t("Edit")}
        title={t("custom-tea-card.Edit Recipe")}
        visible={showEdit}
      />

      <DeleteTeaDialog
        id={tea.id}
        name={tea.name}
        onClose={() => setShowDelete(false)}
        visible={showDelete}
      />

      <RecipeCard
        description={tea.description}
        ingredients={{
          tea: tea.tea,
          condensedMilk: tea.condensedMilk,
          evaporatedMilk: tea.evaporatedMilk,
          milk: tea.milk,
        }}
        name={tea.name}
      >
        <View className="flex-row justify-end gap-2">
          <Button
            buttonColor={theme.colors.errorContainer}
            icon={(props) => (
              <MaterialCommunityIcons name="trash-can" {...props} />
            )}
            mode="contained-tonal"
            onPress={() => setShowDelete(true)}
            textColor={theme.colors.onErrorContainer}
          >
            {t("Delete")}
          </Button>
          <Button
            icon={(props) => <MaterialIcons name="edit" {...props} />}
            mode="contained-tonal"
            onPress={() => setShowEdit(true)}
          >
            {t("Edit")}
          </Button>
        </View>
      </RecipeCard>
    </>
  );
};

export default CustomTeaCard;
