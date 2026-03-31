import { useBluetoothContext } from "@/lib/bluetooth-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FlatList } from "react-native";
import { Device } from "react-native-ble-plx";
import { Button } from "react-native-paper";

export function DevicesList() {
  const { foundDevices, connectingDeviceId, connectToDevice } =
    useBluetoothContext();

  return (
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
            icon={(props) => <MaterialIcons name="device-unknown" {...props} />}
            onPress={() => connectToDevice(item)}
          >
            {item.name}
          </Button>
        );
      }}
    />
  );
}
