import { BluetoothStatus } from "@/components/bluetooth-status";
import { DevicesList } from "@/components/devices-list";
import { useBluetoothContext } from "@/lib/bluetooth-context";
import { View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";

export function BluetoothScreen() {
  const { isScanning, connectedDevice, startScanning, stopScanning } =
    useBluetoothContext();

  const handleScanning = () => {
    startScanning();
    setTimeout(stopScanning, 15000);
  };

  return (
    <View className="flex-1 gap-4 p-4">
      <BluetoothStatus />

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

      {!connectedDevice && <DevicesList />}
    </View>
  );
}
