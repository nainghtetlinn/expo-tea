import ConnectScreen from "@/screens/connect-screen";
import { useBluetoothContext } from "@/utils/bluetooth-context";
import { requestBLEPermissions } from "@/utils/permission";
import React, { useState } from "react";
import { Alert, Linking, Platform } from "react-native";
import { Device, State } from "react-native-ble-plx";

export default function Connect() {
  const {
    manager,
    connectedDevice,
    setConnectedDevice,
    connectToDevice,
    sendJson,
  } = useBluetoothContext();

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

  const sendData = () => {
    sendJson({
      tea: 40,
      milk: 20,
      condensed: 5,
      evaporated: 10,
    });
  };

  return (
    <ConnectScreen
      scanDevices={scanDevices}
      connectToDevice={connectDevice}
      sendData={sendData}
      connectingDevice={connectingDevice}
      connectedDevice={connectedDevice}
      devices={devices}
      isScanning={isScanning}
    />
  );
}
