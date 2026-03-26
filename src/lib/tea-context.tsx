import { CHARACTERISTIC_UUID, SERVICE_UUID } from "@/constants/Bluetooth";
import { Buffer } from "buffer";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useBluetoothContext } from "./bluetooth-context";

export type IngredientsType = {
  tea: number;
  condensedMilk: number;
  evaporatedMilk: number;
  milk: number;
};

type TeaContextType = {
  currentIngredients: IngredientsType;
  targetIngredients: IngredientsType;
  isMaking: boolean;
  progress: number;
  makeTea: (ingredients: IngredientsType) => void;
};

const TeaContext = createContext<TeaContextType | null>(null);

const initialTeaIngredients: IngredientsType = {
  tea: 0,
  condensedMilk: 0,
  evaporatedMilk: 0,
  milk: 0,
};

export function TeaContextProvider({ children }: PropsWithChildren) {
  const { connectedDevice, sendJson } = useBluetoothContext();

  const [currentIngredients, setCurrentIngredients] = useState<IngredientsType>(
    initialTeaIngredients,
  );
  const [targetIngredients, setTargetIngredients] = useState<IngredientsType>(
    initialTeaIngredients,
  );

  const [isMaking, setIsMaking] = useState(false);

  const makeTea = (ingredients: IngredientsType) => {
    setIsMaking(true);
    setTargetIngredients(ingredients);
    setCurrentIngredients(initialTeaIngredients);
    sendJson("Send Ingredients", ingredients);
  };

  const progress = useMemo(() => {
    let targetTotal = 0;
    let currentTotal = 0;
    Object.values(targetIngredients).forEach((v) => (targetTotal += v));
    Object.values(currentIngredients).forEach((v) => (currentTotal += v));

    if (targetTotal == 0) return 0;

    if (targetTotal == currentTotal) {
      setIsMaking(false);
      return 100;
    }

    return Math.floor((currentTotal * 100) / targetTotal);
  }, [targetIngredients, currentIngredients]);

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
          setCurrentIngredients(parsed);
        },
      );
    }
  }, [connectedDevice]);

  return (
    <TeaContext.Provider
      value={{
        currentIngredients,
        targetIngredients,
        isMaking,
        progress,
        makeTea,
      }}
    >
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
