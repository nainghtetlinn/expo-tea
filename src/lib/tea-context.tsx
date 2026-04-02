import { CHARACTERISTIC_UUID, SERVICE_UUID } from "@/constants/Bluetooth";
import { Tea, TeaIngredients } from "@/types/tea";
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
import { getCustomRecipes, initDatabase } from "./database";

type TeaContextType = {
  loading: boolean;
  customRecipes: Tea[];
  currentIngredients: TeaIngredients;
  targetIngredients: TeaIngredients;
  isMaking: boolean;
  progress: number;
  makeTea: (tea: Tea) => void;
  loadRecipes: () => Promise<unknown>;
};

const TeaContext = createContext<TeaContextType | null>(null);

const initialTeaIngredients: TeaIngredients = {
  tea: 0,
  condensedMilk: 0,
  evaporatedMilk: 0,
  milk: 0,
};

export function TeaContextProvider({ children }: PropsWithChildren) {
  const { connectedDevice, sendJson } = useBluetoothContext();
  const [customRecipes, setCustomRecipes] = useState<Tea[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentIngredients, setCurrentIngredients] = useState<TeaIngredients>(
    initialTeaIngredients,
  );
  const [targetIngredients, setTargetIngredients] = useState<TeaIngredients>(
    initialTeaIngredients,
  );

  const [isMaking, setIsMaking] = useState(false);

  const loadRecipes = async () => {
    try {
      const custom = await getCustomRecipes();
      setCustomRecipes(
        custom.map((recipe) => ({
          id: recipe.id,
          name: {
            en: recipe.name,
            my: recipe.name,
          },
          description: {
            en: recipe.description,
            my: recipe.description,
          },
          ingredients: {
            tea: recipe.tea,
            condensedMilk: recipe.condensedMilk,
            evaporatedMilk: recipe.evaporatedMilk,
            milk: recipe.milk,
          },
        })),
      );
    } catch (error) {
      console.error("Error loading recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const makeTea = (tea: Tea) => {
    console.log("Making tea:", tea.name.en);
    setIsMaking(true);
    setTargetIngredients(tea.ingredients);
    setCurrentIngredients(initialTeaIngredients);
    sendJson("Make tea: " + tea.name, {
      cmd: "make",
      ...tea.ingredients,
    });
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

  useEffect(() => {
    const init = async () => {
      await initDatabase();
      await loadRecipes();
    };
    init();
  }, []);

  return (
    <TeaContext.Provider
      value={{
        loading,
        customRecipes,
        currentIngredients,
        targetIngredients,
        isMaking,
        progress,
        loadRecipes,
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
