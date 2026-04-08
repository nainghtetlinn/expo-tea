import { ButtonInfo } from "@/contracts/deviceNotifications";
import { useTeaDeviceContext } from "@/lib/tea-device-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { RecipeSelectionDialog } from "../recipe-selection-dialog";
import { RecipeCard } from "./recipe-card";

export function MachineTeaCard({
  btnIndex,
  info: { name, ...ingredients },
}: {
  btnIndex: 0 | 1 | 2;
  info: ButtonInfo;
}) {
  const { t } = useTranslation();
  const { setButtonRecipe } = useTeaDeviceContext();

  const [showEdit, setShowEdit] = useState(false);

  const handleSelect = (data: ButtonInfo) => {
    setButtonRecipe(btnIndex, data);
    setShowEdit(false);
  };

  return (
    <>
      <RecipeSelectionDialog
        visible={showEdit}
        onClose={() => setShowEdit(false)}
        onSelect={handleSelect}
      />

      <RecipeCard
        name={name}
        description={`Button ${btnIndex + 1}`}
        ingredients={ingredients}
      >
        <View className="flex-row justify-end">
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
