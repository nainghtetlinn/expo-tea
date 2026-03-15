import { BluetoothStatus } from "@/components/bluetooth/bluetooth-status";
import { DevicesList } from "@/components/bluetooth/devices-list";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Device } from "react-native-ble-plx";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConnectScreen({
  scanDevices,
  connectToDevice,
  connectingDevice,
  connectedDevice,
  devices,
  isScanning,
}: {
  scanDevices: () => void;
  connectToDevice: (device: Device) => void;
  connectingDevice: Device | null;
  connectedDevice: Device | null;
  devices: Device[];
  isScanning: boolean;
}) {
  const isConnecting = !!connectingDevice;

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineSmall" style={styles.header}>
        Bluetooth
      </Text>

      <BluetoothStatus
        connectingDevice={connectingDevice}
        connectedDevice={connectedDevice}
      />

      {(!connectedDevice || isConnecting) && (
        <View style={{ gap: 8 }}>
          <Button
            mode="contained"
            disabled={isScanning || isConnecting}
            loading={isScanning}
            onPress={scanDevices}
          >
            Scan Device
          </Button>
          <DevicesList
            devices={devices}
            connectingDevice={connectingDevice}
            connectToDevice={connectToDevice}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 8,
  },
  header: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },
});
