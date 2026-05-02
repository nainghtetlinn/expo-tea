import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import { useTeaDeviceContext } from "@/lib/tea-device-context";
import { cn } from "@/lib/utils";
import type { TeaIngredients } from "@/types/tea";

const MakeTeaDialog = ({
  visible,
  onClose,
  name,
  ingredients,
}: {
  visible: boolean;
  onClose: () => void;
  name: string;
  ingredients: TeaIngredients;
}) => {
  const { t, i18n } = useTranslation();
  const { makeTea } = useTeaDeviceContext();

  const handleConfirm = () => {
    makeTea(ingredients);
    onClose();
  };

  return (
    <Portal>
      <Dialog onDismiss={onClose} visible={visible}>
        <Dialog.Title>{t("tea-card.Confirm Tea Preparation")}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            {t("tea-card.Are you sure you want to make this tea", {
              tea: name,
            })}
          </Text>
          <View
            className={cn("mt-4", i18n.resolvedLanguage === "en" && "gap-1")}
          >
            {Object.entries(ingredients)
              .filter(([, v]) => v > 0)
              .map(([k, v]) => (
                <View className="flex-row items-center justify-between" key={k}>
                  <Text variant="bodySmall">{t(`ingredients.${k}`)}</Text>
                  <Text variant="bodySmall">{v} ml</Text>
                </View>
              ))}
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onClose}>{t("Cancel")}</Button>
          <Button onPress={handleConfirm}>{t("Confirm")}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default MakeTeaDialog;
