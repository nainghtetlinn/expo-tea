import {
  CHARACTERISTIC_UUID,
  manager,
  SERVICE_UUID,
} from "@/constants/Bluetooth";
import ConnectScreen from "@/screens/connect-screen";
import { requestBLEPermissions } from "@/utils/permission";
import { Buffer } from "buffer";
import React, { useEffect, useState } from "react";
import { Alert, Linking, Platform } from "react-native";
import { Device, State } from "react-native-ble-plx";

export default function Connect() {
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device>();

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

  const connectToDevice = async (device: Device) => {
    try {
      if (isConnecting) return;
      setIsConnecting(true);
      setConnectedDevice(device);
      manager.stopDeviceScan();
      console.log("Connecting...");

      const connected = await device.connect();
      await connected.discoverAllServicesAndCharacteristics();

      console.log("Connected:", connected.name);

      connected.onDisconnected(() => {
        console.log("Disconnected:", connected.name);
        setConnectedDevice(undefined);
        setDevices([]);
      });
    } catch (error) {
      console.log("Connection error:", error);
      setConnectedDevice(undefined);
    } finally {
      setIsConnecting(false);
    }
  };

  const sendJson = async () => {
    if (!connectedDevice) return;

    const payload = JSON.stringify({
      tea: 40,
      milk: 20,
      condensed: 5,
      evaporated: 10,
    });

    const base64Data = Buffer.from(payload).toString("base64");

    try {
      await connectedDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64Data,
      );

      console.log("Sent JSON");
    } catch (error) {
      console.log("Write error:", error);
    }
  };

  useEffect(() => {
    const subscription = manager.onStateChange(console.log);
    return () => subscription.remove();
  }, []);

  return (
    <ConnectScreen
      scanDevices={scanDevices}
      connectToDevice={connectToDevice}
      sendJson={sendJson}
      connectedDevice={connectedDevice}
      devices={devices}
      isScanning={isScanning}
      isConnecting={isConnecting}
    />
  );
}
