import { useTeaDeviceContext } from "@/lib/tea-device-context";
import { cn } from "@/lib/utils";
import { TeaIngredients } from "@/types/tea";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import { RecipeCard } from "./recipe-card";

export function TeaCard({
  name,
  description,
  ingredients,
}: {
  name: string;
  description: string;
  ingredients: TeaIngredients;
}) {
  const { t, i18n } = useTranslation();
  const { makeTea } = useTeaDeviceContext();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = () => {
    makeTea(ingredients);
    setShowConfirm(false);
  };

  return (
    <>
      <Portal>
        <Dialog visible={showConfirm} onDismiss={() => setShowConfirm(false)}>
          <Dialog.Title>{t("tea-card.Confirm Tea Preparation")}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {t("tea-card.Are you sure you want to make this tea", {
                tea: name,
              })}
            </Text>
            <View
              className={cn("mt-4", i18n.resolvedLanguage == "en" && "gap-1")}
            >
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
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowConfirm(false)}>{t("Cancel")}</Button>
            <Button onPress={handleConfirm}>{t("Confirm")}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <TouchableOpacity onPress={() => setShowConfirm(true)}>
        <RecipeCard
          name={name}
          description={description}
          ingredients={ingredients}
        />
      </TouchableOpacity>
    </>
  );
}
