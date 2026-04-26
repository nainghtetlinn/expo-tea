import { recipes as presetRecipes } from "@/constants/Recipes";
import { ButtonInfo } from "@/contracts/deviceNotifications";
import { useTeaContext } from "@/lib/tea-context";
import { useTeaDeviceContext } from "@/lib/tea-device-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";
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
  const { customRecipes } = useTeaContext();
  const { setButtonRecipe } = useTeaDeviceContext();

  const [showEdit, setShowEdit] = useState(false);

  const handleSelect = (data: ButtonInfo) => {
    setButtonRecipe(btnIndex, data);
    setShowEdit(false);
  };

  return (
    <>
      <Portal>
        <Dialog
          visible={showEdit}
          onDismiss={() => setShowEdit(false)}
          style={{ maxHeight: "80%" }}
        >
          <Dialog.Title>{t("machine-tea-card.Select Recipe")}</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView>
              {customRecipes.length > 0 && (
                <>
                  <Text variant="labelLarge" className="py-2 opacity-50">
                    {t("machine-tea-card.Custom Recipes")}
                  </Text>
                  {customRecipes.map((r) => (
                    <TouchableOpacity
                      key={r.id}
                      className="mb-2"
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
                        name={r.name}
                        ingredients={{
                          tea: r.tea,
                          condensedMilk: r.condensedMilk,
                          evaporatedMilk: r.evaporatedMilk,
                          milk: r.milk,
                        }}
                      />
                    </TouchableOpacity>
                  ))}
                </>
              )}

              {presetRecipes.length > 0 && (
                <>
                  <Text variant="labelLarge" className="py-2 opacity-50">
                    {t("machine-tea-card.Preset Recipes")}
                  </Text>
                  {presetRecipes.map((r) => (
                    <TouchableOpacity
                      key={r.id}
                      className="mb-2"
                      onPress={() =>
                        handleSelect({
                          name: r.name.en,
                          ...r.ingredients,
                        })
                      }
                    >
                      <RecipeCardItem
                        name={r.name[lang]}
                        ingredients={r.ingredients}
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
        name={name}
        description={`Button ${btnIndex + 1}`}
        ingredients={ingredients}
      >
        <View className="flex-row justify-end">
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

export default MachineTeaCard;
