import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import { recipes as presetRecipes } from "@/constants/Recipes";
import type { ButtonInfo } from "@/contracts/deviceNotifications";
import { DeviceService } from "@/services/device";
import { useTeaStore } from "@/stores/tea-store";
import RecipeCard from "./recipe-card";
import RecipeCardItem from "./recipe-card-item";

const MachineTeaCard = ({
  btnIndex,
  info: { name, ...ingredients },
}: {
  btnIndex: 0 | 1 | 2;
  info: ButtonInfo;
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "my";
  const { customTeas } = useTeaStore();

  const [showEdit, setShowEdit] = useState(false);

  const handleSelect = (data: ButtonInfo) => {
    DeviceService.send.setButtonInfo(btnIndex, data);
    setShowEdit(false);
  };

  return (
    <>
      <Portal>
        <Dialog
          onDismiss={() => setShowEdit(false)}
          style={{ maxHeight: "80%" }}
          visible={showEdit}
        >
          <Dialog.Title>{t("machine-tea-card.Select Recipe")}</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView>
              {customTeas.length > 0 && (
                <>
                  <Text className="py-2 opacity-50" variant="labelLarge">
                    {t("machine-tea-card.Custom Recipes")}
                  </Text>
                  {customTeas.map((r) => (
                    <TouchableOpacity
                      className="mb-2"
                      key={r.id}
                      onPress={() =>
                        handleSelect({
                          name: r.name,
                          tea: r.tea,
                          condensedMilk: r.condensedMilk,
                          evaporatedMilk: r.evaporatedMilk,
                          milk: r.milk,
                        })
                      }
                    >
                      <RecipeCardItem
                        ingredients={{
                          tea: r.tea,
                          condensedMilk: r.condensedMilk,
                          evaporatedMilk: r.evaporatedMilk,
                          milk: r.milk,
                        }}
                        name={r.name}
                      />
                    </TouchableOpacity>
                  ))}
                </>
              )}

              {presetRecipes.length > 0 && (
                <>
                  <Text className="py-2 opacity-50" variant="labelLarge">
                    {t("machine-tea-card.Preset Recipes")}
                  </Text>
                  {presetRecipes.map((r) => (
                    <TouchableOpacity
                      className="mb-2"
                      key={r.id}
                      onPress={() =>
                        handleSelect({
                          name: r.name.en,
                          ...r.ingredients,
                        })
                      }
                    >
                      <RecipeCardItem
                        ingredients={r.ingredients}
                        name={r.name[lang]}
                      />
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setShowEdit(false)}>{t("Cancel")}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <RecipeCard
        description={`Button ${btnIndex + 1}`}
        ingredients={ingredients}
        name={name}
      >
        <View className="flex-row justify-end">
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

export default MachineTeaCard;
