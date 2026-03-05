import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { FlatList, View } from "react-native";
import { Device } from "react-native-ble-plx";
import { Button, Text } from "react-native-paper";

export default function DevicesList({
  devices,
  connectingDevice,
  connectToDevice,
}: {
  devices: Device[];
  connectingDevice: Device | null;
  connectToDevice: (device: Device) => void;
}) {
  return (
    <FlatList
      data={devices}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View style={{ marginVertical: 4 }} />}
      renderItem={({ item }: { item: Device }) => {
        return (
          <Button
            loading={connectingDevice?.id === item.id}
            disabled={connectingDevice?.id === item.id}
            mode="contained-tonal"
            icon={(props) => (
              <MaterialIcons
                name="device-unknown"
                {...props}
              />
            )}
            onPress={() => connectToDevice(item)}
          >
            {item.name}
          </Button>
        );
      }}
      ListEmptyComponent={
        <View>
          <Text
            variant="bodyMedium"
            style={{ textAlign: "center" }}
          >
            No devices
          </Text>
        </View>
      }
    />
  );
}
