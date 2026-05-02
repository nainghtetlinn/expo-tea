import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import type { Device } from "react-native-ble-plx";
import {
  ActivityIndicator,
  Button,
  Dialog,
  Portal,
  Text,
} from "react-native-paper";
import { useBluetoothContext } from "@/lib/bluetooth-context";

export const BluetoothDialog = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const {
    isScanning,
    foundDevices,
    connectingDeviceId,
    startScanning,
    stopScanning,
    connectToDevice,
  } = useBluetoothContext();

  const handleScanning = () => {
    startScanning();
    setTimeout(stopScanning, 15000);
  };

  return (
    <Portal>
      <Dialog onDismiss={onClose} visible={visible}>
        <Dialog.Title>{t("bluetooth-dialog.Found Devices")}</Dialog.Title>
        <Dialog.Content>
          <View className="h-60">
            <View className="flex-row items-center justify-between">
              <Text style={{ paddingVertical: 8 }} variant="bodyLarge">
                Available Devices
              </Text>
              {isScanning ? (
                <ActivityIndicator />
              ) : (
                <Button compact onPress={handleScanning}>
                  Refresh
                </Button>
              )}
            </View>

            <FlatList
              contentContainerClassName="gap-4"
              data={foundDevices}
              keyExtractor={(item) => item.id}
              renderItem={({ item }: { item: Device }) => {
                return (
                  <Button
                    disabled={connectingDeviceId === item.id}
                    icon={(props) => (
                      <MaterialIcons name="device-unknown" {...props} />
                    )}
                    loading={connectingDeviceId === item.id}
                    mode="contained-tonal"
                    onPress={() => connectToDevice(item)}
                  >
                    {item.name}
                  </Button>
                );
              }}
            />
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onClose}>{t("Cancel")}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
