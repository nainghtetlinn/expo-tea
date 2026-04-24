import { CustomTea, updateCustomRecipe } from "@/lib/database";
import { useTeaContext } from "@/lib/tea-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { DeleteTeaDialog } from "../dialogs";
import {
  RecipeFormValues,
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
      await updateCustomRecipe(tea.id, data);
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
        visible={showEdit}
        onClose={() => setShowEdit(false)}
        title={t("custom-tea-card.Edit Recipe")}
        submitLabel={t("Edit")}
        defaultValues={tea}
        onSubmit={handleEdit}
      />

      <DeleteTeaDialog
        visible={showDelete}
        onClose={() => setShowDelete(false)}
        id={tea.id}
        name={tea.name}
      />

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
            icon={(props) => (
              <MaterialCommunityIcons name="trash-can" {...props} />
            )}
          >
            {t("Delete")}
          </Button>
          <Button
            onPress={() => setShowEdit(true)}
            mode="contained-tonal"
            icon={(props) => <MaterialIcons name="edit" {...props} />}
          >
            {t("Edit")}
          </Button>
        </View>
      </RecipeCard>
    </>
  );
};

export default CustomTeaCard;
