import { Tea } from "@/types/tea";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCustomRecipes, initDatabase } from "./database";

type TeaContextType = {
  loading: boolean;
  customRecipes: Tea[];
  loadRecipes: () => Promise<unknown>;
};

const TeaContext = createContext<TeaContextType | null>(null);

export function TeaContextProvider({ children }: PropsWithChildren) {
  const [customRecipes, setCustomRecipes] = useState<Tea[]>([]);
  const [loading, setLoading] = useState(true);

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
