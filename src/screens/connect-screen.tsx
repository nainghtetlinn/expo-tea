import { BluetoothStatus } from "@/components/bluetooth/bluetooth-status";
import { DevicesList } from "@/components/bluetooth/devices-list";
import React from "react";
import { View } from "react-native";
import { Device } from "react-native-ble-plx";
import { Button, useTheme } from "react-native-paper";

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
  const theme = useTheme();

  const isConnecting = !!connectingDevice;

  return (
    <View
      className="flex-1 p-4"
      style={{
        backgroundColor: theme.colors.background,
      }}
    >
      <BluetoothStatus
        connectingDevice={connectingDevice}
        connectedDevice={connectedDevice}
      />

      {(!connectedDevice || isConnecting) && (
        <View className="mt-4 gap-2">
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
    </View>
  );
}
