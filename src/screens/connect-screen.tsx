import { StatusBadge } from "@/components/bluetooth/status-badge";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FlatList, View } from "react-native";
import { Device } from "react-native-ble-plx";
import { Button, Text, useTheme } from "react-native-paper";
import { useBluetoothContext } from "../lib/bluetooth-context";

export function ConnectScreen() {
  const theme = useTheme();
  const { isScanning, isConnecting, connectedDevice, startScanning } =
    useBluetoothContext();

  return (
    <View
      className="flex-1 gap-4 p-4"
      style={{
        backgroundColor: theme.colors.background,
      }}
    >
      <BluetoothStatus />

      {!connectedDevice && (
        <Button
          mode="contained"
          disabled={isScanning || isConnecting}
          loading={isScanning}
          onPress={startScanning}
        >
          Scan Device
        </Button>
      )}

      {!connectedDevice && <FoundDevicesList />}
    </View>
  );
}

const BluetoothStatus = () => {
  const { connectingDeviceId, connectedDevice } = useBluetoothContext();

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
            connectingDeviceId
              ? "warning"
              : connectedDevice
                ? "success"
                : "error"
          }
        />
      </View>
    </View>
  );
};

const FoundDevicesList = () => {
  const { foundDevices, connectingDeviceId, connectToDevice } =
    useBluetoothContext();

  return (
    <FlatList
      data={foundDevices}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View style={{ marginVertical: 4 }} />}
      renderItem={({ item }: { item: Device }) => {
        return (
          <Button
            loading={connectingDeviceId === item.id}
            disabled={connectingDeviceId === item.id}
            mode="contained-tonal"
            icon={(props) => <MaterialIcons name="device-unknown" {...props} />}
            onPress={() => connectToDevice(item)}
          >
            {item.name}
          </Button>
        );
      }}
      ListEmptyComponent={
        <View>
          <Text variant="bodyMedium" style={{ textAlign: "center" }}>
            No devices
          </Text>
        </View>
      }
    />
  );
};
