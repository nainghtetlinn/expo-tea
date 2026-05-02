import { useTranslation } from "react-i18next";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import { useTeaStore } from "@/stores/tea-store";

const DeleteTeaDialog = ({
  visible,
  onClose,
  id,
  name,
}: {
  visible: boolean;
  onClose: () => void;
  id: number;
  name: string;
}) => {
  const { t } = useTranslation();
  const { deleteTea } = useTeaStore();

  const handleDelete = async () => {
    await deleteTea(id);
  };

  return (
    <Portal>
      <Dialog onDismiss={onClose} visible={visible}>
        <Dialog.Title>{t("custom-tea-card.Delete Recipe")}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            {t("custom-tea-card.Are you sure you want to delete this tea", {
              tea: name,
            })}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onClose}>{t("Cancel")}</Button>
          <Button onPress={handleDelete}>{t("Delete")}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DeleteTeaDialog;
