import Colors from "@/constants/Colors";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Device } from "react-native-ble-plx";

export default function DevicesList({
  devices,
  connectToDevice,
}: {
  devices: Device[];
  connectToDevice: (device: Device) => void;
}) {
  return (
    <FlatList
      data={devices}
      keyExtractor={(item) => item.id}
      renderItem={({ item }: { item: Device }) => {
        return (
          <TouchableOpacity
            style={styles.container}
            onPress={() => connectToDevice(item)}
          >
            <View style={styles.info}>
              <Text style={styles.name}>{item.name || "Unnamed Device"}</Text>
            </View>
          </TouchableOpacity>
        );
      }}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text>No devices</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: Colors.primary,
  },
  info: { flexDirection: "row", alignItems: "center" },
  name: { fontSize: 16 },
  empty: {
    alignItems: "center",
  },
});
