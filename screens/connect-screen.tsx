import BluetoothStatus from "@/components/bluetooth-status";
import DevicesList from "@/components/devices-list";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Device } from "react-native-ble-plx";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConnectScreen({
  scanDevices,
  connectToDevice,
  disconnectFromDevice,
  connectedDevice,
  devices,
  isScanning,
  isConnecting,
}: {
  scanDevices: () => void;
  connectToDevice: (device: Device) => void;
  disconnectFromDevice: () => void;
  connectedDevice?: Device;
  devices: Device[];
  isScanning: boolean;
  isConnecting: boolean;
}) {
  return (
    <SafeAreaView style={styles.container}>
      <Text
        variant="headlineSmall"
        style={styles.header}
      >
        Tea Mixer
      </Text>

      <BluetoothStatus
        isConnecting={isConnecting}
        connectedDevice={connectedDevice}
      />

      {!connectedDevice || isConnecting ? (
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
            isConnecting={isConnecting}
            connectedDevice={connectedDevice}
            connectToDevice={connectToDevice}
          />
        </View>
      ) : (
        <View>
          <Button
            mode="contained"
            onPress={disconnectFromDevice}
          >
            Disconnect
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 24,
    fontWeight: "bold",
  },
});
