import { Buffer } from "buffer";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { BleManager, Device } from "react-native-ble-plx";

export const SERVICE_UUID = "3b0947a7-1654-4b40-8f26-8a21169e054b";
export const CHARACTERISTIC_UUID = "ede453c3-a6f3-42b4-9077-77dc68fd2f73";

const manager = new BleManager();

type BluetoothContextType = {
  manager: BleManager;
  connectedDevice: Device | null;
  setConnectedDevice: React.Dispatch<React.SetStateAction<Device | null>>;
  connectToDevice: (device: Device) => void;
  sendJson: (data: object) => void;
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

      connected.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.log("Monitor error:", error);
            return;
          }

          if (characteristic === null || characteristic.value === null) return;

          const decoded = Buffer.from(
            characteristic.value,
            "base64",
          ).toString();
          const parsed = JSON.parse(decoded);
          console.log(parsed);
        },
      );

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

  const sendJson = async (data: object) => {
    if (!connectedDevice) return;

    const payload = JSON.stringify(data);
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
    <BluetoothContext.Provider
      value={{
        manager,
        connectedDevice,
        setConnectedDevice,
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
    throw new Error("useBluetooth must be used within BluetoothProvider");
  }
  return context;
};
