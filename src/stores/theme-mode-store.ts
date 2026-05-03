import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const THEME_STORAGE_KEY = "app_theme_preference";

type ThemeMode = "light" | "dark" | "system";

type ThemeModeStoreState = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
};

const useThemeStore = create<ThemeModeStoreState>()(
  persist(
    (set) => ({
      themeMode: "system",
      setThemeMode: (mode) => set({ themeMode: mode }),
    }),
    {
      name: THEME_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        themeMode: state.themeMode,
      }),
    },
  ),
);

export const useThemeModeStore = () => {
  const { themeMode, setThemeMode } = useThemeStore();
  const systemColorScheme = useColorScheme();

  const isDark =
    themeMode === "system"
      ? systemColorScheme === "dark"
      : themeMode === "dark";

  return { themeMode, setThemeMode, isDark };
};
