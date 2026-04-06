import { ButtonInfo } from "@/contracts/deviceNotifications";
import { useTeaDeviceContext } from "@/lib/tea-device-context";
import { Tea } from "@/types/tea";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button, Surface, Text, useTheme } from "react-native-paper";
import { RecipeSelectionDialog } from "./recipe-selection-dialog";
import { TeaCup } from "./tea-cup";

export function MachineTeaCard({
  btnIndex,
  info: { name, ...ingredients },
}: {
  btnIndex: 0 | 1 | 2;
  info: ButtonInfo;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { setButtonRecipe } = useTeaDeviceContext();

  const [showEdit, setShowEdit] = useState(false);

  const handleSelect = (data: Tea) => {
    setButtonRecipe(btnIndex, {
      name: data.name.en,
      tea: data.ingredients.tea,
      condensedMilk: data.ingredients.condensedMilk,
      evaporatedMilk: data.ingredients.evaporatedMilk,
      milk: data.ingredients.milk,
    });
    setShowEdit(false);
  };

  return (
    <>
      <RecipeSelectionDialog
        visible={showEdit}
        onClose={() => setShowEdit(false)}
        onSelect={handleSelect}
      />
      <Surface
        mode="flat"
        style={{ borderRadius: theme.roundness * 3, overflow: "hidden" }}
      >
        <View className="gap-4 p-4">
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text variant="titleMedium">{name}</Text>
              <Text variant="bodySmall">Button {btnIndex + 1}</Text>
            </View>
            <TeaCup ingredients={ingredients} />
          </View>

          <View className="flex-row items-center justify-between">
            {Object.entries(ingredients).map(([k, v]) => (
              <View key={k} className="items-center">
                <Text variant="bodySmall">{k[0].toUpperCase()}</Text>
                <Text variant="labelSmall">{v} ml</Text>
              </View>
            ))}
          </View>

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
        </View>
      </Surface>
    </>
  );
}
