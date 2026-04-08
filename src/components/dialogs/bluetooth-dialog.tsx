import { useBluetoothContext } from "@/lib/bluetooth-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import { Device } from "react-native-ble-plx";
import {
  ActivityIndicator,
  Button,
  Dialog,
  Portal,
  Text,
} from "react-native-paper";

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
      <Dialog visible={visible} onDismiss={onClose}>
        <Dialog.Title>{t("bluetooth-dialog.Found Devices")}</Dialog.Title>
        <Dialog.Content>
          <View className="h-60">
            <View className="flex-row items-center justify-between">
              <Text variant="bodyLarge" style={{ paddingVertical: 8 }}>
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
              data={foundDevices}
              keyExtractor={(item) => item.id}
              contentContainerClassName="gap-4"
              renderItem={({ item }: { item: Device }) => {
                return (
                  <Button
                    loading={connectingDeviceId === item.id}
                    disabled={connectingDeviceId === item.id}
                    mode="contained-tonal"
                    icon={(props) => (
                      <MaterialIcons name="device-unknown" {...props} />
                    )}
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
