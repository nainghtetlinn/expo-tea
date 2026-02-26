import { Buffer } from "buffer";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { BleManager, Device } from "react-native-ble-plx";

const SERVICE_UUID = "3b0947a7-1654-4b40-8f26-8a21169e054b";
const CHARACTERISTIC_UUID = "ede453c3-a6f3-42b4-9077-77dc68fd2f73";

const manager = new BleManager();

type BluetoothContextType = {
  manager: BleManager;
  connectedDevice: Device | null;
  setConnectedDevice: React.Dispatch<React.SetStateAction<Device | null>>;
  sendJson: (data: object) => void;
};

const BluetoothContext = createContext<BluetoothContextType | null>(null);

export function BluetoothContextProvider({ children }: PropsWithChildren) {
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

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
      value={{ manager, connectedDevice, setConnectedDevice, sendJson }}
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
