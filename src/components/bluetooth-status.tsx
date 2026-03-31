import { useBluetoothContext } from "@/lib/bluetooth-context";
import { View } from "react-native";
import { Card, Text } from "react-native-paper";
import { BluetoothStatusBadge } from "./bluetooth-status-badge";

export function BluetoothStatus() {
  const { connectedDevice, connectingDeviceId } = useBluetoothContext();

  return (
    <Card mode="contained">
      <Card.Content>
        <View className="gap-2">
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
      </Card.Content>
    </Card>
  );
}
