import { manager } from "@/constants/Bluetooth";
import ConnectScreen from "@/screens/connect-screen";
import { useBluetoothContext } from "@/utils/bluetooth-context";
import { requestBLEPermissions } from "@/utils/permission";
import React, { useState } from "react";
import { Alert, Linking, Platform } from "react-native";
import { Device, State } from "react-native-ble-plx";

export default function Connect() {
  const { connectedDevice, connectToDevice } = useBluetoothContext();

  const [isScanning, setIsScanning] = useState(false);
  const [connectingDevice, setConnectingDevice] = useState<Device | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);

  const scanDevices = async () => {
    const hasPermission = await requestBLEPermissions();
    if (!hasPermission) return;

    const state = await manager.state();

    if (state !== State.PoweredOn) {
      Alert.alert(
        "Bluetooth is not enabled",
        "Please enable Bluetooth to connect to the device.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Settings",
            onPress: () => {
              if (Platform.OS === "android") {
                Linking.sendIntent("android.settings.BLUETOOTH_SETTINGS");
              }
            },
          },
        ],
      );
      return;
    }

    if (isScanning) return;
    setIsScanning(true);
    console.log("Scanning...");

    let foundDevices: Device[] = [];
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        return;
      }
      if (
        device &&
        device.name &&
        !foundDevices.find((d) => d.id === device.id)
      ) {
        foundDevices.push(device);
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setDevices(foundDevices);
      setIsScanning(false);
      console.log("Found:", foundDevices.length);
    }, 5000);
  };

  const connectDevice = async (device: Device) => {
    if (connectingDevice) return;

    setConnectingDevice(device);
    await connectToDevice(device);
    setConnectingDevice(null);
  };

  return (
    <ConnectScreen
      scanDevices={scanDevices}
      connectToDevice={connectDevice}
      connectingDevice={connectingDevice}
      connectedDevice={connectedDevice}
      devices={devices}
      isScanning={isScanning}
    />
  );
}
