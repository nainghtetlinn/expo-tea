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
  sendData,
  connectingDevice,
  connectedDevice,
  devices,
  isScanning,
}: {
  scanDevices: () => void;
  connectToDevice: (device: Device) => void;
  sendData: () => void;
  connectingDevice: Device | null;
  connectedDevice: Device | null;
  devices: Device[];
  isScanning: boolean;
}) {
  const isConnecting = !!connectingDevice;

  return (
    <SafeAreaView style={styles.container}>
      <Text
        variant="headlineSmall"
        style={styles.header}
      >
        Tea Mixer
      </Text>

      <BluetoothStatus
        connectingDevice={connectingDevice}
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
            connectingDevice={connectingDevice}
            connectToDevice={connectToDevice}
          />
        </View>
      ) : (
        <View>
          <Button
            mode="contained"
            onPress={sendData}
          >
            Send Data
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
