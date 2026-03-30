import { LocalizedText as Text } from "@/components/localized-text";
import { View } from "react-native";
import { Device } from "react-native-ble-plx";
import { StatusBadge } from "./status-badge";

export function BluetoothStatus({
  connectingDevice,
  connectedDevice,
}: {
  connectingDevice: Device | null;
  connectedDevice: Device | null;
}) {
  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text variant="labelLarge">Connected Device: </Text>
        <Text variant="bodyMedium">{connectedDevice?.name || "No Device"}</Text>
      </View>
      <View className="flex-row items-center justify-between">
        <Text variant="labelLarge">Status: </Text>
        <StatusBadge
          variant={
            connectingDevice ? "warning" : connectedDevice ? "success" : "error"
          }
        />
      </View>
    </View>
  );
}
