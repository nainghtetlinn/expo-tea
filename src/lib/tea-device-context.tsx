import { CHARACTERISTIC_UUID, SERVICE_UUID } from "@/constants/Bluetooth";
import {
  createMakeTeaCommand,
  createSetButtonCommand,
} from "@/contracts/teaCommands";
import { TeaIngredients } from "@/types/tea";
import { Buffer } from "buffer";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useBluetoothContext } from "./bluetooth-context";

type TeaDeviceContextType = {
  temperature: number | null;
  progress: number;
  isMaking: boolean;
  targetIngredients: TeaIngredients | null;
  currentProgress: TeaIngredients | null;
  makeTea: (ingredients: TeaIngredients) => void;
  setButtonRecipe: (buttonId: 1 | 2 | 3, recipe: TeaIngredients) => void;
};

const TeaDeviceContext = createContext<TeaDeviceContextType | null>(null);

export function TeaDeviceContextProvider({ children }: PropsWithChildren) {
  const { connectedDevice, sendJson } = useBluetoothContext();

  const [temperature, setTemperature] = useState<number | null>(null);

  const [targetIngredients, setTargetIngredients] =
    useState<TeaIngredients | null>(null);
  const [currentProgress, setCurrentProgress] = useState<TeaIngredients | null>(
    null,
  );

  const [isMaking, setIsMaking] = useState(false);

  useEffect(() => {
    if (!connectedDevice) {
      setTemperature(null);
      return;
    }

    const subscription = connectedDevice.monitorCharacteristicForService(
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      (error, characteristic) => {
        if (error) {
          console.log("Monitor Error:", error);
          return;
        }
        if (characteristic?.value) {
          const decoded = Buffer.from(characteristic.value, "base64").toString(
            "utf-8",
          );
          try {
            const data = JSON.parse(decoded);

            if (data.type === "TEA_START" && data.payload) {
              setTargetIngredients(data.payload);
              setCurrentProgress({
                tea: 0,
                condensedMilk: 0,
                evaporatedMilk: 0,
                milk: 0,
              });
              setIsMaking(true);
            } else if (data.type === "TEA_PROGRESS" && data.payload) {
              setCurrentProgress(data.payload);
            } else if (data.type === "TEA_FINISH") {
            }
          } catch (e) {
            // Ignore invalid parse payloads for notifications
          }
        }
      },
    );

    return () => subscription.remove();
  }, [connectedDevice]);

  const progress = useMemo(() => {
    if (!isMaking || !targetIngredients || !currentProgress) return 0;

    let targetTotal = 0;
    let currentTotal = 0;
    Object.values(targetIngredients).forEach(
      (v) => (targetTotal += v as number),
    );
    Object.values(currentProgress).forEach(
      (v) => (currentTotal += v as number),
    );

    if (targetTotal === 0) return 0;
    if (currentTotal >= targetTotal) return 100;

    return Math.floor((currentTotal * 100) / targetTotal);
  }, [targetIngredients, currentProgress, isMaking]);

  // useEffect(() => {
  //   if (progress === 100 && isMaking) {
  //     setTimeout(() => setIsMaking(false), 1000);
  //   }
  // }, [progress, isMaking]);

  const makeTea = (ingredients: TeaIngredients) => {
    const command = createMakeTeaCommand(ingredients);
    sendJson(command);
    console.log("MAKE_TEA:", command);
  };

  const setButtonRecipe = (buttonId: 1 | 2 | 3, recipe: TeaIngredients) => {
    const command = createSetButtonCommand(buttonId, recipe);
    sendJson(command);
    console.log("SET_BUTTON:", command);
  };

  return (
    <TeaDeviceContext.Provider
      value={{
        temperature,
        progress,
        isMaking,
        targetIngredients,
        currentProgress,
        makeTea,
        setButtonRecipe,
      }}
    >
      {children}
    </TeaDeviceContext.Provider>
  );
}

export const useTeaDeviceContext = () => {
  const context = useContext(TeaDeviceContext);
  if (!context) {
    throw new Error(
      "useTeaDeviceContext must be used within TeaDeviceContextProvider",
    );
  }
  return context;
};
