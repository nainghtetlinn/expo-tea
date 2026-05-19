import { View } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";
import { useBluetoothStore } from "@/stores/bluetooth-store";
import { BluetoothStatusBadge } from "./bluetooth-status-badge";

export function BluetoothStatus() {
  const theme = useTheme();
  const { connectedDevice, connectingDeviceId } = useBluetoothStore();

  return (
    <Surface
      mode="flat"
      style={{ borderRadius: theme.roundness * 3, overflow: "hidden" }}
    >
      <View className="gap-2 p-4">
        <View className="flex-row items-center justify-between">
          <Text variant="labelLarge">Connected Device: </Text>
          <Text variant="bodyMedium">
            {connectedDevice?.name || "No Device"}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text variant="labelLarge">Status: </Text>
          <BluetoothStatusBadge
            variant={
              connectingDeviceId
                ? "warning"
                : connectedDevice
                  ? "success"
                  : "error"
            }
          />
        </View>
      </View>
    </Surface>
  );
}
