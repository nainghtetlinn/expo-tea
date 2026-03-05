import {
  CHARACTERISTIC_UUID,
  manager,
  SERVICE_UUID,
} from "@/src/constants/Bluetooth";
import { Buffer } from "buffer";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Device } from "react-native-ble-plx";

type BluetoothContextType = {
  connectedDevice: Device | null;
  connectToDevice: (device: Device) => void;
  sendJson: (name: string, data: object) => void;
};

const BluetoothContext = createContext<BluetoothContextType | null>(null);

export function BluetoothContextProvider({ children }: PropsWithChildren) {
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  const connectToDevice = async (device: Device) => {
    try {
      manager.stopDeviceScan();
      console.log("Connecting...");

      const connected = await device.connect();
      await connected.requestMTU(255);
      await connected.discoverAllServicesAndCharacteristics();

      connected.onDisconnected(() => {
        console.log("Disconnected:", connected.name);
        setConnectedDevice(null);
      });

      setConnectedDevice(device);
      console.log("Connected:", connected.name);
    } catch (error) {
      console.log("Connection error:", error);
    }
  };

  const sendJson = async (name: string, data: object) => {
    if (!connectedDevice) return;

    const payload = JSON.stringify(data);
    const base64Data = Buffer.from(payload).toString("base64");

    try {
      await connectedDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64Data,
      );
      console.log(name);
    } catch (error) {
      console.log("Write error:", error);
    }
  };

  useEffect(() => {
    const subscription = manager.onStateChange(console.log);
    return () => subscription.remove();
  }, []);

  return (
    <BluetoothContext.Provider
      value={{
        connectedDevice,
        connectToDevice,
        sendJson,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
}

export const useBluetoothContext = () => {
  const context = useContext(BluetoothContext);
  if (!context) {
    throw new Error(
      "useBluetoothContext must be used within BluetoothContextProvider",
    );
  }
  return context;
};
