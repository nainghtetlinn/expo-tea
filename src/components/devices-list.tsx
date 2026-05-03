import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FlatList } from "react-native";
import type { Device } from "react-native-ble-plx";
import { Button } from "react-native-paper";
import { BluetoothService } from "@/services/bluetooth";
import { useBluetoothStore } from "@/stores/bluetooth-store";

export function DevicesList() {
  const { foundDevices, connectingDeviceId } = useBluetoothStore();

  return (
    <FlatList
      contentContainerClassName="gap-4"
      data={foundDevices}
      keyExtractor={(item) => item.id}
      renderItem={({ item }: { item: Device }) => {
        return (
          <Button
            disabled={connectingDeviceId === item.id}
            icon={(props) => <MaterialIcons name="device-unknown" {...props} />}
            loading={connectingDeviceId === item.id}
            mode="contained-tonal"
            onPress={() => BluetoothService.connect(item)}
          >
            {item.name}
          </Button>
        );
      }}
    />
  );
}
