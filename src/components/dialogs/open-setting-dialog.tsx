import { Button, Dialog, Portal, Text } from "react-native-paper";
import { BluetoothService } from "@/services/bluetooth";

const OpenSettingDialog = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  return (
    <Portal>
      <Dialog onDismiss={onClose} visible={visible}>
        <Dialog.Title>Bluetooth is not enabled</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            Please enable Bluetooth to connect to the device.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onClose}>Cancel</Button>
          <Button onPress={BluetoothService.openSettings}>Open Settings</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default OpenSettingDialog;
