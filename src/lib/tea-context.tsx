import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { CustomTea, getCustomRecipes, initDatabase } from "./database";

type TeaContextType = {
  loading: boolean;
  customRecipes: CustomTea[];
  loadRecipes: () => Promise<unknown>;
};

const TeaContext = createContext<TeaContextType | null>(null);

export function TeaContextProvider({ children }: PropsWithChildren) {
  const [customRecipes, setCustomRecipes] = useState<CustomTea[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRecipes = async () => {
    try {
      const custom = await getCustomRecipes();
      setCustomRecipes(custom);
    } catch (error) {
      console.error("Error loading recipes:", error);
    } finally {
      setLoading(false);
    }
  };

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
        loadRecipes,
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
