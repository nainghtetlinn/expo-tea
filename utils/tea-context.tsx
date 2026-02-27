import { CHARACTERISTIC_UUID, SERVICE_UUID } from "@/constants/Bluetooth";
import { Buffer } from "buffer";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useBluetoothContext } from "./bluetooth-context";

type ReceivedDataType = {
  tea: number;
  condensedMilk: number;
  evaporatedMilk: number;
  milk: number;
};

type TeaContextType = {
  receivedData: ReceivedDataType;
};

const TeaContext = createContext<TeaContextType | null>(null);

export function TeaContextProvider({ children }: PropsWithChildren) {
  const { connectedDevice } = useBluetoothContext();

  const [receivedData, setReceivedData] = useState<ReceivedDataType>({
    tea: 0,
    condensedMilk: 0,
    evaporatedMilk: 0,
    milk: 0,
  });

  useEffect(() => {
    if (connectedDevice) {
      connectedDevice.monitorCharacteristicForService(
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
          setReceivedData(parsed);
        },
      );
    }
  }, [connectedDevice]);

  return (
    <TeaContext.Provider value={{ receivedData }}>
      {children}
    </TeaContext.Provider>
  );
}

export const useTeaContext = () => {
  const context = useContext(TeaContext);
  if (!context) {
    throw new Error("useTeaContext must be used within TeaContextProvider");
  }
  return context;
};
