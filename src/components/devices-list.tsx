import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FlatList } from "react-native";
import type { Device } from "react-native-ble-plx";
import { Button } from "react-native-paper";
import { useBluetoothContext } from "@/lib/bluetooth-context";

export function DevicesList() {
  const { foundDevices, connectingDeviceId, connectToDevice } =
    useBluetoothContext();

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
            onPress={() => connectToDevice(item)}
          >
            {item.name}
          </Button>
        );
      }}
    />
  );
}
